import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, selectAuthLoading, selectAuthError, selectAuthSuccess } from '../../store/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const success = useSelector(selectAuthSuccess);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      if (formData.password !== e.target.value) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    const { confirmPassword, ...userData } = formData;
    const result = await dispatch(registerUser(userData));
    
    if (registerUser.fulfilled.match(result)) {
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl">
        <div>
          <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
          <p className="text-gray-400 text-center mt-2">Join YouGram today</p>
        </div>
        
        {error && (
          <div className="bg-error bg-opacity-10 border border-error text-error p-3 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-success bg-opacity-10 border border-success text-success p-3 rounded-lg">
            Registration successful! Please check your email to verify.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-custom"
              placeholder="Enter your name"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="input-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-custom"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-custom"
              placeholder="Create a password"
              required
              disabled={loading}
              minLength="6"
            />
          </div>
          
          <div>
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input-custom ${passwordError ? 'input-error' : ''}`}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
            {passwordError && (
              <p className="input-help text-error">{passwordError}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading || !!passwordError}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;