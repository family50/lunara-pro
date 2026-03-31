import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './home.css';
import Footer from './footer';
import LuxeMedia from './LuxeMedia';
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
    const mainRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            
            // --- 1. أنميشن الهيرو (كما هو بدون تغيير) ---
            gsap.from(".hero-content > *", {
                y: 60,
                opacity: 0,
                duration: 1.5,
                stagger: 0.3,
                ease: "power3.out"
            });

            gsap.fromTo(".hero-video-bg", 
                { opacity: 0, scale: 1.1 }, 
                { opacity: 1, scale: 1, duration: 3, ease: "power2.out" }
            );

            gsap.fromTo(".hero-geometric-shape", 
                { opacity: 0, scale: 0.5, filter: "blur(20px)" }, 
                { 
                    opacity: 1, 
                    scale: 1, 
                    filter: "blur(2px)", 
                    duration: 1, 
                    delay: 0.2, 
                    stagger: 0.4, 
                    ease: "power3.out" 
                }
            );

            gsap.fromTo(".hero-side-line", 
                { scaleY: 0, opacity: 0 }, 
                { scaleY: 1, opacity: 1, duration: 2.5, delay: 0.5, ease: "expo.out", stagger: 0.3 }
            );

            // أنميشن الطفو المستمر للأشكال
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

           // --- 2. أنميشن سيكشن Essence (سريع وفخم) ---
const essenceTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".essence-section-luxury",
        start: "top 50%", // يبدأ الأنميشن فور وصول 50% من الديف في منطقة الرؤية
        toggleActions: "play none none none"
    }
});

essenceTl
    // ظهور الإطار الذهبي بسرعة خاطفة
    .fromTo(".luxury-frame-border", 
        { opacity: 0, scale: 0.98 }, 
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
    )
    
    // دخول الزجاجة بتأثير Blur سريع ومركز
    .fromTo(".floating-bottle-premium", 
        { 
            y: 80, 
            opacity: 0, 
            scale: 0.9, 
            filter: "blur(10px)" 
        }, 
        { 
            y: 0, 
            opacity: 1, 
            scale: 1, 
            filter: "blur(0px)", 
            duration: 1.2, 
            ease: "expo.out" 
        }, "-=0.7")

    // ظهور الظل بشكل فوري تقريباً مع الزجاجة
    .fromTo(".dynamic-shadow-premium", 
        { opacity: 0 }, 
        { opacity: 0.4, duration: 1, ease: "power2.out" }, "-=1")

    // أنميشن الـ Emerald Tag
    .fromTo(".emerald-accent-tag", 
        { height: 0 }, 
        { height: "100%", duration: 0.6, ease: "power4.inOut" }, "-=0.8")

    // ظهور النصوص بـ Stagger سريع جداً ليعطي شعوراً بالكفاءة
    .fromTo(".essence-info-part h2, .gold-label", 
        { y: 30, opacity: 0, letterSpacing: "5px" }, 
        { y: 0, opacity: 1, letterSpacing: "normal", duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.6")

    // ظهور الفقرة النصية النهائية
    .fromTo(".essence-info-part p", 
        { y: 15, opacity: 0 }, 
        { y: 0, opacity: 0.8, duration: 0.8, ease: "power2.out" }, "-=0.4");

            // --- 3. أنميشن سيكشن Ritual (السيكشن الثالث) - الـ Loop اللانهائي ---
            // نستخدم xPercent: -50 لأن المسار يحتوي على نسختين متطابقتين من الشبكة
            gsap.fromTo(".ritual-loop-track", 
                { x: 0 }, 
                { 
                    xPercent: -50, 
                    duration: 35, 
                    ease: "none", 
                    repeat: -1 
                }
            );

            // ظهور الصور لأول مرة عند التمرير
            gsap.fromTo(".ritual-item", 
                { scale: 0.8, opacity: 0, y: 30 }, 
                { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    duration: 1.2, 
                    stagger: 0.15, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".ritual-section",
                        start: "top 85%"
                    }
                }
            );

            // إبطاء وتسريع عند الماوس
            const track = document.querySelector('.ritual-loop-track');
            if (track) {
                track.addEventListener('mouseenter', () => gsap.to(".ritual-loop-track", { timeScale: 0.2, duration: 1 }));
                track.addEventListener('mouseleave', () => gsap.to(".ritual-loop-track", { timeScale: 1, duration: 1 }));
            }

         // --- 4. أنميشن سيكشن Statement (السيكشن الرابع) ---
const statementTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".statement-section",
        // يبدأ عندما يلمس أسفل الشاشة (bottom) منتصف السيكشن (top 50%)
        start: "top 80% bottom", 
        toggleActions: "play none none none"
    }
});

