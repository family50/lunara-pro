import { useLocation, useNavigate } from "react-router-dom";
import { discoverMoreProducts } from './Discover-More';
import "./all-products.css";
import { useLayoutEffect, useRef, useState, useEffect, useMemo, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LuxeMedia from './LuxeMedia';
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
    const initialPage = parseInt(params.get("page") || "1");
    const [currentPage, setCurrentPage] = useState(initialPage);
    const sectionKey = params.get("section") || location.state?.sectionKey;
    
    const sectionData = sectionKey ? (discoverMoreProducts as unknown as DiscoverMoreData)[sectionKey] : null;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("Most Popular");

    const getProductsPerPage = () => {
        const width = window.innerWidth;
        if (width > 1200) return 9;
        if (width <= 1200 && width > 768) return 6;
        return 4;
    };

    const productsPerPage = getProductsPerPage();

    useEffect(() => {
        const newParams = new URLSearchParams(location.search);
        newParams.set("page", currentPage.toString());
        navigate({ search: newParams.toString() }, { replace: true });
    }, [currentPage, navigate, location.search]);

    const bgColor = sectionData?.theme?.light || "#ffffff";
    const thumbColor = sectionData?.theme?.dark || "#000000";

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

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    // --- 2. GSAP Animations ---
    useLayoutEffect(() => {
        if (!sectionData) return;

        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.fromTo(imgRef.current, 
                { y: -50, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
            );

            const validTextElements = textRef.current.filter(Boolean);
            gsap.fromTo(validTextElements, 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
            );

            // Best Seller Loop
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
                cards.onmouseenter = () => loop.pause();
                cards.onmouseleave = () => loop.play();
            }

            // Products Grid Animation - الحل النهائي للرعشة والألوان
            const productCards = gsap.utils.toArray<HTMLElement>(".product-card-dark");
            if (productCards.length > 0) {
                // بدلاً من مسح كل شيء، نمسح فقط الخصائص اللي بنعملها أنميشن عشان نحافظ على الألوان
                gsap.set(productCards, { clearProps: "opacity,y,scale,transform" });

                gsap.fromTo(productCards, 
                    { opacity: 0, y: 20, scale: 0.98 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        duration: 0.4, 
                        stagger: 0.03, 
                        ease: "power2.out",
                        overwrite: true,
                        onComplete: () => {
                            ScrollTrigger.refresh(); // تحديث الحسابات بعد ظهور المنتجات
                        }
                    }
                );
            }
        }, mainRef);

        return () => ctx.revert();
    }, [currentPage, activeFilter, sectionData]); // الأنميشن يشتغل مع كل تغيير داتا

    const filterOptions = [
        { id: "popular", label: "Most Popular" },
        { id: "highPrice", label: "Highest Price" },
        { id: "lowPrice", label: "Lowest Price" },
        { id: "rating", label: "Top Rated" }
    ];

    const otherOptions = filterOptions.filter(opt => opt.label !== activeFilter);
    const lines = sectionData?.theme?.Motivation.split("\n") || [];
   
   
   
// 1. تعريف الدالة خارج الـ Effect لتكون متاحة للـ JSX
const handleProductClick = (productId: number) => {
    // حفظ السكرول قبل الانتقال
    sessionStorage.setItem(`scroll-${sectionKey}`, window.scrollY.toString());
    navigate("/one-product", { 
        state: { productId, sectionKey } 
    });
};

// 2. منطق استعادة السكرول
useLayoutEffect(() => {
    const scrollKey = `scroll-${sectionKey}`;

    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }

    const savedScrollPos = sessionStorage.getItem(scrollKey);
    
    if (savedScrollPos) {
        // العودة من صفحة منتج: اذهب للمكان المحفوظ
        window.scrollTo(0, parseInt(savedScrollPos));
        sessionStorage.removeItem(scrollKey); 
    } else {
        // دخول جديد: اصعد للأعلى
        window.scrollTo(0, 0);
    }

    // تهيئة GSAP و ScrollTrigger
    const ctx = gsap.context(() => {
        ScrollTrigger.clearScrollMemory();
        ScrollTrigger.refresh();
    }, mainRef);

    return () => ctx.revert();
    
    // أضفنا sectionData و navigate هنا لإرضاء ESLint وضمان الدقة
}, [sectionKey, sectionData, navigate]);

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
                    /* منع أي Transition CSS يتعارض مع GSAP */
                    .product-card-dark { transition: transform 0.3s ease, box-shadow 0.3s ease !important; }
                `}
            </style>

            {sectionData && (
                <div className="img-container">
                    <LuxeMedia ref={imgRef} src={sectionData.theme.img22} alt="hero" className="hero-image" />
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
                                <div className="product-img-box"><LuxeMedia src={product.image} alt={product.name} /></div>
                                <div className="product-info-simple" style={{ color: thumbColor }}>
                                    <h3 className="p-name">{product.name}</h3>
                                    <div className="p-rating">
                                        {"★".repeat(Math.floor(product.Evaluation))}
                                        <span className="p-purchases">({product.Purchasing})</span>
                                    </div>
                                    <p className="p-price">${product.price}</p>
                                </div>
                                <button 
                                     onClick={() => handleProductClick(product.id)}
                                   
                                    className="explore-btn2" 
                                    style={{ 
                                        backgroundColor: thumbColor, 
                                        color: bgColor, 
                                        boxShadow: `0 10px 30px ${thumbColor}66`,
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    Explore More
                                </button>
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
                        <ul className="filter-dropdown" style={{ backgroundColor: bgColor, border: `1px solid ${thumbColor}44`, zIndex: 10 }}>
                            {otherOptions.map((option) => (
                                <li key={option.id} className="filter-option" style={{ color: thumbColor }} onClick={() => { setActiveFilter(option.label); setIsDropdownOpen(false); setCurrentPage(1); }}>
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            
            <div className="all-products-grid" ref={allProductsGridRef} key={`${currentPage}-${activeFilter}`}>
                {currentProducts.map((product) => (
                    <div 
                        key={product.id} 
                        className="product-card-dark" 
                        style={{ backgroundColor: thumbColor, cursor: 'pointer' }}
                       onClick={() => handleProductClick(product.id)}
                    >
                        <div className="p-card-img-wrapper">
                            <LuxeMedia src={product.image} alt={product.name} className="p-card-img" />
                            <div className="explore-btn3" style={{ backgroundColor: thumbColor, color: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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