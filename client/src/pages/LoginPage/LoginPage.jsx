import React from "react";
import Header from "../../components/Header/Header";
import Login from "../../components/Login/Login";

function LoginPage({ setIsAuthenticated }) {
  return (
    <div>
      <div className="login-page">
        <Header />
        
        <Login setIsAuthenticated={setIsAuthenticated} />  
      </div>
    </div>
  );
}

export default LoginPage;
