import { discoverMoreProducts } from './Discover-More';

/**
 * --- 1. Helper Functions (Type-Safe) ---
 */

// جلب صورة الـ Hero (الخلفية) من الثيم الخاص بكل قسم
const getHeroImg = (categoryKey: keyof typeof discoverMoreProducts): string => {
    return discoverMoreProducts[categoryKey].theme.img22;
};

// جلب صور أول 4 منتجات للتحميل المسبق السريع
const getTopProductsImages = (categoryKey: keyof typeof discoverMoreProducts): string[] => {
    return discoverMoreProducts[categoryKey].products.slice(0, 4).map((p) => p.image);
};

/**
 * --- 2. Home Page Assets ---
 */
export const HOME_ASSETS = {
    VIDEOS: {
        HERO_BG: "/02177426498432500000000000000000000ffffc0a8981cd0b0f4.mp4",
    },
    IMAGES: {
        PRODUCT_PLACEHOLDER: "/product-placeholder.png",
        RITUALS: [
            "/ritual-1.png",
            "/ritual-2.png",
            "/ritual-3.png",
            "/ritual-4.png",
        ]
    }
};

/**
 * --- 3. About Page Assets ---
 */
export const ABOUT_ASSETS = {
    VIDEOS: {
        HERO_BG: "/02177441816444200000000000000000000ffffc0a8981c53703f.mp4",
    },
    IMAGES: {
        STORY_REVEAL: "/YOUR_STORY_IMAGE.png",
        FLOATING_3D_PLACEHOLDER: "/YOUR_3D_ASSET_PNG.png",
        CTA_CRYSTAL: "/cta-crystal-image.png",
        PILLARS: {
            PURITY: "/purity.png",
            CRAFT: "/craft.png",
            CONSCIOUS: "/conscious.png"
        },
        INGREDIENTS: [
            "/INGREDIENT_1.png",
            "/INGREDIENT_2.png",
            "/INGREDIENT_3.png",
        ]
    }
};

/**
 * --- 4. Collections & Categories Assets ---
 */
export const COLLECTIONS_ASSETS = {
    CATEGORY_BGS: {
        HAIR: getHeroImg('hair'),
        BODY: getHeroImg('body'),
        FACE: getHeroImg('face'),
        GIFT: getHeroImg('gift'),
        NATURAL: getHeroImg('natural'),
    },
    PRIORITY_PRODUCTS: {
        HAIR: getTopProductsImages('hair'),
        BODY: getTopProductsImages('body'),
        FACE: getTopProductsImages('face'),
        GIFT: getTopProductsImages('gift'),
        NATURAL: getTopProductsImages('natural'),
    }
};

/**
 * --- 5. Cart Page Assets ---
 */
export const CART_ASSETS = {
    SUGGESTIONS: (Object.keys(discoverMoreProducts) as Array<keyof typeof discoverMoreProducts>).map((key) => {
        const category = discoverMoreProducts[key];
        return {
            categoryName: key,
            image: category.products[0].image, 
            link: `/collections/${key}`
        };
    })
};

/**
 * --- 6. Payment Assets ---
 */
export const PAYMENT_ASSETS = {
    CARD_VISUAL: "/created.png",
};

/**
 * --- 7. The Master Preload Array (Final Dynamic Version) ---
 * تجمع كافة الروابط أوتوماتيكياً لضمان تجربة مستخدم فائقة السرعة
 */

// استخراج كافة صور الأقسام والمنتجات من قاعدة البيانات
const ALL_CATEGORY_IMAGES = Object.values(discoverMoreProducts).flatMap((category) => [
    // 1. صورة الـ Background
    category.theme.img22,
    
    // 2. صور المنتجات (استنتاج النوع تلقائياً من أول منتج في قسم hair)
    ...category.products.map((product: typeof discoverMoreProducts.hair.products[0]) => product.image)
]);
// تجميع كل المصفوفات وحذف التكرار لضمان أداء مثالي
export const ALL_PRELOAD_IMAGES: string[] = Array.from(new Set([
    // صور قاعدة البيانات
    ...ALL_CATEGORY_IMAGES,

    // صور الصفحات الثابتة
    ...HOME_ASSETS.IMAGES.RITUALS,
    ...ABOUT_ASSETS.IMAGES.INGREDIENTS,
    ABOUT_ASSETS.IMAGES.STORY_REVEAL,
    ABOUT_ASSETS.IMAGES.CTA_CRYSTAL,
    ABOUT_ASSETS.IMAGES.FLOATING_3D_PLACEHOLDER,
    ...Object.values(ABOUT_ASSETS.IMAGES.PILLARS),
    
    // أصول الـ Collections و الـ Cart (للتأكيد)
    ...Object.values(COLLECTIONS_ASSETS.CATEGORY_BGS),
    ...Object.values(COLLECTIONS_ASSETS.PRIORITY_PRODUCTS).flat(),
    ...CART_ASSETS.SUGGESTIONS.map(s => s.image),
    
    // أصول الدفع والـ Placeholder
    PAYMENT_ASSETS.CARD_VISUAL,
    HOME_ASSETS.IMAGES.PRODUCT_PLACEHOLDER
])).filter(Boolean);


// أضف هذه الوظيفة في نهاية ملف assetsData.ts
export const preloadAssets = (urls: string[]) => {
    urls.forEach((url) => {
        if (url.endsWith('.mp4')) {
            const video = document.createElement('video');
            video.src = url;
            video.preload = 'auto';
        } else {
            const img = new Image();
            img.src = url;
        }
    });
};