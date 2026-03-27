import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { discoverMoreProducts } from './Discover-More';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./one-products.css";

// تسجيل ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- 1. تعريف الأنواع بناءً على قاعدة بياناتك ---
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
    theme: {
        primary: string;
        light: string;
        dark: string;
        accent: string;
        dark2?: string;
        img22: string;
        Motivation: string;
        dark3: string;
    };
    products: Product[];
}

// الواجهة الكلية التي تتبع هيكل ملف Discover-More
interface DiscoverMoreProductsData {
    hair: Category;
    body: Category;
    face: Category;
    gift: Category;
    natural: Category;
}

// تعريف هيكل العنصر الواحد داخل السلة
interface CartItem {
    id: number;
    section: string;
    name: string;
    image: string;
    price: string;
    quantity: number;
    totalPrice: string;
}

// تعريف هيكل السلة بالكامل
interface CartData {
    items: CartItem[];
    totalAmount: string;
    totalQuantity: number;
}

function OneProduct() {
 
    const location = useLocation();

    const mainContainerRef = useRef<HTMLDivElement>(null);

    // استخراج المفاتيح والـ ID مع تحديد النوع بدقة
    const productId = location.state?.productId as number;
    const sectionKey = location.state?.sectionKey as keyof DiscoverMoreProductsData;
    
    // استخراج القسم والمنتج مع Casting آمن لبيانات الاستيراد
    const data = discoverMoreProducts as unknown as DiscoverMoreProductsData;
    const section = sectionKey ? data[sectionKey] : undefined;
    const product = section?.products.find((p) => p.id === productId);

    const [quantity, setQuantity] = useState(1);

    const totalPrice = product ? (product.price * quantity).toFixed(2) : "0.00";

    const increaseQty = () => setQuantity(prev => prev + 1);
    const decreaseQty = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };



  const addToCart = () => {
    if (!product) return;
    setQuantity(1);

    // 1. تحديد نوع البيانات المسترجعة من الـ LocalStorage
    const rawCart = localStorage.getItem("cart");
    const cart: CartData = rawCart 
        ? JSON.parse(rawCart) 
        : { items: [], totalAmount: "0.00", totalQuantity: 0 };

    // 2. البحث عن المنتج بنوع بيانات صريح (CartItem)
    const existingProductIndex = cart.items.findIndex(
        (item: CartItem) => item.id === productId && item.section === sectionKey
    );
    
    const productPrice = product.price;
    const addedQuantity = quantity;

    if (existingProductIndex > -1) {
        const item = cart.items[existingProductIndex];
        item.quantity += addedQuantity;
        item.totalPrice = (item.quantity * productPrice).toFixed(2);
    } else {
        cart.items.push({
            id: productId,
            section: sectionKey as string,
            name: product.name,
            image: product.image,
            price: productPrice.toFixed(2),
            quantity: addedQuantity,
            totalPrice: (productPrice * addedQuantity).toFixed(2)
        });
    }

    // 3. استخدام الأنواع الصريحة في الـ Reduce
    cart.totalQuantity = cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((sum: number, item: CartItem) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
    
    localStorage.setItem("cart", JSON.stringify(cart));
        const btn = document.querySelector(".add-to-cart-btn") as HTMLElement;
        if (btn) {
            gsap.set(btn, { pointerEvents: "none" });
            const tl = gsap.timeline({
                onComplete: () => { gsap.set(btn, { pointerEvents: "auto" }); }
            });

            tl.to(btn, { scale: 0.8, duration: 0.1, ease: "power2.in" })
              .to(btn, { 
                scale: 1.2, 
                backgroundColor: "#00ff73", 
                color: "#000",
                boxShadow: "0 0 50px #00ff73", 
                duration: 0.3, 
                ease: "back.out(3)" 
              })
              .to(btn, { rotate: 3, x: 10, repeat: 5, yoyo: true, duration: 0.04 }) 
              .to(btn, { 
                scale: 1, 
                backgroundColor: product.textColorProduct, 
                color: product.backgroundProduct, 
                boxShadow: "0 0 0px rgba(0,0,0,0)",
                rotate: 0, x: 0, duration: 0.5, ease: "expo.out" 
              });
        }
    };

    useEffect(() => {
        gsap.fromTo(".qty-number", 
            { scale: 1.5, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }
        );
    }, [quantity]);
useLayoutEffect(() => {
        if (!product) return;

        const ctx = gsap.context(() => {
            // 1. أنميشن ظهور عناصر المنتج عند فتح الصفحة
            const immediateReveal = [
                ".product-image-section", 
                ".product-title1", 
                ".product-description12",
                ".product-meta", 
                ".product-price1", 
                ".quantity-selector", 
                ".add-to-cart-btn"
            ];

            gsap.fromTo(immediateReveal,
                { 
                    opacity: 0, 
                    y: 40, 
                    rotateX: -10, 
                    scale: 0.95 
                },
                { 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0, 
                    scale: 1, 
                    duration: 1.5, 
                    stagger: 0.1, 
                    ease: "expo.out", 
                    delay: 0.1 
                }
            );

        }, mainContainerRef);

        return () => ctx.revert();
    }, [product]);

    if (!product) return <div className="error-msg">Product not found</div>;

    const bgColor = product.backgroundProduct || "#ffffff";
    const textColor = product.textColorProduct || "#000000";
 
   

    return (
        <div ref={mainContainerRef} className="one-product-page" style={{ backgroundColor: bgColor }}>
            <style>
                {`
                  body { background-color: ${bgColor}; margin: 0; }
                  .usage-section::before { background: linear-gradient(to right, ${bgColor} 0%, ${bgColor} 30%, rgba(0,0,0,0) 100%); }
                  .usage-section::after { background: linear-gradient(to left, ${bgColor} 0%, ${bgColor} 30%, rgba(0,0,0,0) 100%); }
                  .add-to-cart-btn:hover { background-color: ${bgColor} !important; color: ${textColor} !important; border: 2px solid ${textColor} !important; }
                  ::-webkit-scrollbar-track { background-color: ${bgColor} !important; }
                  ::-webkit-scrollbar-thumb { background-color: ${textColor} !important; border: 2px solid ${bgColor} !important; }
                `}
            </style>
            <style>
    {`
      body { background-color: ${bgColor}; margin: 0; }
      
      /* تنسيق السكرول بار للمتصفح بالكامل */
      ::-webkit-scrollbar {
        width: 10px; /* عرض السكرول */
      }

      /* خلفية مسار السكرول - تأخذ لون خلفية المنتج */
      ::-webkit-scrollbar-track {
        background: ${bgColor} !important;
      }

      /* الجزء المتحرك من السكرول - يأخذ لون نصوص المنتج */
      ::-webkit-scrollbar-thumb {
        background: ${textColor} !important;
        border-radius: 10px;
        border: 2px solid ${bgColor}; /* يعطي مسافة جمالية حول السكرول */
      }

      /* لون السكرول عند الوقوف عليه بالماوس */
      ::-webkit-scrollbar-thumb:hover {
        filter: brightness(1.2);
      }

      /* للمتصفحات التي تدعم خاصية scrollbar-color (مثل Firefox) */
      * {
        scrollbar-width: thin;
        scrollbar-color: ${textColor} ${bgColor};
      }

      .add-to-cart-btn:hover { 
        background-color: ${bgColor} !important; 
        color: ${textColor} !important; 
        border: 2px solid ${textColor} !important; 
      }
    `}
</style>
<style>
    {`
      /* الحاوية الخارجية - لجعلها تبدو كأنها منصة عرض (Gallery Pedestal) */
      .main-product-img-container {
        position: relative;
        padding: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        /* خلفية ضوئية ناعمة جداً في المنتصف */
        background: radial-gradient(circle at center, ${textColor}08 0%, transparent 70%);
        perspective: 1500px; /* للتحكم في عمق الحركة ثلاثية الأبعاد */
      }

      /* 3. التنسيق الملكي المطور (The Ethereal Frame) */
      .main-product-img {
        position: relative;
        z-index: 2;
        max-width: 100%;
        border-radius: 20px;
        
        /* بدلاً من الإطار التقليدي، نستخدم "وهج زجاجي" */
        border: 0.5px solid rgba(140, 109, 57, 0.15);
        background: rgba(255, 255, 255, 0.02);
        backdrop-filter: blur(5px);

        /* تدرج معقد للظل يعطي إحساساً بالوزن الحقيقي (High-End Rendering) */
        box-shadow: 
            0 10px 30px -10px ${textColor}22,
            0 40px 80px -20px ${textColor}15;

        transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        filter: drop-shadow(0 15px 25px ${textColor}22); /* يتبع شكل المنتج نفسه */
      }

      /* طبقة "البريق الملكي" (The Floating Aura) */
      .main-product-img-container::after {
        content: '';
        position: absolute;
        width: 80%; height: 80%;
        /* هالة ذهبية مطفية خلف المنتج مباشرة */
        background: radial-gradient(circle, var(--primary-gold) 0%, transparent 60%);
        opacity: 0.15;
        filter: blur(60px);
        z-index: 1;
        pointer-events: none;
      }

      /* تأثير الهوفر - الفخامة في الهدوء (Subtle Majesty) */
      .main-product-img-container:hover .main-product-img {
        /* رفع المنتج للأعلى مع إمالة سينمائية بسيطة */
        transform: translateY(-20px) rotateX(4deg) rotateY(-2deg) scale(1.02);
        
        /* تضخيم الظل السفلي فقط ليوحي بالارتفاع عن الأرض */
        box-shadow: 
            0 60px 100px -30px ${textColor}25;
            
        filter: brightness(1.08) drop-shadow(0 30px 45px ${textColor}33);
      }

      /* لمسة "الضوء المتحرك" - وكأن كشاف إضاءة يمر على المنتج */
      .main-product-img-container::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
            125deg, 
            transparent 0%, 
            transparent 40%, 
            rgba(140, 109, 57, 0.1) 50%, 
            transparent 60%, 
            transparent 100%
        );
        background-size: 200% 200%;
        background-position: 200% 200%;
        transition: 1.5s ease;
        z-index: 3;
        pointer-events: none;
      }

      .main-product-img-container:hover::before {
        background-position: -200% -200%;
      }

      /* تأثير "الانعكاس الزجاجي" (Mirror Floor) */
      .main-product-img-container .reflection {
         position: absolute;
         bottom: -20px;
         width: 90%;
         height: 40px;
         background: linear-gradient(to bottom, ${textColor}10, transparent);
         filter: blur(10px);
         transform: scaleY(-1);
         opacity: 0.3;
      }
    `}
</style>

            <div className="product-main-wrapper">
                <div className="product-image-section">
                    <img src={product.image} alt={product.name} className="main-product-img" />
                </div>
                
                <div className="product-info-section" style={{ color: textColor }}>
                    <h1 className="product-title1">{product.name}</h1>
                    <p className="product-description12">{product.description}</p>
                    <div className="meta">
                        <div className="product-meta">
                             <span><i className="fa-solid fa-star"></i> {product.Evaluation}</span>
                             <span className="separator">|</span>
                             <span><i className="fa-solid fa-bag-shopping"></i> {product.Purchasing} Purchases</span>
                        </div>
                        <h2 className="product-price1">${totalPrice}</h2>
                    </div>

                    <div className="quantity-selector">
                        <button className="qty-btn" onClick={decreaseQty} style={{ backgroundColor: textColor, color: bgColor }}>
                            <i className="fa-solid fa-minus"></i>
                        </button>
                        <span className="qty-number" style={{ color: textColor }}>{quantity}</span>
                        <button className="qty-btn" onClick={increaseQty} style={{ backgroundColor: textColor, color: bgColor }}>
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    
                    <button className="add-to-cart-btn" style={{ backgroundColor: textColor, color: bgColor }} onClick={addToCart}>
                        <i className="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
         </div>
    );
}

export default OneProduct;