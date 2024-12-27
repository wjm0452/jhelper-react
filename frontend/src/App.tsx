import { HashRouter, Route, Link, Routes } from "react-router-dom";

import Sql from "./components/sql";
import Rest from "./components/rest";
import Board from "./components/board";
import BoardDetails from "./components/board/details";
import Memo from "./components/memo";
import Calendar from "./components/calendar";

import "./App.scss";
import DataLoader from "./components/dataLoader/data";
import ExcelLoader from "./components/dataLoader/excel";
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
      <header
        className="position-sticky top-0"
        style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
      >
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
            <Link className="nav-link" to="/board">
              Board
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/memo">
              Memo
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/calendar">
              Calendar
            </Link>
          </li>
        </ul>
      </header>
      <main
        className="100wh position-relative"
        style={{
          height: "calc(100vh - 30px)",
        }}
      >
        <Routes>
          <Route path="/" element={<div>Main</div>}></Route>
          <Route path="/sql" element={<Sql />}></Route>
          <Route path="/loader" element={<DataLoader />}></Route>
          <Route path="/excelLoader" element={<ExcelLoader />}></Route>
          <Route path="/rest" element={<Rest />}></Route>
          <Route path="/board">
            <Route index element={<Board />}></Route>
            <Route path="details" element={<BoardDetails />}></Route>
            <Route path="details/:boardId" element={<BoardDetails />}></Route>
          </Route>
          <Route path="/memo" element={<Memo />}></Route>
          <Route path="/calendar" element={<Calendar />}></Route>
        </Routes>
      </main>
    </HashRouter>
  );
}

export default App;
