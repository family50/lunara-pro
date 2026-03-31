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
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const hideHeaderPaths = ["/all-products", "/one-product", "/payment"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  useEffect(() => {
    if (hasLoadedOnce) return;

    const loadCriticalAssets = async () => {
      // 1. وقت بداية العملية
      const startTime = Date.now();

      try {
        // 2. انتظر تحميل الميديا (حتى لو قعدت سنة)
        await AssetManager.loadRouteAssets(location.pathname);
        
        // 3. احسب الوقت اللي فات
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // 4. حد أدنى لبقاء اللودر (مثلاً 2000ms = ثانيتين)
        // لو الميديا حملت في 500ms، هيستنى 1500ms كمان عشان يكمل الثانيتين
        const minTime = 2000; 
        const waitTime = Math.max(0, minTime - duration);

        setTimeout(() => {
          setIsEntryLoading(false);
          setHasLoadedOnce(true);
          AssetManager.loadEverythingElse();
        }, waitTime);

      } catch (error) {
        console.error("Critical Assets failed to load", error);
        setTimeout(() => {
          setIsEntryLoading(false);
          setHasLoadedOnce(true);
        }, 1000);
      }
    };

    loadCriticalAssets();
  }, [hasLoadedOnce, location.pathname]);

  return (
    <>
      {/* اللودر */}
      {isEntryLoading && <Loading />}
      
      <ScrollToTop />
      <Mouse />
      {!shouldHideHeader && <Header />}
      
      <Suspense fallback={null}> 
        <div style={{ 
          // بنستخدم opacity مع transition عشان الصفحة تظهر بنعومة بعد اللودر
          opacity: (isEntryLoading && !hasLoadedOnce) ? 0 : 1,
          display: (isEntryLoading && !hasLoadedOnce) ? 'none' : 'block',
          transition: 'opacity 0.8s ease-in-out'
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