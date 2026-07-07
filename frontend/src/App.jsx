import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Skema from "./pages/skema";

function App() {
  return (
    <Router>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/skema" element={<Skema />} />

      </Routes>

    </Router>
  );
}

export default App;
