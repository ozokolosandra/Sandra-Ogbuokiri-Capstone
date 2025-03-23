import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Register.scss";
import axios from 'axios';
import validator from 'email-validator';

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    userName: false,
    email: false,
    password: false,
  });

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateField = (fieldName, value) => {
    let isValid = true;

    if (fieldName === 'password') {
      isValid = validatePassword(value);
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        password: !isValid,
      }));
    } else if (fieldName === 'email') {
      isValid = validator.validate(value);
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        email: !isValid,
      }));
    } else {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: !value,
      }));
    }
  };

  const handleInputChange = (fieldName, setter) => (e) => {
    const value = e.target.value;
    setter(value);
    validateField(fieldName, value);
  };

  function isValid() {
    const errors = {
      userName: !userName,
      email: !validator.validate(email),
      password: !validatePassword(password),
    };
    setFieldErrors(errors);
    return !Object.values(errors).some((error) => error);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      setError('Please fill in all fields and ensure password meets the requirements.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/auth/register', {
        user_name: userName,
        email,
        password,
      });

      setSuccessMessage(
        <span>
          Registration successful!{' '}
          <Link to="/login" className="register__success-link">Click here to login</Link>
        </span>
      );
    } catch (error) {
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
          <label className="form-label">Username</label>
          <input
            type="text"
            id="user_name"
            className={`form-control ${fieldErrors.userName ? 'is-invalid' : ''}`}
            value={userName}
            onChange={handleInputChange('userName', setUserName)}
          />
          {fieldErrors.userName && <div className="invalid-feedback">Username is required.</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="text"
            
            className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
            value={email}
            onChange={handleInputChange('email', setEmail)}
          />
          {fieldErrors.email && <div className="invalid-feedback">Please enter a valid email.</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
           
            className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
            value={password}
            onChange={handleInputChange('password', setPassword)}
          />
          {fieldErrors.password && (
            <div className="invalid-feedback">
              Password must be at least 8 characters, contain a number, and a special character.
            </div>
          )}
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
