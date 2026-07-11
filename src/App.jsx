import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./common/AuthContext";
import ProtectedRoute from "./common/ProtectedRoute";
import Dashboard from "./teacher/Dashboard";
import MockBuilder from "./teacher/MockBuilder";
import Landing from "./student/Landing";
import ExamSimulator from "./student/ExamSimulator";
import Login from "./common/Login";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/exam/:id" element={
            <ProtectedRoute><ExamSimulator /></ProtectedRoute>
          } />
          <Route path="/teacher" element={
            <ProtectedRoute role="teacher"><Dashboard /></ProtectedRoute>
          } />
          <Route path="/teacher/builder/:id" element={
            <ProtectedRoute role="teacher"><MockBuilder /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
