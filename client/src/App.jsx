import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss';
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import LogoutPage from "./pages/LogoutPage/LogoutPage"
import HomePage from './pages/HomePage/HomePage';
import ReportPage from "./pages/ReportPage/ReportPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage"
function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<LoginPage />} />  
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />    
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/report" element={<ReportPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
