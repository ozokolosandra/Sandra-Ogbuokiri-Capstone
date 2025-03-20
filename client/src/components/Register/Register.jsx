import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Register.scss"
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        user_name: userName,
        email,
        password,
      });

      // On successful registration, navigate to login page
      navigate('/login');
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
      <h1 className="mb-4">Create Account</h1>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="user_name" className="form-label">Username</label>
          <input
            type="text"
            id="user_name"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
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
            required
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
            required
          />
        </div>
        <button type="submit" className="btn register-btn">Register</button>
      </form>
      <div className="mt-3">
        <div className='register__links'>
        <p>
          Already have an account? <Link to="/login"> <div className='register__links-link'>Login here</div></Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Register;
