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
  
  // خلّي القيمة الابتدائية true دايماً
  const [isEntryLoading, setIsEntryLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const hideHeaderPaths = ["/all-products", "/one-product", "/payment"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  useEffect(() => {
    if (hasLoadedOnce) return;

    const loadCriticalAssets = async () => {
      try {
        // 1. نضمن إن اللودر بدأ فعلاً قبل أي عمليات ثقيلة
        setIsEntryLoading(true);

        // 2. انتظر تحميل الأصول (فيديو، صور)
        await AssetManager.loadRouteAssets(location.pathname);
        
        // 3. (اختياري) إضافة تأخير بسيط جداً (مثلاً 100ms) 
        // لضمان أن المتصفح قام بعمل Render لصفحة الهوم خلف الكواليس
        await new Promise(resolve => setTimeout(resolve, 100));

        // 4. أول ما يخلص التحميل:
        setIsEntryLoading(false);
        setHasLoadedOnce(true);

        // تحميل الباقي في الخلفية
        AssetManager.loadEverythingElse();

      } catch (error) {
        console.error("Critical Assets failed to load", error);
        setIsEntryLoading(false);
        setHasLoadedOnce(true);
      }
    };

    loadCriticalAssets();
  }, [hasLoadedOnce, location.pathname]);

  return (
    <>
      {/* تأكد إن مكون Loading واخد z-index: 9999 في الـ CSS بتاعه */}
      {isEntryLoading && <Loading />}
      
      <ScrollToTop />
      <Mouse />
      {!shouldHideHeader && <Header />}
      
      <Suspense fallback={null}> 
        <div style={{ 
          // لو لسه بيحمل لأول مرة، اخفي المحتوى تماماً
          display: (isEntryLoading && !hasLoadedOnce) ? 'none' : 'block'
        }}>
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