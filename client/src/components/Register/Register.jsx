import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Register.scss";
import axios from 'axios';
import errorIcon from "../../assets/images/error.svg"; // Ensure the path is correct

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

  // Function to validate individual fields
  const validateField = (fieldName, value) => {
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: !value, // Set to true if the field is empty
    }));
  };

  // Handle input changes
  const handleInputChange = (fieldName, setter) => (e) => {
    const value = e.target.value;
    setter(value); // Update the state for the field
    validateField(fieldName, value); // Validate the field in real-time
  };

  // Check if the form is valid
  function isValid() {
    const errors = {
      userName: !userName,
      email: !email,
      password: !password,
    };
    setFieldErrors(errors); // Update field errors
    return !Object.values(errors).some((error) => error); // Return true if no errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      setError('Please fill in all fields.');
      return;
    }

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
          <label  className="form-label">Username</label>
          <input
            type="text"
            id="user_name"
            className={`form-control ${fieldErrors.userName ? 'is-invalid' : ''}`}
            value={userName}
            onChange={handleInputChange('userName', setUserName)}
          />
          {fieldErrors.userName && (
            <div className="invalid-feedback d-flex align-items-center">
              Username is required.
            </div>
          )}
        </div>
        <div className="mb-3">
          <label  className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
            value={email}
            onChange={handleInputChange('email', setEmail)}
          />
          {fieldErrors.email && (
            <div className="invalid-feedback d-flex align-items-center">
              
              Email is required.
            </div>
          )}
        </div>
        <div className="mb-3">
          <label  className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
            value={password}
            onChange={handleInputChange('password', setPassword)}
          />
          {fieldErrors.password && (
            <div className="invalid-feedback d-flex align-items-center">
              Password is required.
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