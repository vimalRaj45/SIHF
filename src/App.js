import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import Search from "./components/Search";
import DocumentView from "./components/DocumentView";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/search" element={<Search />} />
        <Route path="/document/:docId" element={<DocumentView />} />
      </Routes>
    </Router>
  );
}

export default App;
