import React, { useState, forwardRef } from 'react';
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

// الحل الاحترافي: تعريف الـ Ref إنه ممكن يكون صورة أو فيديو
const LuxeMedia = forwardRef<HTMLImageElement | HTMLVideoElement, LuxeMediaProps>(
  ({ src, type, alt, className, aspectRatio, style, ...props }, ref) => {
    const [loaded, setLoaded] = useState(false);

    const isVideoFile = src.match(/\.(mp4|webm|ogg|mov)$/i);
    const finalType = type || (isVideoFile ? 'video' : 'img');

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
            // نمرر الـ ref مباشرة لـ TypeScript وسيفهم أنه للصورة هنا
            ref={ref as React.Ref<HTMLImageElement>}
            src={src}
            alt={alt || "Asset"}
            className={`${className} ${loaded ? 'fade-in-luxe' : 'hide-luxe'}`}
            onLoad={() => setLoaded(true)}
            style={{ objectFit: 'cover' }}
            {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
          />
        )}

        {finalType === 'video' && (
          <video
            // نمرر الـ ref مباشرة لـ TypeScript وسيفهم أنه للفيديو هنا
            ref={ref as React.Ref<HTMLVideoElement>}
            src={src}
            className={`${className} ${loaded ? 'fade-in-luxe' : 'hide-luxe'}`}
            onLoadedData={() => setLoaded(true)}
            autoPlay={props.autoPlay ?? true}
            loop={props.loop ?? true}
            muted={props.muted ?? true}
            playsInline={props.playsInline ?? true}
            style={{ objectFit: 'cover' }}
            {...(props as React.VideoHTMLAttributes<HTMLVideoElement>)}
          />
        )}

        <style>{`
          .hide-luxe { opacity: 0; }
          .fade-in-luxe {
            opacity: 1;
            transition: opacity 1.2s ease;
          }
        `}</style>
      </div>
    );
  }
);

LuxeMedia.displayName = 'LuxeMedia';

export default LuxeMedia;