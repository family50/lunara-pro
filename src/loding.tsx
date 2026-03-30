import  { useState, useEffect } from 'react';

const Loading = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1. تحديد الحد الأدنى للوقت (ثانيتين) لإعطاء هيبة للبراند
    const minDisplayTime = new Promise((resolve) => setTimeout(resolve, 2000));

    // 2. تحديد وقت انتهاء تحميل كافة عناصر الصفحة (صور، فيديوهات، ملفات)
    const pageLoaded = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve(true);
      } else {
        window.addEventListener('load', resolve);
      }
    });

    // 3. الانتظار حتى يتحقق الشرطين معاً
    Promise.all([minDisplayTime, pageLoaded]).then(() => {
      // إضافة ثانية إضافية "نعومة" بعد التحميل الفعلي
      setTimeout(() => {
        setIsVisible(false);
      }, 500); 
    });

    return () => window.removeEventListener('load', () => {});
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style>
        {`
          /* --- 1. الحاوية الخارجية (الخلفية الملكية والزجاج) --- */
          .luxury-loader-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: var(--bg-cream); /* الخلفية الكريمي */
            display: flex; flex-direction: column;
            justify-content: center; align-items: center;
            z-index: 10000000;
            /* أنميشن الاختفاء التدريجي (يبدأ عند 1.6 ثانية ليستغرق 0.4 ثانية) */
            animation: finalFadeOut 0.4s ease 1.6s forwards;
            overflow: hidden;
          }

          /* طبقة زجاجية عائمة (Floating Glass) خلف اللوجو لزيادة الفخامة */
          .glass-aura {
            position: absolute;
            width: 500px; height: 500px;
            background: radial-gradient(circle, rgba(140, 109, 57, 0.04) 0%, transparent 70%);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            z-index: 1;
            animation: auraPulse 4s infinite ease-in-out;
          }

          /* --- 2. المحتوى الداخلي --- */
          .loader-content {
            display: flex; flex-direction: column;
            align-items: center; gap: 40px; /* مسافة كبيرة للفخامة */
            z-index: 2;
            position: relative;
          }

          /* اللوجو الكبير العائم */
          .loader-logo {
            width: 200px; /* حجم كبير للوجو */
            height: auto;
            opacity: 0;
            filter: drop-shadow(0 10px 20px rgba(98, 77, 63, 0.1));
            animation: logoEntrance 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          }

          /* --- 3. النص (Lunara Pro) --- */
          .brand-name {
            font-family: var(--font-primary); /* خط Playfair Display الملكي */
            color: var(--text-main);
            font-size: 2.8rem; /* حجم كبير جداً وهيبة */
            letter-spacing: 12px; /* مسافات واسعة بين الحروف للفخامة */
            text-transform: uppercase;
            font-weight: 700;
            margin: -10px 0 30px 0;
            opacity: 0;
            /* أنميشن النص يظهر بعد اللوجو */
            animation: textEntrance 1s cubic-bezier(0.23, 1, 0.32, 1) 0.3s forwards;
            text-shadow: 2px 2px 4px rgba(140, 109, 57, 0.1);
          }

          /* --- 4. شريط التحميل الأفقي (The Horizontal Scepter) --- */
          .loading-bar-container {
            width: 400px; /* عرض كبير ومحدد */
            height: 1.5px; /* نحيف جداً وأنيق */
            background: rgba(140, 109, 57, 0.08); /* خلفية ذهبية باهتة */
            position: relative;
            overflow: hidden;
            border-radius: 4px;
            box-shadow: 0 4px 10px rgba(98, 77, 63, 0.03);
          }

          /* الجزء المتحرك الملكي */
          .loading-bar-progress {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            /* تدرج ذهبي مطفي فخم */
            background: linear-gradient(to right, #ffffff00, var(--primary-gold), #ffffff00);
            transform: translateX(-100%);
            /* أنميشن الحركة الأفقية الهادئة */
            animation: loadHorizontal 2s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
          }

          /* --- 5. الـ Keyframes (الأنميشن) --- */

          /* حركة دخول اللوجو */
          @keyframes logoEntrance {
            from { opacity: 0; transform: translateY(20px) scale(0.95); filter: blur(10px); }
            to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }

          /* حركة دخول النص */
          @keyframes textEntrance {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* نبض الهالة الزجاجية */
          @keyframes auraPulse {
            0%, 100% { transform: scale(1); opacity: 0.15; }
            50% { transform: scale(1.1); opacity: 0.1; }
          }

          /* حركة شريط التحميل الأفقي */
          @keyframes loadHorizontal {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }

          /* أنميشن الاختفاء النهائي للمكون */
          @keyframes finalFadeOut {
            to { opacity: 0; visibility: hidden; }
          }


/* --- استجابة الشاشات الصغيرة (أقل من 600 بكسل) --- */
@media (max-width: 600px) {
  .loader-logo {
    width: 140px; /* تصغير اللوجو */
  }

  .brand-name {
    font-size: 1.6rem; /* تصغير حجم الخط */
    letter-spacing: 6px; /* تقليل المسافات بين الحروف لتناسب العرض */
    margin: -5px 0 20px 0;
  }

  .loading-bar-container {
    width: 250px; /* تقليل عرض شريط التحميل */
    height: 1px;  /* جعله أنحف ليناسب رقة الشاشة */
  }

  .glass-aura {
    width: 300px; /* تصغير الهالة الزجاجية */
    height: 300px;
  }
}


        `}
      </style>

      <div className="luxury-loader-overlay">
        {/* طبقة الهالة الزجاجية الفخمة */}
        <div className="glass-aura"></div>
        
        <div className="loader-content">
          <img 
            src="/Lunara-Pro-Luxury-Logo.png" /* رابط اللوجو الخاص بك */
            alt="Lunara Logo" 
            className="loader-logo" 
          />
          
          {/* اسم البراند تحت اللوجو */}
          <h1 className="brand-name">LUNARA PRO</h1>
          
          {/* شريط التحميل الأفقي */}
          <div className="loading-bar-container">
            <div className="loading-bar-progress"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;