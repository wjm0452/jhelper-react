import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = createRoot(document.getElementById("root") as Element);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 5,
      refetchOnWindowFocus: false,
    },
  },
});
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