statementTl
    // ظهور الخط الذهبي بتأثير توسع أفقي (Center Out)
    .fromTo(".gold-line", 
        { scaleX: 0, opacity: 0 }, 
        { scaleX: 1, opacity: 1, duration: 1.5, ease: "power3.out" }
    )
    
    // ظهور المقولة بتأثير "Blur to Clear" سريع مع تحرك بسيط للأعلى
    .fromTo(".statement-text", 
        { 
            y: 30, 
            opacity: 0, 
            filter: "blur(10px)" 
        }, 
        { 
            y: 0, 
            opacity: 1, 
            filter: "blur(0px)", 
            duration: 1.2, 
            ease: "power3.out" 
        }, "-=0.8") // يبدأ قبل انتهاء الخط الذهبي بـ 0.8 ثانية

    // ظهور اسم الكاتب بنعومة (Fade In)
    .fromTo(".statement-author", 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5");

        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="home-page" ref={mainRef}>
            
            {/* القسم الأول: HERO SECTION */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <LuxeMedia 
                
                    src="/02177426498432500000000000000000000ffffc0a8981cd0b0f4.mp4" 
                    autoPlay loop muted playsInline
                    className="hero-video-bg" 
                />
                <div className="hero-side-line line-left"></div>
                <div className="hero-side-line line-right"></div>
                <div className="hero-geometric-shape shape-triangle-1"></div>
                <div className="hero-geometric-shape shape-circle-1"></div>
                <div className="hero-geometric-shape shape-diamond-1"></div>

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

            {/* SECTION 1.5: TRANSITION */}
            <section className="scroll-indicator-section">
                <div className="indicator-content">
                    <i className="fas fa-spa info-icon-minimal"></i>
                    <p className="minimal-scroll-text">Scroll to explore the science of radiance</p>
                    <div className="scroll-line-animated"></div>
                </div>
            </section>

            {/* القسم الثاني: ESSENCE SECTION */}
            <section className="essence-section-luxury">
                <div className="luxury-frame-border"></div>
                <div className="essence-grid-container">
                    <div className="essence-visual-part">
                        <div className="product-wrapper">
                            <LuxeMedia src="/product-placeholder.png" alt="Lunara Product" className="floating-bottle-premium" />
                            <div className="dynamic-shadow-premium"></div>
                        </div>
                    </div>
                    <div className="essence-info-part">
                        <div className="clean-text-content">
                            <div className="emerald-accent-tag"></div>
                            <span className="gold-label">THE FORMULATION</span>
                            <h2>Pure Essence, <br/> <span className="highlight-gold">Radical Results</span></h2>
                            <p>
                                Our formulas bridge the gap between breakthrough molecular science 
                                and the world's most pristine natural elements. We believe true 
                                beauty is an internal glow.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* القسم الثالث: RITUAL SECTION */}
            <section className="ritual-section">
                <div className="ritual-label-container">
                    <span className="ritual-small-label">Our Daily Rituals</span>
                </div>
                <div className="ritual-container-wrapper">
                    <div className="ritual-blur-overlay left"></div>
                    <div className="ritual-blur-overlay right"></div>
                    <div className="ritual-loop-track">
                        <div className="ritual-grid">
                            <div className="ritual-item item-1"><LuxeMedia src="/ritual-1.png" alt="1" /></div>
                            <div className="ritual-item item-2"><LuxeMedia src="/ritual-2.png" alt="2" /></div>
                            <div className="ritual-item item-3"><LuxeMedia src="/ritual-3.png" alt="3" /></div>
                            <div className="ritual-item item-4"><LuxeMedia src="/ritual-4.png" alt="4" /></div>
                        </div>
                        <div className="ritual-grid">
                            <div className="ritual-item item-1"><LuxeMedia src="/ritual-1.png" alt="1" /></div>
                            <div className="ritual-item item-2"><LuxeMedia src="/ritual-2.png" alt="2" /></div>
                            <div className="ritual-item item-3"><LuxeMedia src="/ritual-3.png" alt="3" /></div>
                            <div className="ritual-item item-4"><LuxeMedia src="/ritual-4.png" alt="4" /></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* القسم الرابع: STATEMENT SECTION */}
            <section className="statement-section">
                <div className="gold-line"></div>
                <h2 className="statement-text">
                    "True luxury is found in the quiet moments of self-care 
                    where body and soul find harmony."
                </h2>
                <span className="statement-author">M. Yousef / Web Developer</span>
            </section>

            <Footer />
        </div>
    );
};

export default Home;