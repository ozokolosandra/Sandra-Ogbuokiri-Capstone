import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss';
import HomePage from './pages/HomePage/HomePage';
import ReportPage from "./pages/ReportPage/ReportPage";

function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/report" element={<ReportPage />} /> {/* Fixed Route syntax */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
