// // app/components/AccessibilityControls.tsx
// 'use client';

// import { useState, useEffect } from 'react';

// export default function AccessibilityControls() {
//   const [fontSize, setFontSize] = useState('normal');

//   useEffect(() => {
//     const htmlElement = document.documentElement;
//     if (fontSize === 'large') {
//       htmlElement.style.fontSize = '120%';
//     } else if (fontSize === 'larger') {
//       htmlElement.style.fontSize = '140%';
//     } else {
//       htmlElement.style.fontSize = '';
//     }
//   }, [fontSize]);

//   const increaseFont = () => {
//     setFontSize(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'larger' : 'larger');
//   };

//   const resetFont = () => {
//     setFontSize('normal');
//   };

//   return (
//     <div className="hidden md:flex space-x-2">
//       <button 
//         aria-label="Increase font size"
//         className="p-2 rounded-lg bg-gray-100 hover:bg-primary hover:text-white transition-colors"
//         onClick={increaseFont}
//       >
//         A+
//       </button>
//       <button 
//         aria-label="Reset font size"
//         className="p-2 rounded-lg bg-gray-100 hover:bg-primary hover:text-white transition-colors"
//         onClick={resetFont}
//       >
//         A
//       </button>
//     </div>
//   );
// }




// // app/components/AccessibilityControls.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { Moon, Sun, Contrast, Eye, Volume2 } from 'lucide-react';

// export default function AccessibilityControls() {
//   const [fontSize, setFontSize] = useState('normal');
//   const [darkMode, setDarkMode] = useState(false);
//   const [highContrast, setHighContrast] = useState(false);
//   const [dyslexiaFriendly, setDyslexiaFriendly] = useState(false);
//   const [reduceMotion, setReduceMotion] = useState(false);
//   const [showPanel, setShowPanel] = useState(false);

//   // Font size management
//   useEffect(() => {
//     let scale = 1;
//     if (fontSize === 'large') scale = 1.2;
//     if (fontSize === 'larger') scale = 1.4;
//     document.documentElement.style.setProperty('--font-scale', scale.toString());
//   }, [fontSize]);

//   // Dark mode management
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);

//   // High contrast mode
//   useEffect(() => {
//     if (highContrast) {
//       document.documentElement.classList.add('high-contrast');
//     } else {
//       document.documentElement.classList.remove('high-contrast');
//     }
//   }, [highContrast]);

//   // Dyslexia-friendly mode
//   useEffect(() => {
//     if (dyslexiaFriendly) {
//       document.documentElement.classList.add('dyslexia-friendly');
//     } else {
//       document.documentElement.classList.remove('dyslexia-friendly');
//     }
//   }, [dyslexiaFriendly]);

//   // Reduce motion
//   useEffect(() => {
//     if (reduceMotion) {
//       document.documentElement.classList.add('reduce-motion');
//     } else {
//       document.documentElement.classList.remove('reduce-motion');
//     }
//   }, [reduceMotion]);

//   const increaseFont = () => {
//     setFontSize(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'larger' : 'larger');
//   };

//   const resetFont = () => {
//     setFontSize('normal');
//   };

//   return (
//     <>
//       {/* Accessibility Panel Toggle Button - Moved to top bar area */}
//       <div className="flex space-x-2">
//         {/* Font Size Controls - Always visible */}
//         <button 
//           aria-label="Increase font size"
//           className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-bold text-lg"
//           onClick={increaseFont}
//         >
//           A+
//         </button>
        
//         <button 
//           aria-label="Reset font size"
//           className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-bold"
//           onClick={resetFont}
//         >
//           A
//         </button>

//         {/* Settings Panel Toggle */}
//         <button 
//           aria-label="More accessibility settings"
//           className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200"
//           onClick={() => setShowPanel(!showPanel)}
//           aria-expanded={showPanel}
//         >
//           <Eye size={18} />
//         </button>
//       </div>

