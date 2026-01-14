# Eyvar Admin Login

A modern, responsive authentication flow for the Eyvar Admin Dashboard.

## 📁 Project Structure

```
Eyvar Admin Login/
├── index.html              # Login page (entry point)
├── forgot-password/
│   └── index.html          # Forgot password page
├── enter-otp/
│   └── index.html          # OTP verification page
├── change-password/
│   └── index.html          # Password reset page
├── styles.css              # Global styles & design tokens
├── constants.js            # Configuration constants
├── app.js                  # Application logic
├── assets/
│   ├── favicon.ico         # Browser favicon (legacy)
│   ├── favicon.svg         # Browser favicon (modern)
│   ├── apple-touch-icon.png # iOS home screen icon
│   ├── site.webmanifest    # PWA manifest
│   ├── logo.svg            # Eyvar logo
│   ├── Device.png          # Phone mockup image
│   ├── Phone Image.png     # Background image
│   ├── eye.svg             # Password show icon
│   └── eye-slash.svg       # Password hide icon
└── README.md
```

## 🔄 Authentication Flow

```
Login → Forgot Password → Enter OTP → Change Password → Login
```

| Page | URL | Purpose |
|------|-----|---------|
| Login | `/` | User authentication |
| Forgot Password | `/forgot-password/` | Request password reset |
| Enter OTP | `/enter-otp/` | Verify OTP code |
| Change Password | `/change-password/` | Set new password |


## 🔧 Configuration

All configurable values are centralized in `constants.js`:

```javascript
const APP_CONFIG = {
    // OTP Configuration
    OTP_LENGTH: 4,              // Number of OTP digits
    OTP_TIMER_SECONDS: 60,      // Resend countdown timer

    // Password Requirements
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*\d).{8,}$/,

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
        // ... more messages
    }
};
```

---

## 🔌 Backend Integration

To connect a real backend, you need to modify **one file**: `app.js`

### Files to Modify

| File | What to Change |
|------|----------------|
| `app.js` | Replace mock navigation with API calls in `handleFormSuccess()` function |
| `app.js` | Add API call in `resendOTP()` function |
| `constants.js` | Add your `API_BASE_URL` configuration |

### Functions to Update in `app.js`

| Function | Current Behavior | Backend Behavior |
|----------|------------------|------------------|
| `handleFormSuccess()` → `case 'login'` | Shows success message | Call login API, store auth token, redirect to dashboard |
| `handleFormSuccess()` → `case 'forgot-password'` | Navigates to OTP page | Call forgot-password API, store email in session, then navigate |
| `handleFormSuccess()` → `case 'otp'` | Navigates to change password | Call verify-otp API, store reset token, then navigate |
| `handleFormSuccess()` → `case 'change-password'` | Shows success, redirects to login | Call reset-password API, clear session, then redirect |
| `resendOTP()` | Resets timer and clears inputs | Call forgot-password API again, then reset timer |

### Session Storage Keys to Use

| Key | Purpose |
|-----|---------|
| `resetEmail` | Store email after forgot-password for OTP verification |
| `resetToken` | Store token after OTP verification for password reset |
| `authToken` | Store JWT token after successful login |

### Error Handling Locations

| Location | How to Show Errors |
|----------|-------------------|
| Login errors | Use `showFieldError(passwordField, message)` |
| Email errors | Use `showFieldError(emailField, message)` |
| OTP errors | Use `showOTPError()` and `clearOTPError()` functions |
| Password errors | Use `showFieldError(passwordField, message)` |

> ⚠️ **Remove Before Production**: In `app.js` → `validateOTPForm()`, there is a test condition where OTP `1111` always shows an error. Remove this check when connecting to a real backend.

---

## 🎨 Styling

### Design Tokens (CSS Variables)

Located in `styles.css`:

```css
:root {
    /* Colors */
    --primary-300: #13AC6F;      /* Primary green */
    --alert-error: #DF1C41;       /* Error red */
    --greyscale-900: #0D0D12;     /* Text color */
    
    /* Typography */
    --font-family: 'Inter', sans-serif;
    
    /* Spacing */
    --spacing-4: 16px;
    --spacing-6: 24px;
    
    /* Border Radius */
    --radius-md: 8px;
}
```

### Responsive Breakpoints

| Breakpoint | Description |
|------------|-------------|
| `1023px` | Hide phone mockup |
| `767px` | Mobile layout |
| `374px` | Small mobile adjustments |

---

## 📝 Validation Rules

| Field | Rule |
|-------|------|
| Email | Must match email format |
| Password | Min 8 chars, 1 uppercase, 1 number |
| OTP | 4 numeric digits |

---

## 🧪 Testing

1. **Login Flow**: Enter any email/password to see validation
2. **Forgot Password**: Enter email → auto-navigates to OTP page
3. **OTP**: Enter 4 digits, timer counts down, "Resend" appears after 60s
4. **Change Password**: Must match requirements and confirm

---
