import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./catalogue-fixes.css";
import App from "./App.tsx";
import { initAnalytics } from "./lib/analytics";

initAnalytics();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
