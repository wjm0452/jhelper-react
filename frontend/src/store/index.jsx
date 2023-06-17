import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../components/login/loginReducer";
export default configureStore({
  reducer: {
    login: loginReducer,
  },
});
