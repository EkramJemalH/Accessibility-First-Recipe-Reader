import React, { useState } from "react";

type Recipe = {
  instructions: string[];
};

const AccessibleCookingMode = ({ recipe }: { recipe: Recipe }) => {
  const [step, setStep] = useState(0);
  const [fontSize, setFontSize] = useState(18);

  const currentStep = recipe.instructions[step];

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(currentStep);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-6 bg-black text-white rounded-2xl max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🍳 Cooking Mode</h2>

      <p className="text-gray-400 mb-2">
        Step {step + 1} / {recipe.instructions.length}
      </p>

      <div
        className="bg-gray-900 p-6 rounded-xl mb-4"
        style={{ fontSize }}
      >
        {currentStep}
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setStep(s => Math.max(s - 1, 0))}>
          ⬅ Prev
        </button>

        <button
          onClick={() =>
            setStep(s =>
              Math.min(s + 1, recipe.instructions.length - 1)
            )
          }
        >
          Next ➡
        </button>

        <button onClick={speak}>🔊 Read</button>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={() => setFontSize(f => f - 2)}>A-</button>
        <button onClick={() => setFontSize(f => f + 2)}>A+</button>
      </div>
    </div>
  );
};

export default AccessibleCookingMode;