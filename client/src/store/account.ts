import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { useSelector } from "react-redux";

interface AccountState {
  id?: string;
  name?: string;
  email?: string;
  picture?: string;
}

const initialState: AccountState = {};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountInfo: (state, action: PayloadAction<AccountState>) => {
      state = { ...action.payload };
    },
  },
});

export const { setAccountInfo } = accountSlice.actions;
export default accountSlice.reducer;

export const useAccount = () => useSelector((state: AppState) => state.account);
