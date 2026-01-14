/* ====================================
   EYVAR ADMIN LOGIN - APP JAVASCRIPT
   Form Validation, OTP, Timer Logic
   ==================================== */

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // Initialize password toggles
    initPasswordToggles();

    // Initialize OTP inputs
    initOTPInputs();

    // Initialize forms
    initForms();

    // Initialize timer if on OTP page
    initTimer();
}

/* ====================================
   PASSWORD TOGGLE
   ==================================== */
function initPasswordToggles() {
    const toggles = document.querySelectorAll('.password-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.closest('.input-wrapper').querySelector('input');
            const isPassword = input.type === 'password';
            const icon = this.querySelector('.eye-icon');

            input.type = isPassword ? 'text' : 'password';

            // Update icon source to toggle between eye and eye-slash
            if (icon) {
                const currentSrc = icon.src;
                if (currentSrc.includes('eye-slash.svg')) {
                    icon.src = currentSrc.replace('eye-slash.svg', 'eye.svg');
                    icon.alt = 'Hide password';
                } else {
                    icon.src = currentSrc.replace('eye.svg', 'eye-slash.svg');
                    icon.alt = 'Show password';
                }
            }
        });
    });
}

/* ====================================
   OTP INPUT HANDLING
   ==================================== */
function initOTPInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');

    if (otpInputs.length === 0) return;

    otpInputs.forEach((input, index) => {
        // Only allow numbers
        input.addEventListener('input', function (e) {
            const value = this.value.replace(/[^0-9]/g, '');
            this.value = value.slice(0, 1);

            // Auto-advance to next input
            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }

            // Update filled state
            this.classList.toggle('filled', value.length > 0);

            // Check if all inputs are filled
            checkOTPComplete();
        });

        // Handle backspace
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });

        // Handle paste
        input.addEventListener('paste', function (e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');

            pastedData.split('').slice(0, APP_CONFIG.OTP_LENGTH).forEach((char, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = char;
                    otpInputs[i].classList.add('filled');
                }
            });

            // Focus the next empty input or the last one
            const nextEmpty = Array.from(otpInputs).findIndex(inp => !inp.value);
            if (nextEmpty !== -1) {
                otpInputs[nextEmpty].focus();
            } else {
                otpInputs[otpInputs.length - 1].focus();
            }

            checkOTPComplete();
        });
    });
}

function checkOTPComplete() {
    const otpInputs = document.querySelectorAll('.otp-input');
    const submitBtn = document.querySelector('.btn-primary');

    if (otpInputs.length === 0 || !submitBtn) return;

    const isComplete = Array.from(otpInputs).every(input => input.value.length === 1);
    submitBtn.disabled = !isComplete;
}

function getOTPValue() {
    const otpInputs = document.querySelectorAll('.otp-input');
    return Array.from(otpInputs).map(input => input.value).join('');
}

/* ====================================
   TIMER FUNCTIONALITY
   ==================================== */
let timerInterval = null;
let timeRemaining = APP_CONFIG.OTP_TIMER_SECONDS;

function initTimer() {
    const timerElement = document.querySelector('.timer');
    const resendLink = document.querySelector('.resend-link');
    const timerContainer = document.querySelector('.timer-text');

    if (!timerElement && !timerContainer) return;

    startTimer();

    if (resendLink) {
        resendLink.addEventListener('click', function (e) {
            e.preventDefault();
            resendOTP();
        });
    }
}

function startTimer() {
    const timerContainer = document.querySelector('.timer-text');

    if (!timerContainer) return;

    timeRemaining = APP_CONFIG.OTP_TIMER_SECONDS;
    updateTimerDisplay();

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            showResendLink();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerContainer = document.querySelector('.timer-text');

    if (!timerContainer) return;

    if (timeRemaining > 0) {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        timerContainer.innerHTML = `I didn't receive a code <span class="timer">(${timeString})</span>`;
    }
}

function showResendLink() {
    const timerContainer = document.querySelector('.timer-text');
    const submitBtn = document.querySelector('.btn-primary');

    if (timerContainer) {
        timerContainer.innerHTML = `I didn't receive a code <a href="#" class="resend-link">Resend</a>`;

        // Reattach event listener
        const resendLink = timerContainer.querySelector('.resend-link');
        if (resendLink) {
            resendLink.addEventListener('click', function (e) {
                e.preventDefault();
                resendOTP();
            });
        }
    }

    if (submitBtn) {
        submitBtn.textContent = APP_CONFIG.BUTTONS.CONTINUE;
    }
}

