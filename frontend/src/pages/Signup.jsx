import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import './AuthPages.css';

const Signup = () => {
    const { register, isLoading, isAuthenticated, authErrors, clearAuthErrors } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [formErrors, setFormErrors] = useState({});

    // Redirect if user is already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        setFormErrors({});
    }, [clearAuthErrors]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormErrors({});

        if (password !== passwordConfirmation) {
            setFormErrors({ passwordConfirmation: "Passwords do not match." });
            return;
        }

        try {
            await register({
                name, 
                email,
                password,
                password_confirmation: passwordConfirmation
            });
        } catch (error) {
            if (authErrors?.register && typeof authErrors.register === 'object') {
                 const formattedErrors = {};
                 for (const field in authErrors.register) {
                     formattedErrors[field] = authErrors.register[field][0];
                 }
                 setFormErrors(formattedErrors);
            } else {
                setFormErrors({ general: authErrors?.register?.general?.[0] || 'An unexpected error occurred during registration.' });
            }
        }
    };

    return (
        <div className="auth-page-container">
            <AuthCard title="Sign Up">
                <form onSubmit={handleSubmit}>
                    {formErrors.general && <p className="form-error-text">{formErrors.general}</p>}

                    <FormInput
                        label="Full Name"
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        error={formErrors.name}
                    />
                    <FormInput
                        label="Email"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        error={formErrors.email}
                    />
                    <FormInput
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password (min 8 characters)"
                        error={formErrors.password}
                    />
                     <FormInput
                        label="Confirm Password"
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="Re-enter your password"
                        error={formErrors.passwordConfirmation || formErrors.password_confirmation}
                    />

                    <button type="submit" disabled={isLoading} className="auth-button">
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    <div className="auth-link-container">
                         Already have an account? <Link to="/login" className="auth-link">Login</Link>
                    </div>
                </form>
            </AuthCard>
        </div>
    );
};

export default Signup;