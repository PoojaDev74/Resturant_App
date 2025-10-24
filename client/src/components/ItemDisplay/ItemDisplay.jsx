import React, { useContext } from "react";
import "./ItemDisplay.css";
import { ItemContext } from "../../context/itemsContext/itemsContext";
import ItemCounter from "../Counter/ItemCounter";

const ItemDisplay = ({ category }) => {
  const { food_list, filteredFoodList, cart, itemsToCart, removeFromCart } =
    useContext(ItemContext);

  const itemsToDisplay =
    filteredFoodList ||
    food_list.filter(
      (item) => category === "All" || item.category === category
    );

  // Heading 
  const headingText = filteredFoodList ? "Search Results" : category;

  return (
    <div className="heading">
      <h1>{headingText}</h1>
      <div className="item-display" id="item-display">
        {itemsToDisplay.map((item) => {
          const quantity = cart[item._id] || 0;

          return (
            <div key={item._id} className="item-card">
              <img src={item.image} alt={item.name} className="item-img" />

              <div className="item-info">
                <h3>{item.name}</h3>

                <h5>
                  ₹{item.price}
                  {quantity > 0 ? (
                    <div className="counter">
                      <button onClick={() => removeFromCart(item._id)}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => itemsToCart(item._id)}>+</button>
                    </div>
                  ) : (
                    <span
                      className="add-btn"
                      onClick={() => itemsToCart(item._id)}
                    >
                      +
                    </span>
                  )}
                </h5>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemDisplay;
