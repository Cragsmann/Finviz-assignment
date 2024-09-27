import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import TreeView from "./components/TreeView/TreeView";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TreeView />
    </BrowserRouter>
  </StrictMode>
);
