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
    // 1. تشغيل تحميل ملفات الصفحة الحالية
    // بنخلي الميثود دي ترجع Promise عشان نعرف امتى خلصت
    const loadAssets = async () => {
      // إجبار اللودر يظهر عند بداية أي تحميل لو محتاج، 
      // بس غالباً إنت عايزه في أول دخلة للموقع بس (Entry)
      
      try {
        // انتظر تحميل الصور والفيديوهات الأساسية للمسار الحالي
        await AssetManager.loadRouteAssets(location.pathname);
        
        // 2. بمجرد ما الأساسيات تخلص، بنقفل اللودر بس بنسيب وقت بسيط للـ Transition
        setTimeout(() => {
          setIsEntryLoading(false);
        }, 500); // نص ثانية إضافية عشان النعومة
        
        // 3. تحميل باقي الموقع "في صمت" في الخلفية
        AssetManager.loadEverythingElse();
        
      } catch (error) {
        console.error("Assets failed to load", error);
        // حتى لو حصل خطأ، اقفل اللودر عشان المستخدم ميعلقش
        setIsEntryLoading(false);
      }
    };

    loadAssets();

  }, [location.pathname]);

  return (
    <>
      {/* اللودر هيختفي فقط لما setIsEntryLoading تبقى false */}
      {isEntryLoading && <Loading />}
      <ScrollToTop />
      <Mouse />
      {!shouldHideHeader && <Header />}
      
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/one-product" element={<OneProduct />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
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