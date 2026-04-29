// // app/components/CookingModeView.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { X, Check, ChevronLeft, ChevronRight, AlarmClock, Volume2 } from 'lucide-react';
// import { Recipe } from '@/lib/recipes';

// interface CookingModeViewProps {
//   recipe: Recipe;
//   onExit: () => void;
// }

// export function CookingModeView({ recipe, onExit }: CookingModeViewProps) {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [completedSteps, setCompletedSteps] = useState<number[]>([]);
//   const [showTimer, setShowTimer] = useState(false);
//   const [timerMinutes, setTimerMinutes] = useState(0);
//   const [timerSeconds, setTimerSeconds] = useState(0);
//   const [isTimerRunning, setIsTimerRunning] = useState(false);

//   const totalSteps = recipe.instructions.length;
//   const progress = (completedSteps.length / totalSteps) * 100;

//   // Timer logic
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
//       interval = setInterval(() => {
//         if (timerSeconds > 0) {
//           setTimerSeconds(timerSeconds - 1);
//         } else if (timerMinutes > 0) {
//           setTimerMinutes(timerMinutes - 1);
//           setTimerSeconds(59);
//         } else {
//           setIsTimerRunning(false);
//           playAlarm();
//         }
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isTimerRunning, timerMinutes, timerSeconds]);

//   const playAlarm = () => {
//     // Simple beep sound using Web Audio API
//     try {
//       const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//       const oscillator = audioContext.createOscillator();
//       const gainNode = audioContext.createGain();
      
//       oscillator.connect(gainNode);
//       gainNode.connect(audioContext.destination);
      
//       oscillator.frequency.value = 880;
//       gainNode.gain.value = 0.5;
      
//       oscillator.start();
//       gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
//       oscillator.stop(audioContext.currentTime + 1);
//     } catch(e) {
//       console.log('Timer complete!');
//     }
//   };

//   const nextStep = () => {
//     if (currentStep < totalSteps - 1) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const toggleStepComplete = () => {
//     if (completedSteps.includes(currentStep)) {
//       setCompletedSteps(completedSteps.filter(step => step !== currentStep));
//     } else {
//       setCompletedSteps([...completedSteps, currentStep]);
//     }
//   };

//   const startTimer = (minutes: number) => {
//     setTimerMinutes(minutes);
//     setTimerSeconds(0);
//     setShowTimer(true);
//     setIsTimerRunning(true);
//   };

//   const stopTimer = () => {
//     setIsTimerRunning(false);
//     setShowTimer(false);
//     setTimerMinutes(0);
//     setTimerSeconds(0);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
//       {/* Header */}
//       <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b-2 border-amber-200">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="text-3xl" aria-hidden="true">
//                 👨‍🍳
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-amber-800">Cooking Mode</h1>
//                 <p className="text-sm text-amber-600">{recipe.title}</p>
//               </div>
//             </div>
//             <button
//               onClick={onExit}
//               className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
//               aria-label="Exit cooking mode"
//             >
//               <X className="w-6 h-6 text-amber-800" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="sticky top-[73px] z-40 bg-white/90 backdrop-blur border-b border-amber-100">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex justify-between text-sm text-amber-700 mb-2">
//             <span>Progress</span>
//             <span className="font-semibold">{completedSteps.length} / {totalSteps} steps completed</span>
//           </div>
//           <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
//             <div
//               className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-full h-3 transition-all duration-500"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Current Step Card */}
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//             {/* Step Header */}
//             <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
//               <div className="flex items-center justify-between text-white">
//                 <div>
//                   <p className="text-sm opacity-90">Step {currentStep + 1} of {totalSteps}</p>
//                   <h2 className="text-2xl font-bold">Current Step</h2>
//                 </div>
//                 <button
//                   onClick={toggleStepComplete}
//                   className={`p-3 rounded-full transition-all ${
//                     completedSteps.includes(currentStep)
//                       ? 'bg-green-500 hover:bg-green-600'
//                       : 'bg-white/20 hover:bg-white/30'
//                   }`}
//                   aria-label={completedSteps.includes(currentStep) ? "Mark as incomplete" : "Mark as complete"}
//                 >
//                   <Check className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>