function resendOTP() {
    const submitBtn = document.querySelector('.btn-primary');

    // Reset timer
    startTimer();

    // Reset button text
    if (submitBtn) {
        submitBtn.textContent = APP_CONFIG.BUTTONS.SEND_OTP;
    }

    // Clear OTP inputs
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled');
    });

    if (otpInputs.length > 0) {
        otpInputs[0].focus();
    }

    // Show feedback (in real app, this would trigger API call)
    console.log(APP_CONFIG.MESSAGES.OTP_RESENT);
}

/* ====================================
   FORM VALIDATION
   ==================================== */
function initForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Real-time validation
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            // Clear error on input
            clearFieldError(this);
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formType = form.dataset.formType;

    let isValid = true;

    switch (formType) {
        case 'login':
            isValid = validateLoginForm(form);
            break;
        case 'forgot-password':
            isValid = validateForgotPasswordForm(form);
            break;
        case 'otp':
            isValid = validateOTPForm(form);
            break;
        case 'change-password':
            isValid = validateChangePasswordForm(form);
            break;
    }

    if (isValid) {
        handleFormSuccess(formType, form);
    }
}

function validateLoginForm(form) {
    const email = form.querySelector('[name="email"]');
    const password = form.querySelector('[name="password"]');
    let isValid = true;

    if (!validateEmail(email.value)) {
        showFieldError(email, APP_CONFIG.MESSAGES.INVALID_EMAIL);
        isValid = false;
    }

    if (!password.value) {
        showFieldError(password, APP_CONFIG.MESSAGES.INVALID_PASSWORD);
        isValid = false;
    }

    return isValid;
}

function validateForgotPasswordForm(form) {
    const email = form.querySelector('[name="email"]');
    let isValid = true;

    if (!validateEmail(email.value)) {
        showFieldError(email, APP_CONFIG.MESSAGES.INVALID_EMAIL);
        isValid = false;
    }

    return isValid;
}

function validateOTPForm(form) {
    const otpValue = getOTPValue();

    if (otpValue.length !== APP_CONFIG.OTP_LENGTH) {
        // Highlight empty inputs
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach(input => {
            if (!input.value) {
                input.classList.add('error');
            }
        });
        return false;
    }

    return true;
}

function validateChangePasswordForm(form) {
    const password = form.querySelector('[name="password"]');
    const confirmPassword = form.querySelector('[name="confirmPassword"]');
    let isValid = true;

    if (!APP_CONFIG.PASSWORD_REGEX.test(password.value)) {
        showFieldError(password, APP_CONFIG.MESSAGES.PASSWORD_REQUIREMENTS);
        isValid = false;
    }

    if (password.value !== confirmPassword.value) {
        showFieldError(confirmPassword, APP_CONFIG.MESSAGES.PASSWORD_MISMATCH);
        isValid = false;
    }

    return isValid;
}

function validateField(input) {
    const name = input.name;
    const value = input.value;

    if (name === 'email' && value && !validateEmail(value)) {
        showFieldError(input, APP_CONFIG.MESSAGES.INVALID_EMAIL);
    }
}

function validateEmail(email) {
    return APP_CONFIG.EMAIL_REGEX.test(email);
}

function showFieldError(input, message) {
    input.classList.add('error');

    const inputGroup = input.closest('.input-group');
    if (!inputGroup) return;

    // Remove existing error message
    const existingError = inputGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5.33333V8M8 10.6667H8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2418 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2418 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8Z" stroke="#DF1C41" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    ${message}
  `;

    inputGroup.appendChild(errorDiv);
}

function clearFieldError(input) {
    input.classList.remove('error');

    const inputGroup = input.closest('.input-group');
    if (!inputGroup) return;

    const errorMessage = inputGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/* ====================================
   FORM SUCCESS HANDLING
   ==================================== */
function handleFormSuccess(formType, form) {
    console.log(`Form ${formType} submitted successfully`);

    switch (formType) {
        case 'login':
            // In real app: authenticate user
            console.log('Login successful - redirecting to dashboard...');
            // window.location.href = APP_CONFIG.ROUTES.DASHBOARD;
            showSuccessState(form, APP_CONFIG.MESSAGES.LOGIN_SUCCESS);
            break;

        case 'forgot-password':
            // Navigate to OTP page
            window.location.href = APP_CONFIG.ROUTES.ENTER_OTP;
            break;

        case 'otp':
            // Navigate to change password page
            window.location.href = APP_CONFIG.ROUTES.CHANGE_PASSWORD;
            break;

        case 'change-password':
            // Password changed successfully - redirect to login
            showSuccessState(form, APP_CONFIG.MESSAGES.PASSWORD_CHANGED);
            setTimeout(() => {
                window.location.href = APP_CONFIG.ROUTES.LOGIN;
            }, 2000);
            break;
    }
}

function showSuccessState(form, message) {
    const submitBtn = form.querySelector('.btn-primary');
    if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = message;
        submitBtn.style.backgroundColor = 'var(--alert-success)';

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
        }, 2000);
    }
}
