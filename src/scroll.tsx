import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // التنفيذ فوراً عند تغيير المسار
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // نستخدم instant لمنع رؤية المستخدم لعملية السكرول (تجربة فخمة وأسرع)
    });
  }, [pathname]);

  return null; // هذا المكون لا يحتاج لعرض أي UI
};

export default ScrollToTop;