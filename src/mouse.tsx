import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import './mouse.css';

const Mouse = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // حالة الكشف عن الموبايل
  
  const cursor = useRef({ x: 0, y: 0 });
  const points = useRef<{ x: number; y: number; time: number }[]>([]);

  useEffect(() => {
    // كشف إذا كان الجهاز موبايل أو تابلت (Touch Device)
    const checkDevice = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouch);
    };
    
    checkDevice();
    if (isMobile) return; // توقف عن إكمال الكود لو موبايل

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    const outer = outerRef.current;
    if (!canvas || !dot || !outer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursor.current = { x: clientX, y: clientY };

      const transformStr = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      dot.style.transform = transformStr;
      outer.style.transform = transformStr;

      const target = e.target as HTMLElement;
      const isPointer = window.getComputedStyle(target).cursor === "pointer" || 
                        target.closest("button") || 
                        target.closest("a");
      setIsHovered(!!isPointer);
    };

    const luxuryGold = "#C5A059"; 

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      points.current.push({ ...cursor.current, time: now });
      points.current = points.current.filter(p => now - p.time < 400);

      if (points.current.length > 1) {
        ctx.strokeStyle = luxuryGold;
        ctx.lineWidth = 1.3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(points.current[0].x, points.current[0].y);
        for (let i = 1; i < points.current.length - 1; i++) {
          const xc = (points.current[i].x + points.current[i + 1].x) / 2;
          const yc = (points.current[i].y + points.current[i + 1].y) / 2;
          ctx.quadraticCurveTo(points.current[i].x, points.current[i].y, xc, yc);
        }
        ctx.stroke();
      }
      requestAnimationFrame(render);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", moveCursor);
    handleResize();
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [isMobile]);

  // لو موبايل، لا ترسم أي شيء (Return null)
  if (isMobile) return null;

  return (
    <>
      <canvas ref={canvasRef} className="velvet-trail" />
      <div ref={dotRef} className="velvet-core" />
      <div ref={outerRef} className="velvet-outer-container" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 999999 }}>
        <motion.div
          className={`velvet-outer ${isHovered ? 'is-hovering' : ''}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
          transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '0.5px solid rgba(197, 160, 89, 0.4)',
            backgroundColor: 'rgba(197, 160, 89, 0.05)',
            backdropFilter: 'blur(4px)'
          }}
        />
      </div>
    </>
  );
};

export default Mouse;