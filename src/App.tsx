import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./header";
import Home from "./home";
import Collections from "./collections";
import About from "./about";
import Cart from "./cart";

function App() {
  return (
    <Router>
      <Header />
      <main style={{ paddingTop: '90px' }}> {/* مساحة للهيدر الثابت */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;