//       {/* Accessibility Settings Panel - Popup */}
//       {showPanel && (
//         <>
//           {/* Backdrop */}
//           <div 
//             className="fixed inset-0 z-40 bg-black/50"
//             onClick={() => setShowPanel(false)}
//             aria-hidden="true"
//           />
          
//           {/* Panel */}
//           <div 
//             className="fixed right-4 top-20 z-50 w-96 bg-card text-card-foreground rounded-xl shadow-2xl border border-border overflow-hidden"
//             role="region"
//             aria-label="Accessibility settings"
//           >
//             {/* Header */}
//             <div className="bg-primary text-primary-foreground px-6 py-4">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-xl font-bold">Accessibility Settings</h3>
//                   <p className="text-sm opacity-90">Customize your experience</p>
//                 </div>
//                 <button
//                   onClick={() => setShowPanel(false)}
//                   className="p-1 rounded-lg hover:bg-primary-foreground/10 transition-colors"
//                   aria-label="Close panel"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-6 space-y-6">
//               {/* Font Size Section */}
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-lg" aria-hidden="true">📏</span>
//                   <h4 className="font-semibold">Text Size</h4>
//                 </div>
//                 <div className="grid grid-cols-3 gap-3">
//                   <button
//                     onClick={increaseFont}
//                     className="px-4 py-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all font-bold text-lg"
//                     aria-label="Increase text size"
//                   >
//                     A+
//                   </button>
//                   <button
//                     onClick={resetFont}
//                     className="px-4 py-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all font-medium"
//                     aria-label="Reset text size"
//                   >
//                     Reset
//                   </button>
//                   <div className="px-4 py-3 rounded-lg bg-muted text-center text-sm">
//                     {fontSize === 'normal' && '100%'}
//                     {fontSize === 'large' && '120%'}
//                     {fontSize === 'larger' && '140%'}
//                   </div>
//                 </div>
//               </div>

//               {/* Visual Settings */}
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-lg" aria-hidden="true">🎨</span>
//                   <h4 className="font-semibold">Visual Settings</h4>
//                 </div>
//                 <div className="space-y-2">
//                   <button
//                     onClick={() => setDarkMode(!darkMode)}
//                     className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
//                       darkMode 
//                         ? 'bg-primary text-primary-foreground shadow-md' 
//                         : 'bg-muted hover:bg-muted/80'
//                     }`}
//                     aria-pressed={darkMode}
//                   >
//                     <span>Dark Mode</span>
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm">{darkMode ? 'On' : 'Off'}</span>
//                       {darkMode ? <Moon size={18} /> : <Sun size={18} />}
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => setHighContrast(!highContrast)}
//                     className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
//                       highContrast 
//                         ? 'bg-primary text-primary-foreground shadow-md' 
//                         : 'bg-muted hover:bg-muted/80'
//                     }`}
//                     aria-pressed={highContrast}
//                   >
//                     <span>High Contrast</span>
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm">{highContrast ? 'On' : 'Off'}</span>
//                       <Contrast size={18} />
//                     </div>
//                   </button>
//                 </div>
//               </div>

//               {/* Reading Assistance */}
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-lg" aria-hidden="true">📖</span>
//                   <h4 className="font-semibold">Reading Assistance</h4>
//                 </div>
//                 <div className="space-y-2">
//                   <button
//                     onClick={() => setDyslexiaFriendly(!dyslexiaFriendly)}
//                     className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
//                       dyslexiaFriendly 
//                         ? 'bg-primary text-primary-foreground shadow-md' 
//                         : 'bg-muted hover:bg-muted/80'
//                     }`}
//                     aria-pressed={dyslexiaFriendly}
//                   >
//                     <span>Dyslexia Friendly Font</span>
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm">{dyslexiaFriendly ? 'On' : 'Off'}</span>
//                       <Volume2 size={18} />
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => setReduceMotion(!reduceMotion)}
//                     className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
//                       reduceMotion 
//                         ? 'bg-primary text-primary-foreground shadow-md' 
//                         : 'bg-muted hover:bg-muted/80'
//                     }`}
//                     aria-pressed={reduceMotion}
//                   >
//                     <span>Reduce Motion</span>
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm">{reduceMotion ? 'On' : 'Off'}</span>
//                       <span>{reduceMotion ? '✓' : '✗'}</span>
//                     </div>
//                   </button>
//                 </div>
//               </div>

