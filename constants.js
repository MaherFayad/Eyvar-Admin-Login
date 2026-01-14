/* ====================================
   EYVAR ADMIN LOGIN - CONSTANTS
   Centralized configuration values
   ==================================== */

const APP_CONFIG = {
    // OTP Configuration
    OTP_LENGTH: 4,
    OTP_TIMER_SECONDS: 60,

    // Password Requirements
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*\d).{8,}$/,

    // Email Validation
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // Navigation Routes
    ROUTES: {
        LOGIN: '../',
        FORGOT_PASSWORD: '../forgot-password/',
        ENTER_OTP: '../enter-otp/',
        CHANGE_PASSWORD: '../change-password/',
        DASHBOARD: '/dashboard'
    },

    // UI Messages
    MESSAGES: {
        LOGIN_SUCCESS: 'Login successful!',
        PASSWORD_CHANGED: 'Password changed successfully!',
        INVALID_EMAIL: 'Please enter a valid email address',
        INVALID_PASSWORD: 'Incorrect password. Please try again',
        PASSWORD_REQUIREMENTS: 'Password does not meet requirements',
        PASSWORD_MISMATCH: 'Passwords do not match',
        OTP_RESENT: 'OTP resent successfully'
    },

    // Button Text
    BUTTONS: {
        SEND_OTP: 'Send OTP',
        CONTINUE: 'Continue'
    }
};

// Freeze the config to prevent accidental modifications
Object.freeze(APP_CONFIG);
Object.freeze(APP_CONFIG.ROUTES);
Object.freeze(APP_CONFIG.MESSAGES);
Object.freeze(APP_CONFIG.BUTTONS);
