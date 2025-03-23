import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Register.scss";
import axios from 'axios';
import errorIcon from "../../assets/images/error.svg"
const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  function isValid(){
    if(!email || !password|| !userName){
      return false;
  }
  return true;
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isValid())

    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        user_name: userName,
        email,
        password,
      });

      // On successful registration, show success message
      setSuccessMessage(
        <span>
          Registration successful!{'   '}
          <Link to="/login" className="register__success-link">Click here to login</Link>
        </span>
      );
    } catch (error) {
      // Handle error if registration fails
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred during registration.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Create Account</h3>
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success register__success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="user_name" className="form-label">Username</label>
          <input
            type="text"
            id="user_name"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
        </div>
        <button type="submit" className="btn register-btn">Register</button>
      </form>

      <div className="mt-3">
        <div className='register__links'>
          <p>
            Already have an account? <Link to="/login"><span className='register__links-link'>Login here</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
