import "./fotter2.css";

// 1. تعريف واجهة الـ Props للـ Footer
interface FooterProps {
  className?: string;
  bgColor: string;    // اللون الفاتح (عادة من theme.light)
  thumbColor: string;  // اللون الداكن (عادة من theme.dark)
}

const Footer2: React.FC<FooterProps> = ({ 
  className = "", 
  bgColor, 
  thumbColor 
}) => {
  return (
    <footer 
      className={`footer ${className}`} 
      style={{ 
        backgroundColor: thumbColor, 
        color: bgColor 
      }} 
    > 
      <div className="footer-content">
        <div className="footer-brand">
          <img
            src="/______________removed_bg_2026-02-15T01-32-16.png"
            alt="Family Group Logo"
            className="footer-logo"
          />

          <div className="brand-text">
            <h2 style={{ color: bgColor }}>FAMILY GROUP</h2> 
            <p className="footer-description" style={{ color: bgColor }}>
              We specialize in modern web development, creating fast, secure, and
              visually appealing websites tailored to your business needs.
            </p>
          </div>
        </div>

        {/* Social Icons */}
        <div className="footer-social">
          {[
            { href: "https://www.tiktok.com/@familygroup974", icon: "fab fa-tiktok" },
            { href: "https://x.com/FamilyGroup8320", icon: "fab fa-x-twitter" },
            { href: "https://www.linkedin.com/in/family-group-69a419395", icon: "fab fa-linkedin-in" },
            { href: "https://github.com/family50", icon: "fab fa-github" },
            { href: "https://mail.google.com/mail/?view=cm&fs=1&to=familygroup832005@gmail.com", icon: "fa-solid fa-envelope" }
          ].map((social, index) => (
            <a 
              key={index}
              href={social.href} 
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon custom-social-icon"
              style={{ 
                // نمرر المتغيرات للـ CSS للتحكم في الـ Hover
                "--icon-bg": bgColor,
                "--icon-color": thumbColor,
                "--hover-bg": bgColor,
                "--hover-color": thumbColor
              } as React.CSSProperties}
            >
              <i className={social.icon}></i>
            </a>
          ))}
        </div>
      </div>

      {/* الجزء السفلي مع شفافية للحدود */}
      <div 
        className="footer-bottom" 
        style={{ 
            borderTop: `1px solid ${bgColor}33`, 
            color: bgColor,
            opacity: 0.8
        }}
      >
        © 1447 FAMILY GROUP. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer2;