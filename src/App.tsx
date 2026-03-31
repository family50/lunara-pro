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
  
  // الحالة دي بتتحكم في اللودر الكبير
  const [isEntryLoading, setIsEntryLoading] = useState(true);
  // الحالة دي بتضمن إن اللودر يشتغل "أول مرة فقط"
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const hideHeaderPaths = ["/all-products", "/one-product", "/payment"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  useEffect(() => {
    // لو تم التحميل أول مرة، اخرج من الـ Effect ومتحملش لودر تاني
    if (hasLoadedOnce) return;

    const loadAssets = async () => {
      try {
        const startTime = Date.now();

        // انتظر تحميل الميديا الأساسية لأول صفحة يفتحها المستخدم (غالباً الهوم)
        await AssetManager.loadRouteAssets(location.pathname);
        
        const elapsedTime = Date.now() - startTime;
        const minimumWait = 500; // ثانيتين لضمان ظهور اللوجو بفخامة

        const remainingWait = Math.max(0, minimumWait - elapsedTime);

        setTimeout(() => {
          setIsEntryLoading(false);
          setHasLoadedOnce(true); // سجل إن أول تحميل خلص بنجاح
          
          // ابدأ سحب باقي الموقع في الخلفية "صامت"
          AssetManager.loadEverythingElse();
        }, remainingWait);

      } catch (error) {
        console.error("Initial Assets failed to load", error);
        setIsEntryLoading(false);
        setHasLoadedOnce(true);
      }
    };

    loadAssets();
  }, [hasLoadedOnce, location.pathname]); // الـ Effect ده هيركز على أول دخول فقط

  return (
    <>
      {/* اللودر هيظهر فقط في أول دخول للموقع */}
      {isEntryLoading && <Loading />}
      
      <ScrollToTop />
      <Mouse />
      {!shouldHideHeader && <Header />}
      
      <Suspense fallback={null}> 
        {/* ملحوظة: الـ Suspense هنا خليناه null أو لودر خفيف جداً عشان التنقل بين الصفحات يبقى سريع */}
        <div style={{ visibility: (isEntryLoading && !hasLoadedOnce) ? 'hidden' : 'visible' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/product/:section/:id" element={<OneProduct />} />
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