import React from 'react';
import './AuthCard.css'; 

const AuthCard = ({ title, children }) => {
    return (
        <div className="auth-card">
            {title && <h2 className="auth-card-title">{title}</h2>}
            <div className="auth-card-body">
                {children}
            </div>
        </div>
    );
};

export default AuthCard;