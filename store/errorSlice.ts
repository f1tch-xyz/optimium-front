import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState, AppThunk } from "./store";

export interface ErrorState {
  value: boolean;
  status: "hidden" | "visible";
  message: string;
}

const initialState: ErrorState = {
  value: false,
  status: "hidden",
  message: "",
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    show: (state) => {
      console.log("state", state);
      state.value = true;
    },
  },
});

export const { show } = errorSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectError = (state: AppState) => state.error.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectError(getState())
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount))
//     }
//   }

export default errorSlice.reducer;
