import { useLayoutEffect, useRef } from 'react';
import './collections.css';
import { discoverMoreProducts } from './Discover-More';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// تفعيل إضافة ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function Collections() {
    const containerRef = useRef(null);
    const headerRef = useRef(null);

    const categories = Object.entries(discoverMoreProducts).map(([key, value]) => ({
        id: key,
        ...value
    }));

useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        
        // 1. أنميشن الهيدر
        if (headerRef.current) {
            gsap.from(headerRef.current, {
                y: 50,
                opacity: 0,
                duration: 1.5,
                ease: "power3.out"
            });
        }

        // 2. حل مشكلة الـ TweenTarget (Type Casting)
        // نحدد أن العناصر هي Array من HTMLElement
        const cards = gsap.utils.toArray<HTMLElement>('.collection-card');
        
        cards.forEach((card) => {
            gsap.fromTo(card, 
                { 
                    opacity: 0, 
                    y: 80,
                    scale: 0.95 
                }, 
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.8,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    }
                }
            );

            // حل مشكلة querySelector لصور الـ img
            const cardImg = card.querySelector('img');
            if (cardImg) {
                gsap.from(cardImg, {
                    scale: 1.3,
                    duration: 2.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%"
                    }
                });
            }
        });

    }, containerRef);

    return () => ctx.revert();
}, []);

    return (
        <section className="collections-container" ref={containerRef}>
            <header className="collections-header" ref={headerRef}>
                <h1>Our Collections</h1>
                <p>Curated rituals designed for the connoisseur of fine beauty.</p>
            </header>

            <div className="collections-grid">
                {categories.map((category) => (
                    <Link 
                      to={`/all-products?section=${category.id}`} 
            key={category.id}
                        className={`collection-card card-${category.id}`}
                    >
                        <div className="card-image-wrapper">
                            <img src={category.theme.img22} alt={category.id} />
                            <div className="card-overlay">
                                <div className='card-overlay-text'>
                                    <h2 style={{ color: category.theme.dark3 }}>
                                        {category.id}
                                    </h2>
                                    <span style={{ color: category.theme.dark3, borderColor: category.theme.dark3 }}>
                                        {category.theme.Motivation}
                                    </span>

                                    <div className="explore-btn" style={{ color: category.theme.dark3, borderBottomColor: category.theme.dark3 }}>
                                        Explore Collection
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default Collections;