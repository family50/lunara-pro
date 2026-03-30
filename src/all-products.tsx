import { useLocation, useNavigate } from "react-router-dom";
import { discoverMoreProducts } from './Discover-More';
import "./all-products.css";
import { useLayoutEffect, useRef, useState, useEffect, useMemo, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NavLink } from "react-router-dom";
import Footer2 from "./fotter2";

gsap.registerPlugin(ScrollTrigger);

// --- 1. تعريف الأنواع (Interfaces) ---
interface Theme {
    primary: string;
    light: string;
    dark: string;
    accent: string;
    dark2?: string;
    img22: string;
    Motivation: string;
    dark3: string;
}

interface Review {
    user: string;
    rating: number;
    comment: string;
}

interface Usage {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
}

interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    Evaluation: number;
    Purchasing: number;
    description: string;
    usage: Usage;
    reviews: Review[];
    backgroundProduct: string;
    textColorProduct: string;
}

interface Category {
    theme: Theme;
    products: Product[];
}

type DiscoverMoreData = Record<string, Category>;

function AllProducts() {
    const location = useLocation();
    const navigate = useNavigate();

    // --- تعريف الـ Refs ---
    const mainRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const textRef = useRef<(HTMLHeadingElement | null)[]>([]);
    const allProductsGridRef = useRef<HTMLDivElement>(null);
    const allProductsTitleRef = useRef<HTMLHeadingElement>(null);
    const filterWrapperRef = useRef<HTMLDivElement>(null);

    const params = new URLSearchParams(location.search);
    const sectionKey = params.get("section") || location.state?.sectionKey;
    
    const sectionData = sectionKey ? (discoverMoreProducts as unknown as DiscoverMoreData)[sectionKey] : null;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("Most Popular");

    // --- نظام الصفحات الديناميكي (Pagination) ---
    const [currentPage, setCurrentPage] = useState(1);

    const getProductsPerPage = () => {
        const width = window.innerWidth;
        if (width > 1200) return 9;  // 3 أعمدة * 3 صفوف
        if (width <= 1200 && width > 768) return 6; // عمودين * 3 صفوف
        return 4; // موبايل
    };

    const [productsPerPage, setProductsPerPage] = useState(getProductsPerPage());

    useEffect(() => {
        const handleResize = () => {
            setProductsPerPage(getProductsPerPage());
            
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const bgColor = sectionData?.theme?.light || "#ffffff";
    const thumbColor = sectionData?.theme?.dark || "#000000";

    // --- 1. الترتيب باستخدام useMemo ---
    const sortedProducts = useMemo<Product[]>(() => {
        if (!sectionData?.products) return [];
        const productsCopy = [...sectionData.products];
        switch (activeFilter) {
            case "Lowest Price": return productsCopy.sort((a, b) => a.price - b.price);
            case "Highest Price": return productsCopy.sort((a, b) => b.price - a.price);
            case "Top Rated": return productsCopy.sort((a, b) => b.Evaluation - a.Evaluation);
            case "Most Popular": return productsCopy.sort((a, b) => b.Purchasing - a.Purchasing);
            default: return productsCopy;
        }
    }, [activeFilter, sectionData]);

    // حساب المنتجات المعروضة حالياً
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    // --- 2. GSAP Animations ---
    useLayoutEffect(() => {
        if (!sectionData) return;

        const ctx = gsap.context(() => {
            // أنميشن الهيرو
            gsap.fromTo(imgRef.current, 
                { y: -100, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
            );

            const validTextElements = textRef.current.filter(Boolean);
            gsap.fromTo(validTextElements, 
                { y: -50, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.3, ease: "power3.out", delay: 0.5 }
            );

            // أنميشن Best Seller (Infinite Loop)
            const cards = cardsContainerRef.current;
            if (cards) {
                const totalWidth = cards.scrollWidth;
                const halfWidth = totalWidth / 2;
                const loop = gsap.to(cards, {
                    x: `-=${halfWidth}`,
                    duration: 20,
                    ease: "none",
                    repeat: -1,
                    modifiers: { x: gsap.utils.unitize(val => parseFloat(val) % halfWidth) }
                });
                cards.addEventListener("mouseenter", () => loop.pause());
                cards.addEventListener("mouseleave", () => loop.play());
            }

            // --- أنميشن كروت المنتجات (الظهور والاختفاء المتكرر) ---
           const productCards = gsap.utils.toArray<Element>(".product-card-dark");
            productCards.forEach((card) => {
                gsap.fromTo(card, 
                    { opacity: 0, y: 50, scale: 0.95 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 95%", // يبدأ عندما يظهر 5% من الكارت
                            end: "bottom 5%",  // يختفي عند خروجه
                            toggleActions: "play reverse play reverse" // تكرار الأنميشن دخولاً وخروجاً
                        }
                    }
                );
            });

        }, mainRef);

        return () => ctx.revert();
    }, [sectionData, currentProducts]); // يتم التحديث عند تغيير المنتجات في الصفحة

   

    const filterOptions = [
        { id: "popular", label: "Most Popular" },
        { id: "highPrice", label: "Highest Price" },
        { id: "lowPrice", label: "Lowest Price" },
        { id: "rating", label: "Top Rated" }
    ];

    const otherOptions = filterOptions.filter(opt => opt.label !== activeFilter);
    const lines = sectionData?.theme?.Motivation.split("\n") || [];

    return (
        <div ref={mainRef} className="all-productssss" style={{ backgroundColor: bgColor }}>
            <style>
                {`
                    ::-webkit-scrollbar { width: 12px; }
                    ::-webkit-scrollbar-track { background: ${bgColor}; }
                    ::-webkit-scrollbar-thumb { background-color: ${thumbColor}; border-radius: 20px; border: 3px solid ${bgColor}; }
                    html { scrollbar-width: thin; scrollbar-color: ${thumbColor} ${bgColor}; }
                    ::selection { background-color: ${thumbColor}; color: ${bgColor}; }
                    .page-btn { transition: all 0.3s ease; border: 1px solid ${thumbColor}; }
                    .page-btn.active { background-color: ${thumbColor} !important; color: ${bgColor} !important; transform: scale(1.1); }
                    .page-btn:hover:not(.active) { background-color: ${thumbColor}22; }
                `}
            </style>

            {sectionData && (
                <div className="img-container">
                    <img ref={imgRef} src={sectionData.theme.img22} alt="hero" className="hero-image" />
                    <div className="hero-text-wrapper">
                        {lines.map((line, index) => (
                            <h1 key={index} ref={(el) => { textRef.current[index] = el; }} className="hero-text" style={{ color: sectionData.theme.dark3, fontFamily: "'Cinzel', serif" }}>
                                {line}
                            </h1>
                        ))}
                    </div>
                </div>
            )}

            <div className="best-seller-section" ref={sectionRef}>
                <h2 className="best-seller-text" style={{ color: thumbColor }}>Best Seller</h2>
                <div className="best-seller-main-wrapper" style={{ "--side-color": bgColor } as CSSProperties}>
                    <div className="best-seller-content" ref={cardsContainerRef}>
                        {[...(sectionData?.products?.slice(0, 3) || []), ...(sectionData?.products?.slice(0, 3) || [])].map((product, index) => (
                            <div key={index} className="product-card-simple">
                                <div className="product-img-box"><img src={product.image} alt={product.name} /></div>
                                <div className="product-info-simple" style={{ color: thumbColor }}>
                                    <h3 className="p-name">{product.name}</h3>
                                    <div className="p-rating">
                                        {"★".repeat(Math.floor(product.Evaluation))}
                                        <span className="p-purchases">({product.Purchasing})</span>
                                    </div>
                                    <p className="p-price">${product.price}</p>
                                </div>
                               <NavLink 
                        to="/one-product" 
                        state={{ productId: product.id, sectionKey: sectionKey }}
                        className="explore-btn2" 
                        style={{ 
                            backgroundColor: thumbColor, 
                            color: bgColor, 
                            boxShadow: `0 10px 30px ${thumbColor}66`,
                            textDecoration: 'none', // لإزالة الخط تحت النص
                            display: 'flex',       // لضمان توسط النص
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Explore More
                    </NavLink>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="all-products-header">
                <h2 ref={allProductsTitleRef} className="all-products-title" style={{ color: thumbColor }}>Explore Collection</h2>
                <div ref={filterWrapperRef} className="filter-wrapper"> 
                    <button className="filter-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ backgroundColor: thumbColor, color: bgColor, border: `1px solid ${thumbColor}` }}>
                        <span className="filter-label">Sort By: {activeFilter}</span> 
                        <i className={`fa-solid fa-chevron-down arrow-icon ${isDropdownOpen ? 'rotate' : ''}`} style={{color: bgColor}}></i>
                    </button>
                    {isDropdownOpen && (
                        <ul className="filter-dropdown" style={{ backgroundColor: bgColor, border: `1px solid ${thumbColor}44` }}>
                            {otherOptions.map((option) => (
                                <li key={option.id} className="filter-option" style={{ color: thumbColor }} onClick={() => { setActiveFilter(option.label); setIsDropdownOpen(false); setCurrentPage(1); }}>
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            
           <div className="all-products-grid" ref={allProductsGridRef}>
    {currentProducts.map((product) => (
        <div 
            key={product.id} 
            className="product-card-dark" 
            style={{ 
                backgroundColor: thumbColor, 
                cursor: 'pointer' // جعل المؤشر يتغير ليد عند الوقوف على الكارت
            }}
            // عند الضغط على أي مكان في الكارت
            onClick={() => navigate("/one-product", { 
                state: { productId: product.id, sectionKey: sectionKey } 
            })}
        >
            <div className="p-card-img-wrapper">
                <img src={product.image} alt={product.name} className="p-card-img" />
                
                {/* تم تعديل NavLink إلى Div بسيط أو إزالته لأن الكارت كله صار رابطاً */}
                <div 
                    className="explore-btn3" 
                    style={{ 
                        backgroundColor: thumbColor, 
                        color: bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    Explore
                </div>
            </div>

            <div className="p-card-details" style={{ color: bgColor }}>
                <h3 className="p-card-name">{product.name}</h3>
                <div className="p-card-footer">
                    <div className="p-card-rating">
                        {"★".repeat(Math.floor(product.Evaluation))}
                        <span className="p-card-purchases" style={{ opacity: 0.7 }}>
                            ({product.Purchasing})
                        </span>
                    </div>
                    <p className="p-card-price">${product.price}</p>
                </div>
            </div>
        </div>
    ))}
</div>

            {/* نظام أرقام الصفحات */}
            {totalPages > 1 && (
                <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '40px 0' }}>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{ background: 'none', border: 'none', color: thumbColor, cursor: 'pointer', opacity: currentPage === 1 ? 0.3 : 1 }}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                            key={number}
                            onClick={() => {
                                setCurrentPage(number);
                                allProductsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={`page-btn ${currentPage === number ? 'active' : ''}`}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'transparent',
                                color: thumbColor,
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontFamily: "'Cinzel', serif"
                            }}
                        >
                            {number}
                        </button>
                    ))}

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{ background: 'none', border: 'none', color: thumbColor, cursor: 'pointer', opacity: currentPage === totalPages ? 0.3 : 1 }}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            )}

            <Footer2 
                bgColor={sectionData?.theme.light || "#F2E8D5"} 
                thumbColor={sectionData?.theme.dark || "#8C6D39"} 
            />
        </div>
    );
}

export default AllProducts;