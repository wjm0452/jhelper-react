import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import httpClient from "../../common/httpClient";

function doLogin(email: string, password: string) {
  return httpClient
    .post("/login", {
      email,
      password,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.log("error", e);
      throw e.response.data;
    });
}

function Login() {
  const [email, setEmail]: any = useState("");
  const [password, setPassword]: any = useState("");

  const dispatch = useDispatch();

  const loginHandler = (email: string, password: string) => {
    doLogin(email, password)
      .then((data) => {
        dispatch({
          type: "login",
          payload: {
            email: email,
          },
        });
      })
      .catch((data) => {
        alert(data.message);
      });
  };

  const passwordRef = useRef<HTMLInputElement>();

  return (
    <div className="w-100 h-100 d-flex">
      <div className="mx-auto" style={{ marginTop: "30%", width: "300px" }}>
        <div className="shadow-sm p-3 mb-5 bg-body rounded border">
          <div className="mb-5 text-center">
            <h2>Login</h2>
          </div>
          <div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    passwordRef.current.focus();
                  }
                }}
              />
              <label>Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="password"
                ref={passwordRef}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    loginHandler(email, password);
                  }
                }}
              />
              <label className="form-label">password</label>
            </div>
            <div className="text-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  loginHandler(email, password);
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
