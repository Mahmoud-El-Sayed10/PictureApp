// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import './AuthPages.css'; // <-- Import shared CSS

const Login = () => {
    // ... (state and functions remain the same) ...
    const { login, isLoading, isAuthenticated, authErrors, clearAuthErrors } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        setFormError(null);
        // clearAuthErrors();
    }, [clearAuthErrors]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError(null);
        try {
            await login({ email, password });
            // navigate('/'); // Let useEffect handle redirection
        } catch (error) {
             if (authErrors?.login) {
                setFormError(authErrors.login);
            } else {
                setFormError('An unexpected error occurred during login.');
            }
        }
    };

    return (
        // Use shared container class
        <div className="auth-page-container">
            <AuthCard title="Login">
                <form onSubmit={handleSubmit}>
                    {/* Display general form error */}
                    {formError && typeof formError === 'string' && <p className="form-error-text">{formError}</p>}

                    <FormInput
                        label="Email"
                        id="email" // Add id
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                    <FormInput
                        label="Password"
                        id="password" // Add id
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />

                    <div className="auth-link-container" style={{textAlign: 'right', marginTop: '5px', marginBottom: '15px'}}> {/* Adjusted style */}
                        <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
                    </div>

                    {/* Use shared button class */}
                    <button type="submit" disabled={isLoading} className="auth-button" style={{backgroundColor: '#007bff'}}> {/* Override background for login */}
                        {isLoading ? 'Logging In...' : 'Login'}
                    </button>

                     <div className="auth-link-container">
                         Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                    </div>
                </form>
            </AuthCard>
        </div>
    );
};

export default Login;
