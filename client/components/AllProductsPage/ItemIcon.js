import "./AllProductsPage.css";
import React from "react";
import { Link } from "react-router-dom";
export default function ItemIcon(props) {
  const { product } = props;

  return (
    <div className="product-icon">
      <div className="top">
        <Link to={`/singleproduct/${product.id}`}>
          {" "}
          <img src={product.image} width="200" height="200"></img>
        </Link>
      </div>
      <div className="bottom">
        <h2>{product.name}</h2>
        <p>{product.product_category}</p>
        [colorway - pending inventory]
        <p>${product.price}</p>
      </div>
    </div>
  );
}
