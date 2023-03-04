import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  selectAllCartItems,
  fetchAllProducts,
  addToCart,
  setShowCart,
  removeFromCart,
  selectTotalQuantity,
  setTotalQuantity,
  fetchLoggedInUserCart,
  deleteUserCart,
  addUserCart,
  getLoggedInUserId
} from "../../reducers/shoppingCartSlice";
import "./Checkout.css";
import ShippingType from "./ShippingType";
import Payment from "./Payment";
import ReviewOrder from "./ReviewOrder";
import { addOrderSummary } from "../../reducers/checkoutSlice";
import {Link} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

/**
 * COMPONENT
 */
export const Checkout = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showShipping, setShowShipping] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");

  let [shippingAndHandling, setShippingAndHandling] = useState(8);
  const classes = useStyles();

  const cartItems = useSelector(selectAllCartItems);
  let totalQuantity = useSelector(selectTotalQuantity);
  const dispatch = useDispatch();
  let subTotalPrice = 0;

  cartItems.forEach((item) => {
    console.log("item inside cartItems.forEach ", item);
    subTotalPrice += item.totalPrice;
    console.log("subtotal price ", subTotalPrice);
  });

  let estimatedTax = 0.0625 * subTotalPrice;
  let totalPrice = subTotalPrice + shippingAndHandling + estimatedTax;

  const handleShippingType = (e) => {
    const selectedDiv = document.querySelector('.selected-shipping-option');
    let clickedDiv = document.querySelector(`#${e.target.id}`);
    if (clickedDiv.tagName !== 'DIV') {
      clickedDiv = clickedDiv.parentElement;
    }
    if (e.target.id.includes("8")) {
      setShippingAndHandling(8);
      selectedDiv.classList.toggle('selected-shipping-option');
      clickedDiv.classList.toggle('selected-shipping-option');
    } else if (e.target.id.includes("20")) {
      setShippingAndHandling(20);
      selectedDiv.classList.toggle('selected-shipping-option');
      clickedDiv.classList.toggle('selected-shipping-option');
    } else if (e.target.id.includes("30")) {
      setShippingAndHandling(30);
      selectedDiv.classList.toggle('selected-shipping-option');
      clickedDiv.classList.toggle('selected-shipping-option');
    }

    
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    alert("inside handle submit");
    if (window.localStorage.getItem("token")) {
      const userId = await dispatch(getLoggedInUserId());
      await dispatch(addOrderSummary({userId: userId.payload, total: totalPrice, orderItems: cartItems}));
    }
    else {
      console.log('guest user order summary not saved ')
      // await dispatch(addOrderSummary({userId: 1, total: totalPrice, orderItems: cartItems}));
    }
    
    // setFirstName("");
    // setLastName("");
    // setAddress("");
    // setCity("");
    // setState("");
    // setPostalCode("");
    // setEmail("");
    // setPhoneNumber("");
    // setCardNumber("");
    // setExpDate("");
    // setSecurityCode("");
  };

  return (
    <div className="checkout-form" >
      <div className="form-container" >
      <div className="column">
        <form
          id="checkout-form"
          onSubmit={(evt) => handleSubmit(evt)}
          className="column"
        >
          
          {reviewOrder ? (
            <div className="order-review-with-place-order-container">
              <ReviewOrder
                firstName={firstName}
                lastName={lastName}
                address={address}
                city={city}
                state={state}
                postalCode={postalCode}
                phoneNumber={phoneNumber}
                email={email}
              />
              <div className="checkout-submit-button-container">
              <button type="submit" className="place-order-btn" onClick={(e) => handleSubmit(e)}>
              <Link to={{pathname: "/orderconfirmation", state: {email: `${email}` }}} className="place-order-btn">Place Order</Link>
                </button>
                
              </div>
            </div>
          ) : (
            <div className="shipping-address-container">
              <h2 className="form-title">Shipping Address</h2>
              <div className="form-field">
                <input
                  value={firstName}
                  onChange={(evt) => setFirstName(evt.target.value)}
                  placeholder="First Name *"
                  className="checkout-form-input"
                  required
                />

                <input
                  value={lastName}
                  onChange={(evt) => setLastName(evt.target.value)}
                  placeholder="Last Name *"
                  className="checkout-form-input"
                  required
                />
              </div>

              <div className="form-field">
                <input
                  value={address}
                  onChange={(evt) => setAddress(evt.target.value)}
                  placeholder="Address *"
                  className="checkout-form-input"
                  required
                />
              </div>

              <div className="form-field">
                <input
                  value={city}
                  onChange={(evt) => setCity(evt.target.value)}
                  placeholder="City *"
                  className="checkout-form-input"
                  required
                />
                <input
                  value={state}
                  onChange={(evt) => setState(evt.target.value)}
                  placeholder="State *"
                  className="checkout-form-input"
                  required
                />
                <input
                  value={postalCode}
                  onChange={(evt) => setPostalCode(evt.target.value)}
                  placeholder="Postal Code *"
                  className="checkout-form-input"
                  required
                />
              </div>

              <div className="form-field">
                <input
                  type="email"
                  value={email}
                  onChange={(evt) => setEmail(evt.target.value)}
                  placeholder="Email *"
                  className="checkout-form-input"
                  required
                />

                <input
                  value={phoneNumber}
                  onChange={(evt) => setPhoneNumber(evt.target.value)}
                  placeholder="Phone Number *"
                  className="checkout-form-input"
                  required
                />
              </div>

              <div className="checkout-submit-button-container">
            
                <button
                  className="shipping-btn"
                  onClick={() => setShowShipping(true)}
                >
                  Continue To Shipping
                </button>
         

                {/* SHIPPING */}
              </div>
              {showShipping ? (
                <ShippingType
                  setShowPayment={setShowPayment}
                  handleShippingType={handleShippingType}
                />
              ) : (
                <div className="shipping-header">
                  <h2>Shipping</h2>
                </div>
              )}

              {/* PAYMENT */}
              {showPayment ? (
                <Payment
                  setCardNumber={setCardNumber}
                  setExpDate={setExpDate}
                  setSecurityCode={setSecurityCode}
                  setReviewOrder={setReviewOrder}
                  cardNumber={cardNumber}
                  expDate={expDate}
                  securityCode={securityCode}
                />
              ) : (
                <div className="payment-header">
                  <h2>Payment</h2>
                </div>
              )}
            </div>
          )}
         
        </form>
        </div>
      </div>

      <div className="in-your-bag">
        <h2 className="form-title">In Your Bag</h2>
        <table className="checkout-table">
          <tbody>
            <tr>
              <td className="data-col-left checkout-td">Subtotal</td>
              <td className="checkout-data-col-right checkout-td">
                ${subTotalPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="data-col-left checkout-td">Estimated Shipping</td>
              <td className="checkout-data-col-right checkout-td">
                ${shippingAndHandling.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="data-col-left checkout-td">Estimated Tax</td>
              <td className="checkout-data-col-right checkout-td">
                ${estimatedTax.toFixed(2)}
              </td>
            </tr>
            <tr className="">
              <td className="data-col-left checkout-td">Total</td>
              <td className="checkout-data-col-right checkout-td">
                ${totalPrice.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <div>Shipping</div>
          <div>Arrives by </div>
        </div>
        <div className="cart-items">
          {cartItems && cartItems.length ? (
            cartItems.map((product) => {
              return (
                <div
                  className="cart-item-card"
                  key={`${product.id}-${product.size}-${product.color}`}
                >
                  <div className="cart-item-top">
                    <div className="cart-item-left-col">
                      <img
                        src={product.imageUrl}
                        className="checkout-cart-item-img"
                      />
                    </div>
                    <div className="cart-item-right-col">
                      <div className="item-details">
                        <h3>{product.name}</h3>
                        <div>{product.color}</div>
                        <div>{product.size}</div>
                        <div>{product.quantity}</div>
                        <div>${product.totalPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-cart">
              There are no items in your shopping cart
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};
export default connect(mapState)(Checkout);
