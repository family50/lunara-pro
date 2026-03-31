import React, { useState, forwardRef, useEffect, useRef } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface LuxeMediaProps {
  src: string;
  type?: 'img' | 'video';
  alt?: string;
  className?: string;
  aspectRatio?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  style?: React.CSSProperties;
}

const LuxeMedia = forwardRef<HTMLImageElement | HTMLVideoElement, LuxeMediaProps>(
  ({ src, type, alt, className, aspectRatio, style, ...props }, ref) => {
    const [loaded, setLoaded] = useState(false);
    
    // استخدام HTMLMediaElement كنوع أشمل للصور والفيديو بدون any
    const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);

    const isVideoFile = src.match(/\.(mp4|webm|ogg|mov)$/i);
    const finalType = type || (isVideoFile ? 'video' : 'img');

    // وظيفة دمج الـ refs بنوع بيانات محدد
    const setRefs = (node: HTMLImageElement | HTMLVideoElement | null) => {
      mediaRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLImageElement | HTMLVideoElement | null>).current = node;
      }
    };

  useEffect(() => {
      // التحقق من حالة الفيديو يدوياً فوراً
      if (finalType === 'video' && mediaRef.current instanceof HTMLVideoElement) {
        
        // 1. نتأكد أولاً إن الحالة لسه false عشان م نكررش الـ render
        // 2. نتأكد إن الفيديو جاهز فعلاً
        if (!loaded && mediaRef.current.readyState >= 2) {
          
          // 3. نستخدم requestAnimationFrame عشان نحدث الحالة في "الفريم" الجاي
          // ده بيمنع الـ Synchronous setState error
          const handleAutoLoad = () => setLoaded(true);
          requestAnimationFrame(handleAutoLoad);
        }
      }
    }, [src, finalType, loaded]); // ضفنا loaded هنا عشان الـ Effect يراقب التغيير

    return (
      <div
        key={src}
        className={`luxe-media-wrapper ${className || ''}`}
        style={{
          position: 'relative',
          display: 'contents',
          aspectRatio: aspectRatio,
          ...style,
        }}
      >
        <SkeletonTheme baseColor="#E8E1D3" highlightColor="#F4F1EA">
          {!loaded && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              <Skeleton height="100%" borderRadius="0px" duration={1.5} />
            </div>
          )}
        </SkeletonTheme>

        {finalType === 'img' && (
          <img
            ref={setRefs as React.Ref<HTMLImageElement>}
            src={src}
            alt={alt || "Asset"}
            className={`${className || ''} ${loaded ? 'fade-in-luxe' : 'hide-luxe'}`}
            onLoad={() => setLoaded(true)}
            style={{ objectFit: 'cover' }}
            {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
          />
        )}

        {finalType === 'video' && (
          <video
            ref={setRefs as React.Ref<HTMLVideoElement>}
            src={src}
            className={`${className || ''} ${loaded ? 'fade-in-luxe' : 'hide-luxe'}`}
            onLoadedData={() => setLoaded(true)}
            onCanPlay={() => setLoaded(true)}
            autoPlay={props.autoPlay ?? true}
            loop={props.loop ?? true}
            muted={props.muted ?? true}
            playsInline={props.playsInline ?? true}
            style={{ objectFit: 'cover' }}
            {...(props as React.VideoHTMLAttributes<HTMLVideoElement>)}
          />
        )}

        <style>{`
          .hide-luxe { 
            opacity: 0; 
            visibility: hidden; 
          }
          .fade-in-luxe {
            opacity: 1;
            visibility: visible;
            transition: opacity 1.2s ease;
          }
        `}</style>
      </div>
    );
  }
);

LuxeMedia.displayName = 'LuxeMedia';

export default LuxeMedia;