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
    // 1. الأولوية القصوى للصفحة الحالية (سواء كانت هوم، كولكشن، أو غيرها)
    AssetManager.loadRouteAssets(location.pathname);

    // 2. تحميل باقي الموقع في الخلفية
    AssetManager.loadEverythingElse();

    // 3. إدارة شاشة اللودر
    const handleInitialLoad = () => {
      const timer = setTimeout(() => {
        setIsEntryLoading(false);
      }, 3000); 
      return () => clearTimeout(timer);
    };

    if (document.readyState === 'complete') {
      handleInitialLoad();
    } else {
      window.addEventListener('load', handleInitialLoad);
      return () => window.removeEventListener('load', handleInitialLoad);
    }
  }, [location.pathname]); // الكود ده هيتنفذ فوراً مع كل تغيير مسار

  return (
    <>
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