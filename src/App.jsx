import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/teacher/Dashboard";
import MockBuilder from "./components/teacher/MockBuilder";
import Landing from "./components/student/Landing";
import ExamSimulator from "./components/student/ExamSimulator";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/student" replace />} />
        <Route path="/student" element={<Landing />} />
        <Route path="/student/exam/:id" element={<ExamSimulator />} />
        <Route path="/teacher" element={<Dashboard />} />
        <Route path="/teacher/builder/:id" element={<MockBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
