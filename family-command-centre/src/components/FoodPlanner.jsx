import './FoodPlanner.css';

export default function FoodPlanner({ onBack }) {
  return (
    <div className="food-screen">
      <div className="food-header">
        <button className="food-back" onClick={onBack}>← Home</button>
        <h1>🥗 Meal Planner</h1>
      </div>
      <div className="food-placeholder">
        <div className="food-icon">🍽️</div>
        <div className="food-title">Coming Soon</div>
        <div className="food-sub">Healthy meal planner per child based on preferences, plus shopping list generator — scaffold ready, feature coming in next update.</div>
        <div className="food-features">
          <div className="food-feature">📋 Weekly meal planner</div>
          <div className="food-feature">👶 Per-child food preferences</div>
          <div className="food-feature">🛒 Auto shopping list</div>
          <div className="food-feature">🥦 Nutrition tracking</div>
        </div>
      </div>
    </div>
  );
}
