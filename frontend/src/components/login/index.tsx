import React, { useState } from "react";
import { useDispatch } from "react-redux";

function Login() {
  const [email, setEmail]: any = useState("");
  const [password, setPassword]: any = useState("");

  const dispatch = useDispatch();

  return (
    <div>
      email:
      <input
        type="text"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      password:
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button
        type="button"
        onClick={() => {
          console.log(email, password);
          dispatch({
            type: "login",
            payload: {
              email: email,
              password: password,
            },
          });
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
