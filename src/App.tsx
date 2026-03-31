import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react"; 

import AssetManager from "./AssetManager";

// Lazy Pages
const Home = lazy(() => import("./home"));
const Collections = lazy(() => import("./collections"));
const About = lazy(() => import("./about"));
const Cart = lazy(() => import("./cart"));
const AllProducts = lazy(() => import("./all-products"));
const OneProduct = lazy(() => import("./one-products"));
const Payment = lazy(() => import("./payment"));

// Components
import Header from "./header";
import ScrollToTop from "./scroll";
import Mouse from "./mouse";
import Loading from "./loding"; 

function AppContent() {
  const location = useLocation();
  const [isEntryLoading, setIsEntryLoading] = useState(true);

  const hideHeaderPaths = ["/all-products", "/one-product", "/payment"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  useEffect(() => {
    // حل مشكلة الـ Synchronous setState:
    // نضع التحديث داخل requestAnimationFrame عشان يشتغل بعد انتهاء دورة الرندر الحالية
    requestAnimationFrame(() => {
      setIsEntryLoading(true);
    });

    const loadAssets = async () => {
      try {
        const startTime = Date.now();

        // انتظر تحميل الميديا الأساسية للمسار الحالي
        await AssetManager.loadRouteAssets(location.pathname);
        
        // حل مشكلة unused-vars:
        // نستخدم elapsedTime فعلياً لحساب الفارق الزمني المطلوب
        const elapsedTime = Date.now() - startTime;
        const minimumWait = 2000; // مدة اللودر الإجمالية لضمان الفخامة

        // لو التحميل أخد وقت أقل من الـ minimumWait، بنطرح الوقت اللي فات عشان نكمل المدة
        const remainingWait = Math.max(0, minimumWait - elapsedTime);

        setTimeout(() => {
          setIsEntryLoading(false);
          
          // تحميل باقي الموقع في الخلفية
          AssetManager.loadEverythingElse();
        }, remainingWait);

      } catch (error) {
        console.error("Critical Assets failed to load", error);
        setTimeout(() => setIsEntryLoading(false), 1000);
      }
    };

    loadAssets();
  }, [location.pathname]);

  return (
    <>
      {/* اللودر يظهر طالما الحالة true */}
      {isEntryLoading && <Loading />}
      
      <ScrollToTop />
      <Mouse />
      {!shouldHideHeader && <Header />}
      
      <Suspense fallback={<Loading />}>
        {/* visibility: hidden تضمن أن الصفحة موجودة في الخلفية وتحمل ولكنها غير مرئية */}
        <div style={{ visibility: isEntryLoading ? 'hidden' : 'visible' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/one-product" element={<OneProduct />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;