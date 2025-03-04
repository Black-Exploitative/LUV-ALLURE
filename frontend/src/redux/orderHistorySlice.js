import { createSlice } from "@reduxjs/toolkit";

const orderHistorySlice = createSlice({
  name: "orderHistory",
  initialState: {
    orders: [],
  },
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
  },
});

export const { addOrder } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;
