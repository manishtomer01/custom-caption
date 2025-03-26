import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage";
import { AddCaptionPage } from "./pages/AddCaptionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/edit" element={<AddCaptionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