//               {/* Keyboard Shortcuts */}
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-lg" aria-hidden="true">⌨️</span>
//                   <h4 className="font-semibold">Keyboard Shortcuts</h4>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-lg">
//                     <span>Tab</span>
//                     <kbd className="px-2 py-1 bg-background rounded text-xs">Navigate</kbd>
//                   </div>
//                   <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-lg">
//                     <span>Enter</span>
//                     <kbd className="px-2 py-1 bg-background rounded text-xs">Select</kbd>
//                   </div>
//                   <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-lg">
//                     <span>Esc</span>
//                     <kbd className="px-2 py-1 bg-background rounded text-xs">Close menus</kbd>
//                   </div>
//                   <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-lg">
//                     <span>Alt + A</span>
//                     <kbd className="px-2 py-1 bg-background rounded text-xs">Open settings</kbd>
//                   </div>
//                 </div>
//               </div>

//               {/* Status Badge */}
//               <div className="pt-4 border-t border-border">
//                 <div className="flex items-center justify-between text-xs text-muted-foreground">
//                   {/* <span>WCAG 2.1 AA Compliant</span> */}
//                   <span className="flex items-center space-x-1">
//                     <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
//                     <span>All features active</span>
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }
















// components/AccessibilityControls.tsx
'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

export default function AccessibilityControls() {
  const [fontSize, setFontSize] = useState('normal');
  const [showPanel, setShowPanel] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    let scale = 1;
    if (fontSize === 'large') scale = 1.2;
    if (fontSize === 'larger') scale = 1.4;
    document.documentElement.style.setProperty('--font-scale', scale.toString());
  }, [fontSize]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const increaseFont = () => {
    setFontSize(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'larger' : 'larger');
  };

  const resetFont = () => {
    setFontSize('normal');
  };

  return (
    <>
      {/* Buttons - Always visible in header */}
      <div className="flex items-center gap-2">
        <button
          onClick={increaseFont}
          className="px-3 py-1.5 bg-gray-100 hover:bg-amber-600 hover:text-white rounded-lg transition-colors font-bold text-lg"
          aria-label="Increase font size (A+)"
        >
          A+
        </button>
        <button
          onClick={resetFont}
          className="px-3 py-1.5 bg-gray-100 hover:bg-amber-600 hover:text-white rounded-lg transition-colors font-bold"
          aria-label="Reset font size (A)"
        >
          A
        </button>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="px-3 py-1.5 bg-gray-100 hover:bg-amber-600 hover:text-white rounded-lg transition-colors"
          aria-label="Open accessibility settings"
        >
          <Eye size={18} />
        </button>
      </div>

      {/* Accessibility Panel - Popup when Eye is clicked */}
      {showPanel && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowPanel(false)} />
          <div className="fixed right-4 top-20 z-50 w-80 bg-white rounded-xl shadow-2xl border border-amber-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Accessibility Settings</h3>
              <button onClick={() => setShowPanel(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Text Size</label>
                <div className="flex gap-2">
                  <button onClick={increaseFont} className="flex-1 px-3 py-2 bg-gray-100 rounded-lg hover:bg-amber-600 hover:text-white">A+</button>
                  <button onClick={resetFont} className="flex-1 px-3 py-2 bg-gray-100 rounded-lg hover:bg-amber-600 hover:text-white">Reset</button>
                </div>
              </div>
              
              <div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-full px-3 py-2 bg-gray-100 rounded-lg hover:bg-amber-600 hover:text-white text-left"
                >
                  Dark Mode: {darkMode ? 'On' : 'Off'}
                </button>
              </div>
              
              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                WCAG 2.1 AA Compliant
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}