import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UploadReport from "./pages/UploadReport";
import History from "./pages/History";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ReportView from "./pages/ReportView";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { token } = useContext(AuthContext);

  // Simple protected route wrapper
  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Navbar />
      <div className="pt-24 px-4 pb-12 min-h-screen max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to={token ? "/upload" : "/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={
            <PrivateRoute>
              <UploadReport />
            </PrivateRoute>
          } />
          <Route path="/history" element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          } />
          <Route path="/report/:id" element={
            <PrivateRoute>
              <ReportView />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
