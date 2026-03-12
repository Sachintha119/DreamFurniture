// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleFormBtn = document.getElementById('toggle-form');
    
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    toggleFormBtn.addEventListener('click', toggleForms);
    
    // Update navbar on page load
    if (typeof updateUserNavbar === 'function') {
        updateUserNavbar();
    }
});

function getApiBaseUrl() {
    if (typeof API_URL !== 'undefined' && API_URL) {
        return API_URL;
    }
    const host = window.location.hostname || 'localhost';
    return `http://${host}:8080/api`;
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Call backend API
    fetch(`${getApiBaseUrl()}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            // Store user info in localStorage
            const user = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                registeredDate: new Date().toISOString()
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            showNotification('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1500);
        } else {
            showNotification(data.error || 'Login failed', 'danger');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        showNotification('Connection error. Please start backend server.', 'danger');
    });
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const photo = document.getElementById('register-photo').value;
    
    // Call backend API
    fetch(`${getApiBaseUrl()}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            photo: photo
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.userId) {
            const newUser = {
                id: data.userId,
                name: name,
                email: email,
                photo: photo || 'https://via.placeholder.com/40x40?text=' + name.charAt(0).toUpperCase(),
                registeredDate: new Date().toISOString()
            };
            setCurrentUser(newUser);
            showNotification('Registration successful!', 'success');
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1500);
        } else {
            showNotification(data.error || 'Registration failed', 'danger');
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        showNotification('Connection error. Please start backend server.', 'danger');
    });
}

function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleBtn = document.getElementById('toggle-form');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        toggleBtn.textContent = 'Create new account';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        toggleBtn.textContent = 'Already have an account? Login';
    }
}
