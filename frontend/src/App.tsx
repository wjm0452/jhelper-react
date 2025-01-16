import { HashRouter, Route, Link, Routes } from "react-router-dom";

import Sql from "./components/sql";
import Rest from "./components/rest";
import Board from "./components/board";
import BoardDetails from "./components/board/board.details";
import Memo from "./components/memo";
import Calendar from "./components/calendar";

import "./App.scss";
import DataLoader from "./components/dataLoader/sqlLoader";
import ExcelLoader from "./components/dataLoader/excelLoader";
import Login from "./components/login";
import { useSelector } from "react-redux";
import FileBrowser from "./components/fileBrowser";
import { useState } from "react";
import { Button } from "primereact/button";

function App() {
  const login = useSelector((state: any) => state.login);

  const [visibleSide, setVisibleSide] = useState(false);

  return !login.authenticated ? (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Login />
    </div>
  ) : (
    <HashRouter>
      <header
        className="position-sticky top-0"
        style={{ backgroundColor: "rgba(255,255,255,0.8)", zIndex: 9999 }}
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
            <Link className="nav-link" to="/excel-loader">
              ExcelLoader
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/rest">
              Rest
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/file-browser">
              FileBrowser
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/board">
              Board
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/calendar">
              Calendar
            </Link>
          </li>
          <li className="nav-item">
            <Button
              icon="pi pi-book"
              rounded
              text
              aria-label="Left"
              onClick={() => setVisibleSide(!visibleSide)}
            />
          </li>
        </ul>
      </header>
      <main
        className="100wh position-relative"
        style={{
          height: "calc(100vh - 36px)",
        }}
      >
        <Routes>
          <Route path="/" element={<div>Main</div>}></Route>
          <Route path="/sql" element={<Sql />}></Route>
          <Route path="/loader" element={<DataLoader />}></Route>
          <Route path="/excel-loader" element={<ExcelLoader />}></Route>
          <Route path="/rest" element={<Rest />}></Route>
          <Route path="/file-browser" element={<FileBrowser />}></Route>
          <Route path="/board">
            <Route index element={<Board />}></Route>
            <Route path="details" element={<BoardDetails />}></Route>
            <Route path="details/:boardId" element={<BoardDetails />}></Route>
          </Route>
          <Route path="/calendar" element={<Calendar />}></Route>
        </Routes>
      </main>
      <aside
        className="card position-absolute overflow-hidden p-2"
        style={{
          height: "calc(100vh - 2.5rem)",
          top: "2.5rem",
          right: "0px",
          backgroundColor: "white",
          display: visibleSide ? "" : "none",
          zIndex: 999,
        }}
      >
        <div className="h-100" style={{ width: "450px" }}>
          <Memo />
        </div>
      </aside>
    </HashRouter>
  );
}

export default App;
