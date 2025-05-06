// Form Validation Class
class FormValidator {
    constructor(form) {
      this.form = form;
      this.errors = [];
    }
    
    validateRequired(fieldId, errorMessage) {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        this.errors.push({ field: fieldId, message: errorMessage });
        return false;
      }
      return true;
    }
    
    validateEmail(fieldId, errorMessage) {
      const field = document.getElementById(fieldId);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(field.value.trim())) {
        this.errors.push({ field: fieldId, message: errorMessage });
        return false;
      }
      return true;
    }
    
    validatePasswordMatch(password1Id, password2Id, errorMessage) {
      const pass1 = document.getElementById(password1Id);
      const pass2 = document.getElementById(password2Id);
      
      if (pass1.value !== pass2.value) {
        this.errors.push({ field: password2Id, message: errorMessage });
        return false;
      }
      return true;
    }
    
    validateMinLength(fieldId, minLength, errorMessage) {
      const field = document.getElementById(fieldId);
      if (field.value.length < minLength) {
        this.errors.push({ field: fieldId, message: errorMessage });
        return false;
      }
      return true;
    }
    
    displayErrors() {
      // Clear previous errors
      document.querySelectorAll('.error-message').forEach(el => el.remove());
      document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      
      // Display new errors
      this.errors.forEach(error => {
        const field = document.getElementById(error.field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = error.message;
        
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
        field.classList.add('error');
      });
      
      // If there are errors, focus on the first one
      if (this.errors.length > 0) {
        document.getElementById(this.errors[0].field).focus();
      }
      
      return this.errors.length === 0;
    }
    
    isValid() {
      return this.errors.length === 0;
    }
    
    clearErrors() {
      this.errors = [];
    }
  }

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const createAccountBtn = document.getElementById('create-account');
const backToLoginBtn = document.getElementById('back-to-login');
const authMessage = document.getElementById('auth-message');
const signupMessage = document.getElementById('signup-message');

// Mock user data (in a real application, this would be stored in a database)
let users = [
    {
        username: 'admin',
        password: 'eagles2025',
        email: 'admin@eagleshack.edu',
        isAdmin: true
    }
];

// Admin code for creating new admin accounts
const adminAuthCode = 'EAGLESHACK2025';

// Initialize the authentication events
document.addEventListener('DOMContentLoaded', () => {
    initAuthEvents();
    checkAuthStatus();
});

// Initialize authentication event listeners
function initAuthEvents() {
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Switch to signup form
    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        });
    }
    
    // Switch back to login form
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const validator = new FormValidator(loginForm);
    
    // Validate inputs
    validator.validateRequired('username', 'Username is required');
    validator.validateRequired('password', 'Password is required');
    
    // If validation fails, display errors and stop
    if (!validator.isValid()) {
        validator.displayErrors();
        return;
    }
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Check if user exists and credentials match
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        showAuthMessage('Invalid username or password', 'error');
        return;
    }
    
    // Check if user is an admin
    if (!user.isAdmin) {
        showAuthMessage('You do not have administrator privileges', 'error');
        return;
    }
    
    // Store authentication in local storage or session storage based on remember me
    const authData = {
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        loggedIn: true
    };
    
    if (rememberMe) {
        localStorage.setItem('eagleShackAuth', JSON.stringify(authData));
    } else {
        sessionStorage.setItem('eagleShackAuth', JSON.stringify(authData));
    }
    
    showAuthMessage('Login successful! Redirecting...', 'success');
    
    // Redirect to admin dashboard after a short delay
    setTimeout(() => {
        window.location.href = 'admindashboard.html';
    }, 1500);
}
// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const validator = new FormValidator(signupForm);
    
    // Validate inputs
    validator.validateRequired('new-username', 'Username is required');
    validator.validateRequired('email', 'Email is required');
    validator.validateEmail('email', 'Please enter a valid email address');
    validator.validateRequired('new-password', 'Password is required');
    validator.validateMinLength('new-password', 6, 'Password must be at least 6 characters');
    validator.validateRequired('confirm-password', 'Please confirm your password');
    validator.validatePasswordMatch('new-password', 'confirm-password', 'Passwords do not match');
    validator.validateRequired('admin-code', 'Administrator code is required');
    
    // If validation fails, display errors and stop
    if (!validator.isValid()) {
        validator.displayErrors();
        return;
    }
    
    const username = document.getElementById('new-username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('new-password').value;
    const adminCode = document.getElementById('admin-code').value;
    
    // Check if the admin code is correct
    if (adminCode !== adminAuthCode) {
        showSignupMessage('Invalid administrator code', 'error');
        return;
    }
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
        showSignupMessage('Username already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        username,
        email,
        password,
        isAdmin: true
    };
    
    // Add user to the array (in a real app, this would be saved to a database)
    users.push(newUser);
    
    showSignupMessage('Account created successfully! You can now log in.', 'success');
    
    // Clear form and return to login
    signupForm.reset();
    setTimeout(() => {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    }, 2000);
}

// Show authentication message
function showAuthMessage(message, type) {
    if (!authMessage) return;
    
    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            authMessage.className = 'auth-message';
        }, 3000);
    }
}

// Show signup message
function showSignupMessage(message, type) {
    if (!signupMessage) return;
    
    signupMessage.textContent = message;
    signupMessage.className = `auth-message ${type}`;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            signupMessage.className = 'auth-message';
        }, 3000);
    }
}

// Check authentication status
function checkAuthStatus() {
    // Get auth data from storage
    const authData = JSON.parse(localStorage.getItem('eagleShackAuth') || sessionStorage.getItem('eagleShackAuth') || 'null');
    
    // If on login page and already logged in, redirect to dashboard
    if (window.location.pathname.includes('login.html') && authData && authData.loggedIn) {
        window.location.href = 'admindashboard.html';
    }
    
    // If on admin dashboard and not logged in, redirect to login
    if (window.location.pathname.includes('admindashboard.html') && (!authData || !authData.loggedIn)) {
        window.location.href = 'login.html';
    }
}