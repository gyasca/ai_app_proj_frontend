// IngredientCard.js
import React from "react";

export default function IngredientCard({ ingredient, onIncrement, onDecrement, onRemove }) {
  return (
    <div className="flex flex-col mb-4 p-4 border rounded-lg shadow-md">
      {/* Ingredient Name and Quantity */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="text-lg font-bold">{ingredient.name}</h4>
          <p className="text-sm text-gray-600">
            {ingredient.quantity} {ingredient.unit}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onDecrement}
            className="bg-gray-300 px-2 rounded hover:bg-gray-400"
          >
            -
          </button>
          <button
            onClick={onIncrement}
            className="bg-gray-300 px-2 rounded hover:bg-gray-400"
          >
            +
          </button>
          <button
            onClick={onRemove}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Nutritional Information */}
      <div className="text-sm text-gray-800">
        <p className="mb-1">
          <span className="font-semibold">Calories:</span> {ingredient.calories} kcal
        </p>
        <p className="mb-1">
          <span className="font-semibold">Protein:</span> {ingredient.protein} g
        </p>
        <p className="mb-1">
          <span className="font-semibold">Carbs:</span> {ingredient.carb} g
        </p>
        <p className="mb-1">
          <span className="font-semibold">Fats:</span> {ingredient.fat} g
        </p>
      </div>
    </div>
  );
}
