// Firebase Authentication for Eagle Shack Admin
// Password-only login with secure backend authentication

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyARZ2FkmXFNoOXiRHpYjTZZQJw74o5YT7Y",
    authDomain: "eagle-shack.firebaseapp.com",
    databaseURL: "https://eagle-shack-default-rtdb.firebaseio.com",
    projectId: "eagle-shack",
    storageBucket: "eagle-shack.firebasestorage.app",
    messagingSenderId: "102815168895",
    appId: "1:102815168895:web:367f184ca02e2d9f19824a",
    measurementId: "G-W9J8MG3CZT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const loginForm = document.getElementById('login-form');
const authMessage = document.getElementById('auth-message');

// Fixed admin email (not visible to user)
const ADMIN_EMAIL = 'admin@eagleshack.com';

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
    
    // Listen for auth state changes
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            if (window.location.pathname.includes('login.html') || window.location.pathname.includes('admin.html')) {
                window.location.href = 'admindashboard.html';
            }
        } else {
            // User is signed out
            if (window.location.pathname.includes('admindashboard.html')) {
                window.location.href = 'login.html';
            }
        }
    });
}

/**
 * handleLogin
 * Purpose: Process login form submission - password only
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    
    // Validate password is not empty
    if (!password) {
        showAuthMessage('Please enter your password', 'error');
        return;
    }
    
    try {
        // Sign in with fixed email and user's password
        await auth.signInWithEmailAndPassword(ADMIN_EMAIL, password);
        
        showAuthMessage('Access granted! Redirecting...', 'success');
        
        // Redirect happens automatically via onAuthStateChanged
        setTimeout(() => {
            window.location.href = 'admindashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        
        // Handle different error types
        let errorMessage = 'Incorrect password';
        
        if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many attempts. Please try again later.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your connection.';
        }
        
        showAuthMessage(errorMessage, 'error');
        
        // Clear the password field
        document.getElementById('password').value = '';
    }
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
    auth.onAuthStateChanged(user => {
        // If on login page and already logged in, redirect to dashboard
        if ((window.location.pathname.includes('login.html') || window.location.pathname.includes('admin.html')) && user) {
            window.location.href = 'admindashboard.html';
        }
        
        // If on admin dashboard and not logged in, redirect to login
        if (window.location.pathname.includes('admindashboard.html') && !user) {
            window.location.href = 'login.html';
        }
    });
}

/**
 * logout
 * Purpose: Log out the user and clear session
 */
async function logout() {
    try {
        await auth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    }
}

// Export logout function for use in admin dashboard
if (typeof window !== 'undefined') {
    window.logout = logout;
}