import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchLoggedInUserCart = createAsyncThunk(
  "cartLoggedInUser/fetch",
  async (id) => {
    const { data } = await axios.get(`/api/carts/${id}`);
    return data;
  }
);


export const shoppingCartSlice = createSlice({
  name: "cart",
  initialState: {
    itemsList: JSON.parse(localStorage.getItem("cart")) || [],
    totalQuantity: 0,
    showCart: false,
  },
  reducers: {
    setTotalQuantity (state, action) {
      state.totalQuantity = action.payload;
    },
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.itemsList.find(
        (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
      );
      if (existingItem) {
        existingItem.quantity+= newItem.quantity;
        existingItem.totalPrice += newItem.price;
      } else {
        state.itemsList.push({
          id: newItem.id,
          price: newItem.price,
          quantity: newItem.quantity,
          totalPrice: newItem.price,
          name: newItem.name,
          imageUrl: newItem.image,
          color: newItem.color,
          size: newItem.size
        });
      }
      state.totalQuantity++;
      window.localStorage.removeItem("cart");
      console.log('inside add item state.itemsList ========', JSON.stringify(state.itemsList));
      window.localStorage.setItem("cart", JSON.stringify(state.itemsList));
    },
    removeFromCart(state, action) {
      console.log('action.payload inside remove from cart ', action.payload);
      const id = action.payload.id;
      const color = action.payload.color;
      const size = action.payload.size;
      const existingItem = state.itemsList.find((item) => item.id === id && item.size === size && item.color === color);
      if (existingItem.quantity === 1) {
        state.itemsList = state.itemsList.filter((item) => item.id !== id);
        state.totalQuantity--;
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
        state.totalQuantity--;
      }
      window.localStorage.removeItem("cart");
      if (state.itemsList.length > 0) {
        console.log('inside remove item state.itemsList ========', JSON.stringify(state.itemsList));
        window.localStorage.setItem("cart", JSON.stringify(state.itemsList));
      }
    },
    setShowCart(state) {
      state.showCart = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUserCart.fulfilled, (state, action) => {
        state.itemsList = action.payload;
      })
    }
});

export const { addToCart, removeFromCart, setShowCart, setTotalQuantity } =
  shoppingCartSlice.actions;

export const selectAllCartItems = (state) => {
  return state.shoppingCart.itemsList;
};

export const selectTotalQuantity = (state) => {
  return state.shoppingCart.totalQuantity;
};

export default shoppingCartSlice.reducer;
