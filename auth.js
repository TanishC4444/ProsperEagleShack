// Simple password authentication for Eagle Shack Admin
// WARNING: This stores the password in plain text - anyone can see it in the code

const ADMIN_PASSWORD = "EagleShack2025!";

// DOM Elements
const loginForm = document.getElementById('login-form');
const authMessage = document.getElementById('auth-message');

// Initialize the authentication events
document.addEventListener('DOMContentLoaded', () => {
    initAuthEvents();
    checkAuthStatus();
});

/**
 * initAuthEvents
 * Purpose: Initialize authentication event listeners
 */
function initAuthEvents() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

/**
 * handleLogin
 * Purpose: Process login form submission and authenticate user
 */
function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    
    // Validate password is not empty
    if (!password) {
        showAuthMessage('Please enter the administrator password', 'error');
        return;
    }
    
    // Direct password comparison
    if (password !== ADMIN_PASSWORD) {
        showAuthMessage('Incorrect password', 'error');
        // Clear the password field
        document.getElementById('password').value = '';
        return;
    }
    
    // Store authentication in session storage
    const authData = {
        loggedIn: true,
        timestamp: new Date().getTime()
    };
    
    sessionStorage.setItem('eagleShackAuth', JSON.stringify(authData));
    
    showAuthMessage('Access granted! Redirecting...', 'success');
    
    // Redirect to admin dashboard
    setTimeout(() => {
        window.location.href = 'admindashboard.html';
    }, 1000);
}

/**
 * showAuthMessage
 * Purpose: Display an authentication message to the user
 */
function showAuthMessage(message, type) {
    if (!authMessage) return;
    
    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    
    // Auto-hide messages after 3 seconds
    setTimeout(() => {
        authMessage.className = 'auth-message';
    }, 3000);
}

/**
 * checkAuthStatus
 * Purpose: Check if user is authenticated and redirect accordingly
 */
function checkAuthStatus() {
    const authData = JSON.parse(sessionStorage.getItem('eagleShackAuth') || 'null');
    
    // Check if session is valid (logged in within last 2 hours)
    const isValid = authData && 
                   authData.loggedIn && 
                   (new Date().getTime() - authData.timestamp < 2 * 60 * 60 * 1000);
    
    // If on login page and already logged in, redirect to dashboard
    if (window.location.pathname.includes('login.html') && isValid) {
        window.location.href = 'admindashboard.html';
    }
    
    // If on admin dashboard and not logged in, redirect to login
    if (window.location.pathname.includes('admindashboard.html') && !isValid) {
        window.location.href = 'login.html';
    }
}

/**
 * logout
 * Purpose: Log out the user and clear session
 */
function logout() {
    sessionStorage.removeItem('eagleShackAuth');
    window.location.href = 'index.html';
}

// Export logout function for use in admin dashboard
if (typeof window !== 'undefined') {
    window.logout = logout;
}