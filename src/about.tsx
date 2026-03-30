import  { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './about.css';
import Footer from './footer';
import {  NavLink } from 'react-router-dom';

// تسجيل الـ Plugin الخاص بالسكروول
gsap.registerPlugin(ScrollTrigger);

function About() {
    // إنشاء المراجع (Refs) مع تحديد الأنواع لـ TypeScript
    const mainRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
const loopRef = useRef<HTMLDivElement>(null);
 useLayoutEffect(() => {
    if (!mainRef.current || !pathRef.current) return;

    // 1. المتغيرات الخاصة بالسير اللانهائي
    const loop = loopRef.current;
    let loopTl: gsap.core.Tween;

    // دالة تحديث السير بناءً على المقاسات الحقيقية للشاشة
    const updateLoop = () => {
        if (!loop || loop.children.length === 0) return;

        const firstCard = loop.children[0] as HTMLElement;
        const cardWidth = firstCard.offsetWidth;
        const style = window.getComputedStyle(loop);
        const gap = parseFloat(style.columnGap) || 0;
        const totalOriginalItems = loop.children.length / 3;
        const travelDistance = (cardWidth + gap) * totalOriginalItems;

        if (loopTl) loopTl.kill();

        loopTl = gsap.to(loop, {
            x: -travelDistance,
            duration: 35, // سرعة هادئة وفخمة
            ease: "none",
            repeat: -1,
            force3D: true,
            onRepeat: () => {
                gsap.set(loop, { x: 0 });
            }
        });
    };

    const handleMouseEnter = () => loopTl && gsap.to(loopTl, { timeScale: 0.2, duration: 1.2 });
    const handleMouseLeave = () => loopTl && gsap.to(loopTl, { timeScale: 1, duration: 1.2 });

    // 2. إنشاء GSAP Context لإدارة جميع الأنميشن
    const ctx = gsap.context(() => {
        
        /* --- 1. انميشن قسم الهيرو --- */
        const heroTl = gsap.timeline();
        heroTl.fromTo(".hero-video-container", 
            { opacity: 0, scale: 1.1 }, 
            { opacity: 0.6, scale: 1, duration: 2.5, ease: "power2.out" }
        )
        .fromTo(".about-hero-content > *", 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 2, stagger: 0.4, ease: "expo.out" }, 
            "0.5"
        );

        /* --- 2. انميشن قسم القصة --- */
        gsap.fromTo(".story-image-wrapper, .story-text-content", 
            { x: (index) => index === 0 ? -100 : 100, opacity: 0 },
            { 
                x: 0, opacity: 1, duration: 1.2, ease: "power3.out", stagger: 0.2,
                scrollTrigger: {
                    trigger: ".about-story-section",
                    start: "75% bottom", 
                    toggleActions: "play reverse play reverse"
                }
            }
        );

        /* --- 3. انميشن قسم الركائز (SVG Path) --- */
        gsap.fromTo(pathRef.current, 
            { strokeDasharray: 2000, strokeDashoffset: 2000 },
            { 
                strokeDashoffset: 0, 
                scrollTrigger: {
                    trigger: ".about-pillars-section",
                    start: "top center",
                    end: "bottom center",
                    scrub: 0.5,
                }
            }
        );

        gsap.utils.toArray<HTMLElement>(".pillar-card").forEach((card) => {
            gsap.fromTo(card, 
                { opacity: 0, y: 100, scale: 0.9 },
                { 
                    opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );
        });

        /* --- 4. انميشن قسم الـ Ritual --- */
        const ritualTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".about-ritual-3d",
                start: "top 80%",
                toggleActions: "play none none reverse",
            }
        });

        ritualTl.fromTo(".ritual-3d-content", 
            { opacity: 0, y: 60, filter: "blur(10px)" }, 
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.8, ease: "expo.out" }
        ).fromTo(".canvas-3d-wrapper", 
            { opacity: 0, scale: 0.9, y: 120 }, 
            { opacity: 1, scale: 1, y: 0, duration: 2.5, ease: "power4.out" }, 
            "-=1.4"
        );

        /* --- 5. تشغيل السير اللانهائي (The Loop) --- */
const loop = loopRef.current;
    let loopTl: gsap.core.Tween;
if (!mainRef.current || !pathRef.current) return;

  ;
    // 1. تعريف الدالة أولاً
    const updateLoop = () => {
        if (!loop || loop.children.length === 0) return;

        const firstCard = loop.children[0] as HTMLElement;
        const cardWidth = firstCard.offsetWidth;
        const style = window.getComputedStyle(loop);
        const gap = parseFloat(style.columnGap) || 0;
        const totalOriginalItems = loop.children.length / 3;
        const travelDistance = (cardWidth + gap) * totalOriginalItems;

        if (loopTl) loopTl.kill();

        loopTl = gsap.to(loop, {
            x: -travelDistance,
            duration: 15, // السرعة الجديدة المطلوبة (أسرع)
            ease: "none",
            repeat: -1,
            force3D: true,
            onRepeat: () => {
                gsap.set(loop, { x: 0 });
            }
        });
    };

    // تعريف دوال الـ Hover
    const handleMouseEnter = () => loopTl && gsap.to(loopTl, { timeScale: 0.2, duration: 1.2 });
    const handleMouseLeave = () => loopTl && gsap.to(loopTl, { timeScale: 1, duration: 1.2 });
        if (loop) {
            
            updateLoop();
            window.addEventListener('resize', updateLoop);
            loop.addEventListener('mouseenter', handleMouseEnter);
            loop.addEventListener('mouseleave', handleMouseLeave);
        }

        /* --- 6. انميشن قسم الـ CTA --- */
        gsap.fromTo(".cta-inner", 
            { opacity: 0, y: 120 },
            { 
                opacity: 1, y: 0, duration: 2, ease: "power4.out", 
                scrollTrigger: {
                    trigger: ".about-cta-section",
                    start: "top 85%",
                }
            }
        );

    }, mainRef);

    // 3. دالة التنظيف النهائية (Cleanup)
    return () => {
        ctx.revert();
        window.removeEventListener('resize', updateLoop);
        if (loop) {
            loop.removeEventListener('mouseenter', handleMouseEnter);
            loop.removeEventListener('mouseleave', handleMouseLeave);
        }
    };
}, []);

    return (
        <main className="about-page-wrapper" ref={mainRef}>
            
            {/* 1. قسم الهيرو: المانيفستو */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <div className="manifesto-badge">
                        <span className="subtitle-gold">EST. 1447 — THE ART OF PURITY</span>
                    </div>
                    <div className="title-wrapper">
                        <h1 className="about-main-title">
                            Elegance <br /> 
                            <span className="italic-gold">in its</span> Purest Form
                        </h1>
                        <span className="bg-watermark">LUNARA</span>
                    </div>
                </div>
                <div className="hero-video-container">
                    <video autoPlay loop muted playsInline className="hero-bg-video">
                        <source src="./02177441816444200000000000000000000ffffc0a8981c53703f.mp4" type="video/mp4" />
                    </video>
                </div>
            </section>

            {/* 2. قسم القصة: البداية */}
            <section className="about-story-section">
                <div className="about-container grid-2-cols">
                    <div className="story-image-wrapper">
                        <img src="./YOUR_STORY_IMAGE.png" alt="The Spark of Lunara" className="reveal-img" />
                    </div>
                    <div className="story-text-content">
                        <h2 className="section-title-gold">Our Origin</h2>
                        <p className="p-accent">
                            Our journey began with a desire to return to the roots, where raw nature meets modern architectural art.
                        </p>
                        <p className="p-muted">
                            Every Lunara creation is the result of years of research to reach the perfect formula.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. قسم الركائز: المسار الذهبي */}
            <section className="about-pillars-section">
                <svg className="pillars-path-svg" viewBox="0 0 1440 1800" fill="none" preserveAspectRatio="none">
                    <path 
                        ref={pathRef}
                        className="path-line" 
                        d="M720,0 C720,300 200,400 200,700 C200,1000 1240,1100 1240,1400 C1240,1600 720,1700 720,1800" 
                    />
                </svg>
                <div className="about-container">
                    <div className="pillars-wrapper">
                        <div className="pillar-card p-left">
                            <span className="pillar-number">01</span>
                            <div className="pillar-content">
                                <div className="pillar-icon-line"></div>
                                <h3>Purity</h3>
                                <p>Hand-selected ingredients from the world's rarest sustainable farms.</p>
                            </div>
                        </div>
                        <div className="pillar-card p-right">
                            <span className="pillar-number">02</span>
                            <div className="pillar-content">
                                <div className="pillar-icon-line"></div>
                                <h3>Craft</h3>
                                <p>Designing each bottle as a sculptural piece of art.</p>
                            </div>
                        </div>
                        <div className="pillar-card p-center">
                            <span className="pillar-number">03</span>
                            <div className="pillar-content">
                                <div className="pillar-icon-line"></div>
                                <h3>Conscious</h3>
                                <p>Luxury that respects the Earth and ethical transparency.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. تجربة الطقوس: المنتج الطافي */}
            <section className="about-ritual-3d">
                <div className="ritual-3d-content">
                    <h2 className="section-title-gold" id='section-title-gold'>The Ritual Experience</h2>
                    <p>A moment dedicated solely to you.</p>
                </div>
                <div className="canvas-3d-wrapper">
                    <img src="/YOUR_3D_ASSET_PNG.png" alt="3D Product" className="floating-3d-asset" />
                    <div className="shadow-overlay"></div>
                </div>
            </section>

            {/* 5. المكونات: اللوب اللانهائي (مكرر لضمان الانسيابية) */}
            <section className="about-ingredients-grid" >
                <div className="ingredients-header about-container">
                    <h2 className="section-title-gold">Nature's Gems</h2>
                </div>
      <div className="macro-gallery-loop" ref={loopRef}>
    {/* المجموعة الأولى */}
    <div className="ingredient-card"><img src="/INGREDIENT_1.png" alt="Rare Flower" /></div>
    <div className="ingredient-card"><img src="/INGREDIENT_2.png" alt="Pure Oil" /></div>
    <div className="ingredient-card"><img src="/INGREDIENT_3.png" alt="Essence Wood" /></div>
    
    {/* المجموعة الثانية (التكرار الأول) */}
    <div className="ingredient-card"><img src="/INGREDIENT_1.png" alt="Rare Flower" /></div>
    <div className="ingredient-card"><img src="/INGREDIENT_2.png" alt="Pure Oil" /></div>
    <div className="ingredient-card"><img src="/INGREDIENT_3.png" alt="Essence Wood" /></div>

    {/* المجموعة الثالثة (التكرار الثاني - لضمان عدم وجود سير فارغ) */}
    <div className="ingredient-card"><img src="/INGREDIENT_1.png" alt="Rare Flower" /></div>
    <div className="ingredient-card"><img src="/INGREDIENT_2.png" alt="Pure Oil" /></div>
    <div className="ingredient-card"><img src="/INGREDIENT_3.png" alt="Essence Wood" /></div>
</div>
            </section>

            {/* 6. دعوة للعمل: النهاية السينمائية */}
            <section className="about-cta-section">
                <div className="cta-overlay-darken"></div>
                <div className="cta-inner about-container">
                    <h2 className="cta-title section-title-gold">Ready to Experience Lunara?</h2>
                    <p className="cta-subtitle">A journey into pure, radiant beauty awaits.</p>
                  
                  < NavLink to="/collections">
                    <button className="btn-gold-outline ripple-bg">Explore the Collection</button>
               </NavLink>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default About;