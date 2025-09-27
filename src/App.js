import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import Search from "./components/Search";
import DocumentView from "./components/DocumentView";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import EmailList from "./components/EmailList";
import Home from "./components/Home";

// Layout for protected routes
const ProtectedLayout = () => (
  <>
    <Navbar />
    <Outlet /> {/* Nested routes will render here */}
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="search" element={<Search />} />
          <Route path="document/:docId" element={<DocumentView />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="emails" element={<EmailList />} />
          {/* Default protected route */}
          <Route index element={<Home />} /> {/* Renders Home on / */}
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
