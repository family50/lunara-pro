import React, { useState, forwardRef, useEffect, useRef, useCallback } from 'react';
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
    const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);

    const isVideoFile = src.match(/\.(mp4|webm|ogg|mov)$/i);
    const finalType = type || (isVideoFile ? 'video' : 'img');

    // دالة موحدة لتأكيد التحميل
    const handleMediaLoaded = useCallback(() => {
      if (!loaded) {
        setLoaded(true);
      }
    }, [loaded]);

    const setRefs = (node: HTMLImageElement | HTMLVideoElement | null) => {
      mediaRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLImageElement | HTMLVideoElement | null>).current = node;
      }
    };

    useEffect(() => {
      // إعادة ضبط الحالة عند تغيير المصدر (src)
    

      const checkLoadingStatus = () => {
        if (!mediaRef.current) return;

        if (finalType === 'video' && mediaRef.current instanceof HTMLVideoElement) {
          const video = mediaRef.current;
          // التحقق لو الفيديو محمل بالفعل أو شغال
          if (video.readyState >= 3 || video.currentTime > 0) {
            handleMediaLoaded();
          }
        } else if (finalType === 'img' && mediaRef.current instanceof HTMLImageElement) {
          const img = mediaRef.current;
          if (img.complete && img.naturalWidth > 0) {
            handleMediaLoaded();
          }
        }
      };

      // فحص فوري
      checkLoadingStatus();

      // فحص احتياطي بعد ثانية لو الـ events مفصلتش السكتون
      const backupTimer = setTimeout(checkLoadingStatus, 1000);

      return () => clearTimeout(backupTimer);
    }, [src, finalType, handleMediaLoaded]);

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
                top: 0, left: 0, width: '100%', height: '100%',
                zIndex: 10, pointerEvents: 'none',
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
            onLoad={handleMediaLoaded}
            style={{ objectFit: 'cover' }}
            {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
          />
        )}

        {finalType === 'video' && (
          <video
            ref={setRefs as React.Ref<HTMLVideoElement>}
            src={src}
            className={`${className || ''} ${loaded ? 'fade-in-luxe' : 'hide-luxe'}`}
            onLoadedData={handleMediaLoaded}
            onCanPlay={handleMediaLoaded}
            onPlaying={handleMediaLoaded} // لو الفيديو بدأ يشتغل فعلاً
            autoPlay={props.autoPlay ?? true}
            loop={props.loop ?? true}
            muted={props.muted ?? true}
            playsInline={props.playsInline ?? true}
            style={{ objectFit: 'cover' }}
            {...(props as React.VideoHTMLAttributes<HTMLVideoElement>)}
          />
        )}

        <style>{`
          .hide-luxe { opacity: 0; visibility: hidden; }
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