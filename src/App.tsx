import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react"; 

// --- التعديل الجوهري هنا: استخدام lazy loading للصفحات ---
const Home = lazy(() => import("./home"));
const Collections = lazy(() => import("./collections"));
const About = lazy(() => import("./about"));
const Cart = lazy(() => import("./cart"));
const AllProducts = lazy(() => import("./all-products"));
const OneProduct = lazy(() => import("./one-products"));
const Payment = lazy(() => import("./payment"));

// المكونات الثابتة تظل كما هي
import Header from "./header";
import ScrollToTop from "./scroll";
import Mouse from "./mouse";
import Loading from "./loding"; 

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ["/all-products", "/one-product", "/payment"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {/* هذا اللودر سيظهر "فقط" عند أول دخول للموقع (Refresh) بسبب الـ Timeout داخله */}
      <Loading />
      
      <ScrollToTop />
      <Mouse />
      {!shouldHideHeader && <Header />}
      
      {/* الـ Suspense سيراقب الآن تحميل الصفحات "الكسولة" (lazy) */}
      {/* إذا كان النت سريعاً، لن يلحق اللودر بالظهور، أما إذا كان بطيئاً فسيظهر فوراً */}
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