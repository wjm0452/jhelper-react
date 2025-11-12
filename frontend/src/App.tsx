import { HashRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Board from "./components/board";
import BoardDetails from "./components/board/board.details";
import Memo from "./components/memo";
import Rest from "./components/rest";
import Sql from "./components/sql";

import { TabMenu } from "primereact/tabmenu";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./App.scss";
import { MessageStoreProvider } from "./components/common/message/message.context";
import ExcelLoader from "./components/dataLoader/excelLoader";
import DataLoader from "./components/dataLoader/sqlLoader";
import FileBrowser from "./components/fileBrowser";
import Login from "./components/login";
import Schedule from "./components/schedule/schedule";

function App() {
  const login = useSelector((state: any) => state.login);
  const [visibleSide, setVisibleSide] = useState(false);

  return !login.authenticated ? (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Login />
    </div>
  ) : (
    <HashRouter>
      <MessageStoreProvider>
        <AppMenu />
        <main
          className="100wh position-relative"
          style={{
            height: "calc(100vh - 56px)",
          }}
        >
          {" "}
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
            <Route path="/memo" element={<Memo />}></Route>
            <Route path="/schedule" element={<Schedule />}></Route>
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
      </MessageStoreProvider>
    </HashRouter>
  );
}

const AppMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menus = [
    {
      label: "Home",
      data: { link: "/" },
      command: (e: any) => goPage(e),
    },
    {
      label: "Sql",
      data: { link: "/sql" },
      command: (e: any) => goPage(e),
    },
    {
      label: "Loader",
      data: { link: "/loader" },
      command: (e: any) => goPage(e),
    },
    {
      label: "ExcelLoader",
      data: { link: "/excel-loader" },
      command: (e: any) => goPage(e),
    },
    {
      label: "Rest",
      data: { link: "/rest" },
      command: (e: any) => goPage(e),
    },
    {
      label: "FileBrowser",
      data: { link: "/file-browser" },
      command: (e: any) => goPage(e),
    },
    {
      label: "Board",
      data: { link: "/board" },
      command: (e: any) => goPage(e),
    },
    {
      label: "Memo",
      data: { link: "/memo" },
      command: (e: any) => goPage(e),
    },
    {
      label: "Schedule",
      data: { link: "/schedule" },
      command: (e: any) => goPage(e),
    },
  ];
  const goPage = ({ item }: any) => {
    navigate(item.data.link);
  };

  const [activeIndex, setActiveIndex] = useState(() => {
    const index = menus.findIndex((menu) => menu.data.link == location.pathname);
    return index == -1 ? 0 : index;
  });

  return (
    <TabMenu
      model={menus}
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
    ></TabMenu>
  );
};

export default App;
