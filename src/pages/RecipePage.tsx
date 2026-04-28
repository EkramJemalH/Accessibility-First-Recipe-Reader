import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { recipes } from "../data/recipes";
import AccessibleCookingMode from "../components/AccessibleCookingMode";

const RecipePage = () => {
  const { id } = useParams<{ id: string }>();

  // Find recipe by id (fallback to first recipe)
  const recipe =
    recipes.find((r) => String(r.id) === id) || recipes[0];

  const [cookingMode, setCookingMode] = useState(false);

  if (!recipe) {
    return <div className="p-6 text-white">Recipe not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* 🔙 Back / Title */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          {recipe.title}
        </h1>

        {/* 🖼️ Image */}
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}

        {/* 🧾 Ingredients */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Ingredients
          </h2>
          <ul className="list-disc list-inside text-gray-300">
            {recipe.ingredients?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* 📋 Instructions */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Instructions
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        {/* 🔘 Toggle Cooking Mode */}
        <button
          onClick={() => setCookingMode(!cookingMode)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
        >
          {cookingMode
            ? "Exit Cooking Mode"
            : "Start Cooking Mode 🍳"}
        </button>

        {/* 🍳 Accessible Cooking Mode */}
        {cookingMode && (
          <div className="mt-8">
            <AccessibleCookingMode recipe={recipe} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;