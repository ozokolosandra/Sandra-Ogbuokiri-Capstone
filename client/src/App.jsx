import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss';
import HomePage from './pages/HomePage/HomePage';

function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<HomePage />} />  {/* Fixed Route syntax */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
