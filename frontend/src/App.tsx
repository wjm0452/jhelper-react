import { HashRouter, Route, Link, Routes } from "react-router-dom";
import Sql from "./components/sql";
import Rest from "./components/rest";
import Qna from "./components/qna";
import Memo from "./components/memo";

import "./App.scss";
import DataLoader from "./components/sql/dataloader";

function App() {
  return (
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
              <Link className="nav-link" to="/dataloader">
                DataLoader
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
          </ul>
        </header>
        <main className="flex-grow-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<div>Main</div>}></Route>
            <Route path="/sql" element={<Sql />}></Route>
            <Route path="/dataloader" element={<DataLoader />}></Route>
            <Route path="/rest" element={<Rest />}></Route>
            <Route path="/qna" element={<Qna />}></Route>
            <Route path="/memo" element={<Memo />}></Route>
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
