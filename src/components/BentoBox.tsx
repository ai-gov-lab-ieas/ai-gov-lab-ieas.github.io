import React, { useEffect, useRef, useState } from 'react';

// Inline hook to avoid external dependency issues
const useIntersectionObserver = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(element); // Trigger only once
      }
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options]);

  return [elementRef, isVisible];
};

interface BentoBoxProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  delay?: string;
}

export const BentoBox: React.FC<BentoBoxProps> = ({ 
  children, 
  className = "", 
  title, 
  subtitle,
  delay = "0ms" 
}) => {
  const [ref, isVisible] = useIntersectionObserver();
  
  return (
    <div 
      // @ts-ignore
      ref={ref}
      style={{ transitionDelay: delay }}
      className={`
        bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm overflow-hidden relative group
        transform transition-all duration-1000 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        hover:shadow-2xl hover:scale-[1.01] hover:border-blue-100
        ${className}
      `}
    >
      <div className="relative z-10 h-full flex flex-col">
        {title && <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>}
        {subtitle && <p className="text-slate-500 text-sm mb-4 font-medium">{subtitle}</p>}
        {children}
      </div>
      
      {/* Subtle Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/30 transition-colors duration-700 pointer-events-none" />
    </div>
  );
};

// Default export component to render the demo
// This fixes the "Element type is invalid" error by ensuring a default export exists for the preview
export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoBox title="Revenue" subtitle="Last 30 days" delay="0ms" className="md:col-span-2 bg-indigo-50">
           <div className="h-32 flex items-end gap-2 mt-4">
              {[40, 70, 50, 90, 60, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500 rounded-t-lg opacity-80" style={{ height: `${h}%` }}></div>
              ))}
           </div>
        </BentoBox>
        <BentoBox title="Active Users" subtitle="Real-time" delay="100ms">
           <div className="text-5xl font-bold text-slate-800 mt-4">2.4k</div>
           <div className="text-green-500 text-sm font-medium mt-1">+12% vs last week</div>
        </BentoBox>
        <BentoBox title="System Status" subtitle="All systems operational" delay="200ms">
           <div className="flex items-center gap-3 mt-4">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-slate-600 font-medium">Online</span>
           </div>
        </BentoBox>
        <BentoBox title="Updates" subtitle="Latest features" delay="300ms" className="md:col-span-2">
           <div className="space-y-3 mt-2">
             <div className="flex items-center gap-3 text-slate-600 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">v2</div>
                <span>New dashboard released</span>
             </div>
             <div className="flex items-center gap-3 text-slate-600 text-sm">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">UI</div>
                <span>Dark mode improvements</span>
             </div>
           </div>
        </BentoBox>
      </div>
    </div>
  );
}