import  { useState } from 'react';
import './cart.css';
import { Link } from 'react-router-dom';
import LuxeMedia from './LuxeMedia';
interface CartItem {
    id: number;
    section: string;
    name: string;
    image: string;
    price: string;
    quantity: number;
    totalPrice: string;
}

interface CartData {
    items: CartItem[];
    totalAmount: string;
    totalQuantity: number;
}

function Cart() {
    // أفضل ممارسة: جلب البيانات مباشرة في الحالة الابتدائية (Lazy Initializer)
    const [cart, setCart] = useState<CartData | null>(() => {
        const rawCart = localStorage.getItem("cart");
        return rawCart ? JSON.parse(rawCart) : null;
    });

    // دالة لحذف منتج (اختياري لجعل الصفحة حيوية)
    const removeFromCart = (id: number, section: string) => {
        if (!cart) return;
        const updatedItems = cart.items.filter(item => !(item.id === id && item.section === section));
        const newTotalQty = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const newTotalAmount = updatedItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
        
        const newCart = { items: updatedItems, totalQuantity: newTotalQty, totalAmount: newTotalAmount };
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="empty-cart11">
                <h2 className="luxury-title11">Your Sanctuary is Empty</h2>
                <p>Discover our royal collection and fill your cart with elegance.</p>
                
                <Link to="/collections" >
    <button className="continue-btn11">Continue Shopping</button>
</Link>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <header className="cart-header">
                <h1 className="luxury-title">Your Selection</h1>
                <p className="cart-subtitle">Review your chosen treasures</p>
            </header>

            <div className="cart-container">
                {/* قائمة المنتجات */}
                <div className="cart-items-list">
                  {cart.items.map((item) => (
                   <div key={`${item.section}-${item.id}`} className="cart-card">
    {/* زر الحذف في الزاوية العلوية اليمنى */}
    <button className="remove-btn-icon" onClick={() => removeFromCart(item.id, item.section)}>
        <i className="fa-solid fa-xmark"></i>
    </button>

    <div className="cart-img-box">
        <LuxeMedia src={item.image} alt={item.name} />
    </div>

    <div className="cart-content-wrapper">
        <div className="cart-item-details">
            <span className="item-category">{item.section}</span>
            <h3 className="item-name">{item.name}</h3>
            <p className="item-price-unit">${item.price}</p>
        </div>

        <div className="cart-item-info-right">
             <div className="qty-badge">Qty: {item.quantity}</div>
             <span className="total-price">${item.totalPrice}</span>
        </div>
    </div>
</div>
                    ))}
                </div>

                {/* ملخص الدفع */}
                <aside className="cart-summary">
                    <div className="summary-box">
                        <h2 className="summary-title">Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal ({cart.totalQuantity} items)</span>
                            <span>${cart.totalAmount}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free-tag">Complimentary</span>
                        </div>
                        <hr className="summary-divider" />
                        <div className="summary-row total-row">
                            <span>Grand Total</span>
                            <span className="final-amount">${cart.totalAmount}</span>
                        </div>
                        <Link to="/payment" >
                        <button className="checkout-btn">
                            Proceed to Checkout
                        </button>
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Cart;