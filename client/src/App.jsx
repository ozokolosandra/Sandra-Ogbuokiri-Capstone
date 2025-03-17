import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss';
import HomePage from './pages/HomePage/HomePage';
import ReportPage from "./pages/ReportPage/ReportPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage"
function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<LoginPage />} />  {/* Login page route */}
        <Route path="/register" element={<RegisterPage />} />  {/* Register page route */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
        <Route path="/report" element={<ReportPage />} /> {/* Fixed Route syntax */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
