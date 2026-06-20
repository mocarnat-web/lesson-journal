import './FoodPlanner.css';
export default function FoodPlanner({onBack}){
  return(<div className="food-screen">
    <div className="food-header"><button className="food-back" onClick={onBack}>← Home</button><h1>🥗 Meal Planner</h1></div>
    <div className="food-placeholder"><div className="food-icon">🍽️</div><div className="food-title">Coming Soon</div><div className="food-sub">Healthy meal planner per child based on preferences, plus shopping list generator.</div>
      <div className="food-features">{['📋 Weekly meal planner','👶 Per-child preferences','🛒 Auto shopping list','🥦 Nutrition tracking'].map(f=><div key={f} className="food-feature">{f}</div>)}</div>
    </div>
  </div>);
}
