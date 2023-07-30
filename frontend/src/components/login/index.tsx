import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import httpClient from "../../common/httpClient";

function checkLogin() {
  return httpClient
    .get("/api/auth")
    .then((res) => res.data)
    .catch((e) => {
      console.log("error", e);
      throw e.response.data;
    });
}

function doLogin(username: string, password: string) {
  return httpClient
    .post("/api/auth/signin", {
      username,
      password,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.log("error", e);
      throw e.response.data;
    });
}

function Login() {
  const [username, setUsername]: any = useState("");
  const [password, setPassword]: any = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    checkLogin().then((data) => {
      if (data.authenticated) {
        dispatch({
          type: "login",
          payload: {
            username: data.username,
          },
        });
      }
    });
  }, []);

  const loginHandler = (username: string, password: string) => {
    doLogin(username, password)
      .then((data) => {
        dispatch({
          type: "login",
          payload: {
            username: username,
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
      <div
        className="mx-auto"
        style={{ marginTop: "auto", marginBottom: "auto", width: "300px" }}
      >
        <div className="shadow-sm p-3 mb-5 bg-body rounded border">
          <div className="mb-5 text-center">
            <h2>Login</h2>
          </div>
          <div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUsername(e.target.value);
                }}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    passwordRef.current.focus();
                  }
                }}
              />
              <label>username</label>
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
                    loginHandler(username, password);
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
                  loginHandler(username, password);
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
