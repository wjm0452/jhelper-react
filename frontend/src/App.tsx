import { HashRouter, Route, Link, Routes } from "react-router-dom";

import Sql from "./components/sql";
import Rest from "./components/rest";
import Qna from "./components/qna";
import Memo from "./components/memo";
import Calendar from "./components/calendar";

import "./App.scss";
import DataLoader from "./components/sql/loader/data";
import ExcelLoader from "./components/sql/loader/excel";
import Login from "./components/login";
import { useSelector } from "react-redux";

function App() {
  const login = useSelector((state: any) => state.login);

  return !login.authenticated ? (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Login />
    </div>
  ) : (
    <HashRouter>
      <div
        className="d-flex flex-column"
        style={{ width: "100vw", height: "100vh" }}
      >
        <header className="flex-grow-0">
          <ul className="nav justify-content-end">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sql">
                Sql
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/loader">
                Loader
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/excelloader">
                ExcelLoader
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/rest">
                Rest
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Qna">
                Q&A
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Memo">
                Memo
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Calendar">
                Calendar
              </Link>
            </li>
          </ul>
        </header>
        <main className="flex-grow-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<div>Main</div>}></Route>
            <Route path="/sql" element={<Sql />}></Route>
            <Route path="/loader" element={<DataLoader />}></Route>
            <Route path="/excelLoader" element={<ExcelLoader />}></Route>
            <Route path="/rest" element={<Rest />}></Route>
            <Route path="/qna" element={<Qna />}></Route>
            <Route path="/memo" element={<Memo />}></Route>
            <Route path="/calendar" element={<Calendar />}></Route>
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
