import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './home.css';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
    const mainRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            
            // --- 1. أنميشن محتوى الهيرو (النصوص والعناوين) ---
            gsap.from(".hero-content > *", {
                y: 60,
                opacity: 0,
                duration: 1.5,
                stagger: 0.3,
                ease: "power3.out"
            });

            // --- 2. أنميشن ظهور خلفية الفيديو (تأثير دخول سينمائي) ---
            gsap.fromTo(".hero-video-bg", 
                { opacity: 0, scale: 1.1 }, 
                { opacity: 1, scale: 1, duration: 2.5, ease: "power2.out" }
            );

            // --- 3. أنميشن ظهور الأشكال الهندسية (تأثير زجاجي متدرج) ---
            gsap.fromTo(".hero-geometric-shape", 
                { opacity: 0, scale: 0.5, filter: "blur(20px)" }, 
                { 
                    opacity: 1, 
                    scale: 1, 
                    filter: "blur(2px)", 
                    duration: 0.8, 
                    delay: 0.2, 
                    stagger: 0.4, 
                    ease: "power3.out" 
                }
            );

            // --- 4. أنميشن الخطوط الجانبية (نمو طولي) ---
            gsap.fromTo(".hero-side-line", 
                { scaleY: 0, opacity: 0 }, 
                { scaleY: 1, opacity: 1, duration: 2.5, delay: 0.5, ease: "expo.out", stagger: 0.3 }
            );

            // --- 5. منطق حركة الطفو المستمرة للأشكال الهندسية ---
            const shapes = gsap.utils.toArray<HTMLElement>('.hero-geometric-shape');
            shapes.forEach((shape, index) => {
                gsap.to(shape, {
                    x: gsap.utils.random(-30, 30),
                    y: gsap.utils.random(-20, 20),
                    rotation: index % 2 === 0 ? 15 : -15,
                    duration: gsap.utils.random(10, 20),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });

            // --- 6. أنميشن السيكشن الثاني (Essence) - المنتج العائم والظل ---
            // (يمكنك إضافة التايم لاين الخاص بالمنتج هنا)
        
            // --- 7. أنميشن ظهور السيكشنات عند التمرير (Scroll Reveal) ---
            const sections = gsap.utils.toArray<HTMLElement>('section');
            sections.forEach((section) => {
                // تخطي سيكشن الهيرو لأنه يظهر مباشرة عند التحميل
                if (section.classList.contains('hero-section')) return;

                gsap.from(section, {
                    opacity: 0,
                    y: 80,
                    duration: 1.5,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                });
            });

            // --- 8. أنميشن شبكة الصور (Ritual Grid) - ظهور متتابع ---
            gsap.from(".ritual-item", {
                scale: 0.9,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".ritual-grid",
                    start: "top 75%"
                }
            });

        }, mainRef);

        // تنظيف الأنميشن عند الخروج من الصفحة
        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);
    // --- أنميشن المعرض الأفقي اللانهائي (Infinite Loop) ---
