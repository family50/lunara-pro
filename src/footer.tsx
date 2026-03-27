import './footer.css';

function Footer() {
    return (
        <footer className="footer-section">
            <div className="footer-container">
                {/* الجزء العلوي: شعار شركة التطوير */}
                <div className="footer-brand-area">
                    <img src="/family-group-logo.png" alt="Family Group Logo" className="developer-logo" />
                    <h3 className="developer-title">Family Group</h3>
                    <p className="developer-tagline">Crafting Digital Masterpieces</p>
                </div>

                {/* الجزء الأوسط: رسالة المشروع */}
                <div className="footer-project-info">
                    <p className="project-statement">
                        <span className="brand-name">Lunara Pro</span> is a signature creation developed by our team, 
                        merging luxury aesthetics with high-performance technology.
                    </p>
                </div>

            {/* الجزء السفلي: الأيقونات والحقوق */}
<div className="footer-social-links">
    <a href="https://www.tiktok.com/@familygroup974" className="social-icon" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-tiktok"></i>
    </a>
    <a href="https://x.com/FamilyGroup8320" className="social-icon" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-x-twitter"></i>
    </a>
    <a href="https://www.linkedin.com/in/family-group-69a419395" className="social-icon" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-linkedin-in"></i>
    </a>
    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=familygroup832005@gmail.com" className="social-icon" target="_blank" rel="noopener noreferrer">
        <i className="fas fa-envelope"></i>
    </a>
    <a href="https://github.com/family50" className="social-icon" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-github"></i>
    </a>
</div>

                <div className="footer-bottom-line">
                    <p>&copy; 1447 Family Group. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;