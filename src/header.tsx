import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import gsap from 'gsap';
import './header.css';

const navLinks = [
  { name: 'Home', href: '/', icon: 'fa-solid fa-house' },
  { name: 'Collections', href: '/collections', icon: 'fa-solid fa-wand-magic-sparkles' },
  { name: 'About Us', href: '/about', icon: 'fa-solid fa-leaf' },
  { name: 'Cart', href: '/cart', icon: 'fa-solid fa-hand-holding-heart', isCart: true },
];

function Header() {
  const headerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1. مراقبة السكرول لتغيير حالة الهيدر
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. أنميشن التحميل لأول مرة فقط (Intro Animation)
  useLayoutEffect(() => {
    // نستخدم sessionStorage للتأكد أن الأنميشن يحدث مرة واحدة في الجلسة
    const hasAnimated = sessionStorage.getItem('headerAnimated');

    if (!hasAnimated) {
      const ctx = gsap.context(() => {
        gsap.fromTo(headerRef.current, 
          { 
            y: -100, 
            opacity: 0,
            backdropFilter: "blur(0px)" 
          }, 
          { 
            y: 0, 
            opacity: 1, 
            duration: 1.5, 
            ease: "expo.out",
            delay: 0.5 
          }
        );
      });
      sessionStorage.setItem('headerAnimated', 'true');
      return () => ctx.revert();
    }
  }, []);

  return (
    <>
      <header 
        ref={headerRef} 
        className={`header-container ${isScrolled ? 'header-scrolled' : 'header-initial'}`}
      >
        <div className="left-section">
          <img src="/Lunara-Pro-Luxury-Logo.png" alt="Logo" className="logo-img" />
          <h2 className="logo-text">Lunara Pro</h2>
        </div>

        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.href} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${link.isCart ? 'cart-link' : ''}`}
            >
              {link.isCart && <i className={link.icon}></i>}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      {/* الموبايل نيف يفضل بقاؤه بسيطاً لسهولة الاستخدام */}
      <nav className="mobile-bottom-nav">
        {navLinks.map((link) => (
          <NavLink 
            key={link.name} 
            to={link.href} 
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <i className={link.icon}></i>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default Header;