//             {/* Step Content */}
//             <div className="p-8">
//               <p className="text-xl text-gray-800 leading-relaxed mb-8">
//                 {recipe.instructions[currentStep]}
//               </p>

//               {/* Quick Timer Suggestions */}
//               <div className="mb-8">
//                 <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
//                   <AlarmClock size={16} />
//                   Need a timer?
//                 </p>
//                 <div className="flex gap-3 flex-wrap">
//                   {[1, 2, 3, 5, 10, 15].map(min => (
//                     <button
//                       key={min}
//                       onClick={() => startTimer(min)}
//                       className="px-4 py-2 bg-gray-100 hover:bg-amber-100 text-gray-700 rounded-lg transition-colors"
//                     >
//                       {min} min
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Active Timer */}
//               {showTimer && (timerMinutes > 0 || timerSeconds > 0) && (
//                 <div className="mb-8 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <AlarmClock className="w-6 h-6 text-amber-600 animate-pulse" />
//                       <div>
//                         <p className="text-sm text-amber-700">Timer</p>
//                         <p className="text-2xl font-bold text-amber-800">
//                           {timerMinutes}:{timerSeconds.toString().padStart(2, '0')}
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={stopTimer}
//                       className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                     >
//                       Stop
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Navigation Buttons */}
//               <div className="flex justify-between gap-4">
//                 <button
//                   onClick={prevStep}
//                   disabled={currentStep === 0}
//                   className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
//                     currentStep === 0
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                   }`}
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                   Previous
//                 </button>
                
//                 <div className="text-center px-4 py-2 bg-gray-50 rounded-xl">
//                   <p className="text-sm text-gray-500">Step completed?</p>
//                   <p className="text-xs text-gray-400">Check the green button above</p>
//                 </div>

//                 <button
//                   onClick={nextStep}
//                   disabled={currentStep === totalSteps - 1}
//                   className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
//                     currentStep === totalSteps - 1
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-amber-600 text-white hover:bg-amber-700'
//                   }`}
//                 >
//                   Next
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Ingredients Sidebar */}
//           <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
//             <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
//               <span>📋</span> Ingredients Checklist
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {recipe.ingredients.map((ingredient, idx) => (
//                 <div key={idx} className="flex items-center gap-3 p-2 hover:bg-amber-50 rounded-lg transition-colors">
//                   <input
//                     type="checkbox"
//                     className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
//                     id={`cooking-ingredient-${idx}`}
//                   />
//                   <label htmlFor={`cooking-ingredient-${idx}`} className="text-gray-700 cursor-pointer">
//                     <span className="font-semibold">{ingredient.amount}</span> {ingredient.name}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Completion Celebration */}
//           {completedSteps.length === totalSteps && (
//             <div className="fixed bottom-8 right-8 animate-bounce z-50">
//               <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full p-4 shadow-2xl">
//                 <div className="text-center">
//                   <span className="text-3xl">🎉</span>
//                   <p className="text-xs font-semibold mt-1">Done!</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Keyboard Shortcuts Hint */}
//           <div className="mt-6 text-center text-xs text-gray-500">
//             <p>💡 Keyboard shortcuts: ← → to navigate steps, Space to mark complete</p>
//           </div>
//         </div>
//       </div>

//       {/* Keyboard Navigation */}
//       <script dangerouslySetInnerHTML={{
//         __html: `
//           document.addEventListener('keydown', function(e) {
//             if (e.key === 'ArrowLeft') {
//               document.querySelector('button:has(svg.lucide-chevron-left)')?.click();
//             }
//             if (e.key === 'ArrowRight') {
//               document.querySelector('button:has(svg.lucide-chevron-right)')?.click();
//             }
//             if (e.key === ' ' || e.key === 'Space') {
//               e.preventDefault();
//               document.querySelector('button[aria-label*="complete"]')?.click();
//             }
//           });
//         `
//       }} />
//     </div>
//   );
// }









// components/CookingModeView.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Check, ChevronLeft, ChevronRight, AlarmClock } from 'lucide-react';
import { Recipe } from '@/lib/recipes';

interface CookingModeViewProps {
  recipe: Recipe;
  onExit: () => void;
}

export function CookingModeView({ recipe, onExit }: CookingModeViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showTimer, setShowTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const totalSteps = recipe.instructions.length;
  const progress = (completedSteps.length / totalSteps) * 100;

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          setIsTimerRunning(false);
          playAlarm();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const playAlarm = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.5;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
      oscillator.stop(audioContext.currentTime + 1);
    } catch(e) {
      console.log('Timer complete!');
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleStepComplete = () => {
    if (completedSteps.includes(currentStep)) {
      setCompletedSteps(completedSteps.filter(step => step !== currentStep));
    } else {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const startTimer = (minutes: number) => {
    setTimerMinutes(minutes);
    setTimerSeconds(0);
    setShowTimer(true);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setShowTimer(false);
    setTimerMinutes(0);
    setTimerSeconds(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b-2 border-amber-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">👨‍🍳</div>
              <div>
                <h1 className="text-xl font-bold text-amber-800">Cooking Mode</h1>
                <p className="text-sm text-amber-600">{recipe.title}</p>
              </div>
            </div>
            <button
              onClick={onExit}
              className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
              aria-label="Exit cooking mode"
            >
              <X className="w-6 h-6 text-amber-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="sticky top-[73px] z-40 bg-white/90 backdrop-blur border-b border-amber-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between text-sm text-amber-700 mb-2">
            <span>Progress</span>
            <span className="font-semibold">{completedSteps.length} / {totalSteps} steps completed</span>
          </div>
          <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-full h-3 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Current Step Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm opacity-90">Step {currentStep + 1} of {totalSteps}</p>
                  <h2 className="text-2xl font-bold">Current Step</h2>
                </div>
                <button
                  onClick={toggleStepComplete}
                  className={`p-3 rounded-full transition-all ${
                    completedSteps.includes(currentStep)
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                  aria-label={completedSteps.includes(currentStep) ? "Mark as incomplete" : "Mark as complete"}
                >
                  <Check className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <p className="text-xl text-gray-800 leading-relaxed mb-8">
                {recipe.instructions[currentStep]}
              </p>

              {/* Quick Timer Suggestions */}
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                  <AlarmClock size={16} />
                  Need a timer?
                </p>
                <div className="flex gap-3 flex-wrap">
                  {[1, 2, 3, 5, 10, 15].map(min => (
                    <button
                      key={min}
                      onClick={() => startTimer(min)}
                      className="px-4 py-2 bg-gray-100 hover:bg-amber-100 text-gray-700 rounded-lg transition-colors"
                    >
                      {min} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Timer */}
              {showTimer && (timerMinutes > 0 || timerSeconds > 0) && (
                <div className="mb-8 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlarmClock className="w-6 h-6 text-amber-600 animate-pulse" />
                      <div>
                        <p className="text-sm text-amber-700">Timer</p>
                        <p className="text-2xl font-bold text-amber-800">
                          {timerMinutes}:{timerSeconds.toString().padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={stopTimer}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                <div className="text-center px-4 py-2 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Step completed?</p>
                  <p className="text-xs text-gray-400">Click the green button above</p>
                </div>

                <button
                  onClick={nextStep}
                  disabled={currentStep === totalSteps - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentStep === totalSteps - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Ingredients Sidebar */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
              <span>📋</span> Ingredients Checklist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recipe.ingredients.map((ingredient, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 hover:bg-amber-50 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    id={`cooking-ingredient-${idx}`}
                  />
                  <label htmlFor={`cooking-ingredient-${idx}`} className="text-gray-700 cursor-pointer">
                    <span className="font-semibold">{ingredient.amount}</span> {ingredient.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Celebration */}
          {completedSteps.length === totalSteps && (
            <div className="fixed bottom-8 right-8 animate-bounce z-50">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full p-4 shadow-2xl">
                <div className="text-center">
                  <span className="text-3xl">🎉</span>
                  <p className="text-xs font-semibold mt-1">Done!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}