const track = document.querySelector('.ritual-loop-track');
if (track) {
    const trackWidth = track.scrollWidth / 2;

    gsap.to(".ritual-loop-track", {
        x: -trackWidth,
        duration: 40, // سرعة أبطأ لتناسب حجم الـ Grid الكبير
        ease: "none",
        repeat: -1
    });

    // إبطاء عند المرور بالماوس
    track.addEventListener('mouseenter', () => gsap.to(".ritual-loop-track", { timeScale: 0.2, duration: 1 }));
    track.addEventListener('mouseleave', () => gsap.to(".ritual-loop-track", { timeScale: 1, duration: 1 }));
}

    return (
        <div className="home-page" ref={mainRef}>
            
            {/* القسم الأول: واجهة الموقع (HERO SECTION) - فيديو تفاعلي وعناصر بصرية */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                
                <video 
                    src="/02177426498432500000000000000000000ffffc0a8981cd0b0f4.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="hero-video-bg" 
                />

                {/* عناصر جرافيكية طافية في الخلفية */}
                <div className="hero-side-line line-left"></div>
                <div className="hero-side-line line-right"></div>
                
                <div className="hero-geometric-shape shape-triangle-1"></div>
                <div className="hero-geometric-shape shape-circle-1"></div>
                <div className="hero-geometric-shape shape-diamond-1"></div>

                {/* محتوى الـ Hero الرئيسي */}
                <div className="hero-content">
                    <span className="hero-subtitle">The Essence of Lunara Pro</span>
                    <h1 className="hero-title">
                        Unlock Your<br/> <span>Timeless</span> Glow
                    </h1>
                    <p className="hero-description">
                        A rare fusion of molecular precision and untamed nature. 
                        Discover the new standard of self-care.
                    </p>
                </div>
            </section>


{/* SECTION 1.5: TRANSITION (مساحة للتنفس والانتقال السلس) */}
<section className="scroll-indicator-section">
    <div className="indicator-content">
    <i className="fas fa-spa info-icon-minimal"></i>
        <p className="minimal-scroll-text">Scroll to explore the science of radiance</p>
        <div className="scroll-line-animated"></div>
    </div>
</section>


      






            {/* القسم الثانى: جوهر الفخامة (ESSENCE SECTION) - عرض المنتج مع التركيبة العلمية */}
            <section className="essence-section-luxury">
                {/* الإطار الذهبي الذي يبروز السيكشن كقطعة فنية */}
                <div className="luxury-frame-border"></div>
                
                <div className="essence-grid-container">
                    {/* الجزء البصري */}
                    <div className="essence-visual-part">
                        <div className="product-wrapper">
                            <img 
                                src="/product-placeholder.png" 
                                alt="Lunara Product" 
                                className="floating-bottle-premium" 
                            />
                            <div className="dynamic-shadow-premium"></div>
                        </div>
                    </div>
                    
                    {/* الجزء النصي */}
                    <div className="essence-info-part">
                        <div className="clean-text-content">
                            <div className="emerald-accent-tag"></div>
                            <span className="gold-label">THE FORMULATION</span>
                            <h2>Pure Essence, <br/> <span className="highlight-gold">Radical Results</span></h2>
                            <p>
                                Our formulas bridge the gap between breakthrough molecular science 
                                and the world's most pristine natural elements. We believe true 
                                beauty is an internal glow, meticulously revealed through 
                                intentional daily rituals.
                            </p>
                        </div>
                    </div>
                </div>
            </section>





                  {/* القسم الثالث: شبكة الطقوس اليومية (RITUAL SECTION) - معرض صور بأسلوب عصري */}
       {/* القسم الثالث: شبكة الطقوس اليومية (RITUAL SECTION) - المعرض العائم */}
<section className="ritual-section">
    <div className="ritual-container-wrapper">
        <div className="ritual-blur-overlay left"></div>
        <div className="ritual-blur-overlay right"></div>
        
        <div className="ritual-loop-track">
            {/* الشبكة الأولى */}
            <div className="ritual-grid">
                <div className="ritual-item item-1"><img src="/ritual-1.png" alt="1" /></div>
                <div className="ritual-item item-2"><img src="/ritual-2.png" alt="2" /></div>
                <div className="ritual-item item-3"><img src="/ritual-3.png" alt="3" /></div>
                <div className="ritual-item item-4"><img src="/ritual-4.png" alt="4" /></div>
            </div>
            {/* الشبكة الثانية (للتكرار) */}
            <div className="ritual-grid">
                <div className="ritual-item item-1"><img src="/ritual-1.png" alt="1" /></div>
                <div className="ritual-item item-2"><img src="/ritual-2.png" alt="2" /></div>
                <div className="ritual-item item-3"><img src="/ritual-3.png" alt="3" /></div>
                <div className="ritual-item item-4"><img src="/ritual-4.png" alt="4" /></div>
            </div>
        </div>
    </div>
</section>


            {/* القسم الرابع: المقولة أو الفلسفة (STATEMENT SECTION) - رسالة العلامة التجارية */}
            <section className="statement-section">
                <div className="gold-line"></div>
                <h2 className="statement-text">
                    "True luxury is found in the quiet moments of self-care 
                    where body and soul find harmony."
                </h2>
                <span className="statement-author">M. Yousef / Web Developer</span>
            </section>


        </div>
    );
};

export default Home;