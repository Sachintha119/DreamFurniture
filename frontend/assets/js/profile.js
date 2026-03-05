// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    setupProfileForm();
    setupImageUpload();
});

function setupImageUpload() {
    const dropZone = document.getElementById('drop-zone');
    const photoInput = document.getElementById('photo-upload');
    
    // Click to browse
    dropZone.addEventListener('click', () => photoInput.click());
    
    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = '#0d6efd';
        dropZone.style.backgroundColor = '#f8f9ff';
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = '#dee2e6';
        dropZone.style.backgroundColor = 'transparent';
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = '#dee2e6';
        dropZone.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    });
    
    // File input change
    photoInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageFile(e.target.files[0]);
        }
    });
}

function handleImageFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'danger');
        return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showNotification('Image size must be less than 5MB', 'danger');
        return;
    }
    
    // Show loading state
    const dropZoneText = document.getElementById('drop-zone-text');
    const uploadProgress = document.getElementById('upload-progress');
    dropZoneText.style.display = 'none';
    uploadProgress.style.display = 'block';
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        updatePhotoFromFile(base64Image);
        
        // Reset UI
        dropZoneText.style.display = 'block';
        uploadProgress.style.display = 'none';
        document.getElementById('photo-upload').value = '';
    };
    reader.readAsDataURL(file);
}

function updatePhotoFromFile(base64Image) {
    const user = getCurrentUser();
    
    if (!user) {
        showNotification('Please login first', 'warning');
        return;
    }
    
    user.photo = base64Image;
    setCurrentUser(user);
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update avatar display
    document.getElementById('profile-avatar').src = base64Image;
    
    showNotification('Profile photo updated successfully!', 'success');
    
    // Refresh navbar
    if (typeof updateUserNavbar === 'function') {
        updateUserNavbar();
    }
}

function updatePhotoFromURL() {
    const user = getCurrentUser();
    const newPhotoUrl = document.getElementById('new-photo').value.trim();

    if (!newPhotoUrl) {
        showNotification('Please enter a photo URL', 'warning');
        return;
    }

    // Validate URL
    try {
        new URL(newPhotoUrl);
    } catch (e) {
        showNotification('Invalid URL format', 'danger');
        return;
    }

    user.photo = newPhotoUrl;
    setCurrentUser(user);

    // Update in users list
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Update avatar display
    document.getElementById('profile-avatar').src = newPhotoUrl;
    document.getElementById('new-photo').value = '';

    showNotification('Photo updated successfully!', 'success');

    // Refresh navbar
    if (typeof updateUserNavbar === 'function') {
        updateUserNavbar();
    }
}

function loadUserProfile() {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Load profile data
    document.getElementById('profile-name').value = user.name;
    document.getElementById('profile-email').value = user.email;
    document.getElementById('profile-phone').value = user.phone || '';
    document.getElementById('profile-address').value = user.address || '';
    
    // Load avatar
    const avatarUrl = user.photo || 'https://via.placeholder.com/150?text=' + user.name.charAt(0).toUpperCase();
    document.getElementById('profile-avatar').src = avatarUrl;
}

function setupProfileForm() {
    const form = document.getElementById('profile-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileChanges();
    });
}

function saveProfileChanges() {
    const user = getCurrentUser();
    
    if (!user) {
        showNotification('Please login first', 'warning');
        return;
    }

    const name = document.getElementById('profile-name').value;
    const phone = document.getElementById('profile-phone').value;
    const address = document.getElementById('profile-address').value;
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate name
    if (!name.trim()) {
        showNotification('Name cannot be empty', 'danger');
        return;
    }

    // Validate password change if attempting to change
    if (newPassword || confirmPassword) {
        if (!currentPassword) {
            showNotification('Enter current password to change password', 'danger');
            return;
        }

        if (currentPassword !== user.password) {
            showNotification('Current password is incorrect', 'danger');
            return;
        }

        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'danger');
            return;
        }

        if (newPassword.length < 3) {
            showNotification('New password must be at least 3 characters', 'danger');
            return;
        }

        user.password = newPassword;
    }

    // Update user profile
    user.name = name;
    user.phone = phone;
    user.address = address;

    // Update in localStorage
    setCurrentUser(user);

    // Update in users list
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Clear password fields
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';

    showNotification('Profile updated successfully!', 'success');
    
    // Refresh navbar to show updated info
    if (typeof updateUserNavbar === 'function') {
        updateUserNavbar();
    }
}

function deleteAccount() {
    const user = getCurrentUser();

    if (!user) {
        showNotification('Please login first', 'warning');
        return;
    }

    if (confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
        if (confirm('Please confirm again - this will permanently delete your account and all associated data.')) {
            // Remove from users list
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const filteredUsers = users.filter(u => u.email !== user.email);
            localStorage.setItem('users', JSON.stringify(filteredUsers));

            // Remove from current user
            localStorage.removeItem('currentUser');

            showNotification('Account deleted successfully. Redirecting to login...', 'success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }
}
