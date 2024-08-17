import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

const initialState: User = {
  id: 0,
  email: "",
  first_name: "",
  last_name: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
    },
    clearUser: (state) => {
      state.id = 0;
      state.email = "";
      state.first_name = "";
      state.last_name = "";
    },
  },
});

export const { updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
