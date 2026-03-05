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

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simulate login (in real app, validate with backend)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        showNotification('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 1500);
    } else {
        showNotification('Invalid email or password', 'danger');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const photo = document.getElementById('register-photo').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.email === email)) {
        showNotification('Email already registered', 'danger');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        photo: photo || 'https://via.placeholder.com/40x40?text=' + name.charAt(0).toUpperCase(),
        registeredDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setCurrentUser(newUser);
    showNotification('Registration successful!', 'success');
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 1500);
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
