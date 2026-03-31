import { 
    ALL_PRELOAD_IMAGES, 
    HOME_ASSETS, 
    ABOUT_ASSETS, 
    COLLECTIONS_ASSETS, 
    PAYMENT_ASSETS 
} from './assetsData';

// تعريف النوع الخاص بـ Fetch Priority لأن TS لا يدعمه بشكل افتراضي في الإصدارات القديمة
interface FetchOptions extends RequestInit {
    priority?: 'high' | 'low' | 'auto';
}

class AssetManager {
    private static loadedAssets = new Set<string>();

    static load(urls: string[], highPriority: boolean = false): void {
        urls.forEach((url) => {
            if (!url || this.loadedAssets.has(url)) return;

            if (url.endsWith('.mp4')) {
                const video = document.createElement('video');
                video.src = url;
                video.preload = 'auto';
                video.muted = true;
                this.loadedAssets.add(url);
            } else {
                const img = new Image();
                
                // حل مشكلة الـ any هنا باستخدام Interface محدد
                if (highPriority && 'fetch' in window) {
                    const options: FetchOptions = { priority: 'high' };
                    fetch(url, options).catch(() => {
                        // فشل الـ fetch لا يعطل الموقع، سيتحمل من خلال img.src
                    });
                }
                
                img.src = url;
                img.onload = () => this.loadedAssets.add(url);
            }
        });
    }

    static loadRouteAssets(pathname: string): void {
        if (pathname === '/') {
            this.load([HOME_ASSETS.VIDEOS.HERO_BG], true);
            this.load(HOME_ASSETS.IMAGES.RITUALS, true);
        } else if (pathname.includes('/about')) {
            this.load([ABOUT_ASSETS.VIDEOS.HERO_BG], true);
            this.load(Object.values(ABOUT_ASSETS.IMAGES.PILLARS), true);
            this.load(ABOUT_ASSETS.IMAGES.INGREDIENTS, true);
        } else if (pathname.includes('/collections')) {
            this.load(Object.values(COLLECTIONS_ASSETS.CATEGORY_BGS), true);
        } else if (pathname.includes('/payment')) {
            this.load([PAYMENT_ASSETS.CARD_VISUAL], true);
        }
    }

    static loadEverythingElse(): void {
        if ('requestIdleCallback' in window) {
            // حل مشكلة الـ any في requestIdleCallback
            window.requestIdleCallback(() => {
                this.load(ALL_PRELOAD_IMAGES);
            });
        } else {
            setTimeout(() => this.load(ALL_PRELOAD_IMAGES), 3000);
        }
    }
}

export default AssetManager;