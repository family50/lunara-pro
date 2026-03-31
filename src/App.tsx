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
  
  // اللودر بيبدأ true دائماً في أول دخلة
  const [isEntryLoading, setIsEntryLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const hideHeaderPaths = ["/all-products", "/one-product", "/payment"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  useEffect(() => {
    // لو حملنا مرة خلاص، مش هنشغل اللودر تاني أبداً عند التنقل
    if (hasLoadedOnce) return;

    const loadCriticalAssets = async () => {
      try {
        // سطر الـ await ده هو "مفتاح الصبر"
        // مش هيعدي للسطر اللي بعده غير لما AssetManager يقول "كله تمام"
        // حتى لو قعد سنة بيحمل
        await AssetManager.loadRouteAssets(location.pathname);
        
        // أول ما يخلص التحميل فوراً:
        setIsEntryLoading(false); // اخفي اللودر فورا
        setHasLoadedOnce(true);   // سجل إننا خلصنا أول مرة

        // ابدأ حمل باقي الموقع (Collections, About, الخ) في صمت من غير ما تعطل المستخدم
        AssetManager.loadEverythingElse();

      } catch (error) {
        console.error("Critical Assets failed to load", error);
        // حتى لو حصل فشل، بنفتح الموقع بعد فترة عشان ميفضلش معلق
        setIsEntryLoading(false);
        setHasLoadedOnce(true);
      }
    };

    loadCriticalAssets();
  }, [hasLoadedOnce, location.pathname]);

  return (
    <>
      {/* شاشة اللودينج تظهر فقط في البداية */}
      {isEntryLoading && <Loading />}
      
      <ScrollToTop />
      <Mouse />
      {!shouldHideHeader && <Header />}
      
      <Suspense fallback={null}> 
        {/* visibility: hidden تضمن إن الهوم مرسومة وجاهزة في الخلفية بس مستنية اللودر يختفي */}
        <div style={{ 
          visibility: (isEntryLoading && !hasLoadedOnce) ? 'hidden' : 'visible',
          opacity: (isEntryLoading && !hasLoadedOnce) ? 0 : 1,
          transition: 'opacity 0.5s ease' // اختيار اختياري لنعومة الظهور
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