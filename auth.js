// API URL - change this to your server address when deployed
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const errorMessage = document.getElementById('error-message');

// Check if user is already logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (user) {
        // Redirect to main page if already logged in
        window.location.href = 'index.html';
    }
}

// Display error message
function showError(message) {
    console.error('Error:', message); // Log error to console for debugging
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Hide error after 5 seconds
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// Handle login form submission
if (document.getElementById('login-form')) {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Logging in...';
        submitButton.disabled = true;
        
        try {
            console.log('Attempting login with:', { email }); // Log for debugging
            
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            console.log('Login response:', data); // Log for debugging
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Save user data to localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to main page
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Login error:', error); // Log for debugging
            showError(error.message || 'Failed to connect to server. Please try again.');
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}

// Handle registration form submission
if (document.getElementById('register-form')) {
    const registerForm = document.getElementById('register-form');
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Show loading state
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Registering...';
        submitButton.disabled = true;
        
        // Validate password match
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            return;
        }
        
        try {
            console.log('Attempting registration with:', { username, email }); // Log for debugging
            
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            console.log('Registration response:', data); // Log for debugging
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            // Redirect to login page
            window.location.href = 'login.html?registered=true';
            
        } catch (error) {
            console.error('Registration error:', error); // Log for debugging
            showError(error.message || 'Failed to connect to server. Please try again.');
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}

// Check for registration success message
function checkRegistrationSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Registration successful! Please log in.';
        
        // Insert before the form
        const form = document.getElementById('login-form');
        form.parentNode.insertBefore(successMessage, form);
    }
}

// Add success message style if not already in CSS
if (!document.querySelector('style#auth-js-styles')) {
    const style = document.createElement('style');
    style.id = 'auth-js-styles';
    style.textContent = `
        .success-message {
            background-color: rgba(29, 185, 84, 0.2);
            color: #1DB954;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth.js initialized'); // Log for debugging
    checkAuth();
    
    // Check for registration success if on login page
    if (document.getElementById('login-form')) {
        checkRegistrationSuccess();
    }
}); 