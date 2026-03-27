import React, { useRef, useState } from "react";
import "./payment.css";
import { gsap } from "gsap";

// تعريف واجهة بيانات المنتج في السلة (متوافقة مع OneProduct)
interface CartItem {
    name: string;
    quantity: number;
    price: number | string; // تحسباً لأن السعر قد يخزن كنص
}

// تعريف واجهة بيانات السلة المخزنة (متوافقة مع OneProduct)
interface SavedCart {
    totalAmount: string; // OneProduct يحفظها كـ string عبر toFixed(2)
    items: CartItem[];
}

 function Payment() {
   // --- 1. استرجاع المبلغ الإجمالي (تحويله من String إلى Number) ---
const [totalAmount, setTotalAmount] = useState<number>(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
        try {
            const savedCart: SavedCart = JSON.parse(cartData);
            // تحويل النص إلى رقم عشري
            return parseFloat(savedCart.totalAmount) || 0;
        } catch { 
            // تم حذف (e) هنا
            return 0; 
        }
    }
    return 0;
});

// --- 2. استرجاع قائمة المنتجات ---
const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
        try {
            const savedCart: SavedCart = JSON.parse(cartData);
            return savedCart.items || [];
        } catch { 
            // تم حذف (e) هنا وتصحيح القيمة المرجعة لمصفوفة فارغة
            return []; 
        }
    }
    return [];
});
    const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [privilegeId, setPrivilegeId] = useState<string>("");

    const receiptRef = useRef<HTMLDivElement | null>(null);
    const formRef = useRef<HTMLDivElement | null>(null);

    const handleAuthorize = () => {
        if (!formRef.current) return;

        const inputs = formRef.current.querySelectorAll<HTMLInputElement>('.gold-input:not([placeholder*="Optional"])');
        const newErrors: Record<string, boolean> = {};
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                newErrors[input.placeholder] = true;
                isValid = false;
            }
        });

        setErrors(newErrors);

        if (isValid) {
            const generatedId = (Math.random() * 1000000).toFixed(0);
            setPrivilegeId(generatedId);
            setIsReceiptOpen(true);
            
            if (receiptRef.current) {
                gsap.fromTo(receiptRef.current, 
                    { y: -100, opacity: 0, scale: 0.9 }, 
                    { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power4.out", display: "flex" }
                );
            }
            // مسح السلة بعد نجاح الدفع
            localStorage.removeItem("cart");
        }
    };

    const closeReceipt = () => {
        if (receiptRef.current) {
            gsap.to(receiptRef.current, {
                y: -100, opacity: 0, scale: 0.9, duration: 0.5, ease: "power4.in",
                onComplete: () => {
                    // استخدام الدوال لتصفير الحالة وإرضاء ESLint
                    setTotalAmount(0);
                    setCartItems([]);
                    setIsReceiptOpen(false);
                    window.location.reload();
                }
            });
        }
    };

    return (
        <div className="payment-wrapper">
            <div className="payment-main-container" ref={formRef}>
                {totalAmount > 0 ? (
                    <div className="luxury-glass-vault">
                        <div className="vault-header">
                            <h1 className="gold-gradient-text">Treasury Checkout</h1>
                        </div>

                        <div className="flex-engine">
                            <div className="info-wing">
                                <div className="input-cluster">
                                    <input type="text" className={`gold-input ${errors["Recipient Full Name"] ? "input-error" : ""}`} placeholder="Recipient Full Name" />
                                    <div className="flex-row">
                                        <input type="text" className={`gold-input ${errors["Country"] ? "input-error" : ""}`} placeholder="Country" />
                                        <input type="text" className={`gold-input ${errors["City"] ? "input-error" : ""}`} placeholder="City" />
                                    </div>
                                    <input type="text" className={`gold-input ${errors["Detailed Street Address"] ? "input-error" : ""}`} placeholder="Detailed Street Address" />
                                    <div className="flex-row">
                                        <input type="tel" className={`gold-input ${errors["Primary Line"] ? "input-error" : ""}`} placeholder="Primary Line" />
                                        <input type="tel" className="gold-input" placeholder="Secondary (Optional)" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="geometric-divider"></div>

                            <div className="payment-wing">
                                <div className="card-display-area">
                                     <img src="/created.png" alt="Card" className="master-card-img" />
                                </div>
                                <div className="input-cluster">
                                    <input type="text" className={`gold-input ${errors["0000 0000 0000 0000"] ? "input-error" : ""}`} placeholder="0000 0000 0000 0000" />
                                    <div className="flex-row">
                                        <input type="text" className={`gold-input ${errors["MM / YY"] ? "input-error" : ""}`} placeholder="MM / YY" />
                                        <input type="password" className={`gold-input ${errors["CVV"] ? "input-error" : ""}`} placeholder="CVV" />
                                    </div>
                                </div>
                                <div className="grand-summary">
                                    <div className="summary-line">
                                        <span>Total Investment</span>
                                        <span className="gold-price-tag">${totalAmount.toFixed(2)}</span>
                                    </div>
                                    <button className="luxury-submit-btn" onClick={handleAuthorize}>
                                        Authorize Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : !isReceiptOpen && (
                    <div className="empty-vault-state">
                        <div className="empty-content">
                            <h2 className="ethereal-text">The Treasury is Empty</h2>
                            <p className="gold-sub-text">Your collection awaits its first masterpiece.</p>
                            
                            <div className="empty-card-visual">
                                <img src="/created.png" alt="Empty Vault" className="floating-empty-card" />
                                <div className="card-shadow-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="receipt-overlay" ref={receiptRef} style={{display: 'none'}}>
                <div className="luxury-receipt">
                    <button className="close-receipt-btn" onClick={closeReceipt}>✕</button>
                    
                    <div className="receipt-header">
                        <div className="success-icon">✓</div>
                        <h2 className="gold-gradient-text">Payment Authorized</h2>
                        <p>Transaction Successful • Treasury Secured</p>
                    </div>

                    <div className="receipt-body">
                        <div className="receipt-divider"></div>
                        <div className="receipt-items">
                            {cartItems.map((item, index) => (
                                <div key={index} className="receipt-item-row">
                                    <span>{item.name} (x{item.quantity})</span>
                                    {/* التأكد من معالجة السعر سواء كان رقم أو نص */}
                                    <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="receipt-divider"></div>
                        <div className="receipt-total">
                            <span>Final Acquisition Value</span>
                            <span className="total-gold-text">${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="receipt-footer">
                        <p>A confirmation certificate has been sent to your encrypted mail.</p>
                        <small>Family Group Group Privilege ID: #{privilegeId}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;