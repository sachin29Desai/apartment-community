// --- AUTHENTICATION FUNCTIONS ---

function setAuthState(user) {
    appState.isAdmin = user.role === 'admin';
    appState.userId = user.id;
    appState.userName = user.name;
    appState.userPhone = user.phone;
    appState.userUnit = user.unit;
    appState.userRole = user.role;
    
    loginButton.classList.add('hidden');
    logoutButton.classList.remove('hidden');
    
    renderAll();
    
    showToast(`Welcome, ${appState.userName}!`);
}

function handleLoginAttempt() {
    const phone = document.getElementById('login-phone').value.trim();
    
    if (!validatePhone(phone)) {
         showToast("Please enter a valid 10-digit phone number.");
         return;
    }
    
    const user = appState.registeredUsers.find(u => u.phone === phone);

    if (user) {
        toggleModal('modal-login');
        setAuthState(user);
        document.getElementById('login-phone').value = '';
    } else {
        showToast("Phone number not registered. Please register first.");
    }
}

function handleAdminLogin() {
    const admin = appState.registeredUsers.find(u => u.role === 'admin');
    if (admin) {
        toggleModal('modal-login');
        setAuthState(admin);
    } else {
         showToast("Admin account not found in simulation.");
    }
}

function handleRegister() {
    const name = document.getElementById('register-name').value.trim();
    const unit = document.getElementById('register-unit').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    
    if (!name || !unit || !phone) {
        showToast("Please fill all fields.");
        return;
    }
    
    if (!validatePhone(phone)) {
        showToast("Please enter a valid 10-digit phone number.");
        return;
    }
    
    if (appState.registeredUsers.some(u => u.phone === phone)) {
        showToast("This phone number is already registered. Please sign in.");
        return;
    }
    
    const newUserId = 'user-' + Math.random().toString(36).substring(2, 9);
    
    const newUser = {
        id: newUserId,
        name,
        phone,
        unit,
        role: 'resident'
    };
    
    appState.registeredUsers.push(newUser);
    
    toggleModal('modal-register');
    setAuthState(newUser);
    showToast("Registration successful! Welcome to the Community Hub.");
    
    document.getElementById('register-name').value = '';
    document.getElementById('register-unit').value = '';
    document.getElementById('register-phone').value = '';
}

function handleLogout() {
    appState.isAdmin = false;
    appState.userId = null;
    appState.userName = 'Guest';
    appState.userPhone = null;
    appState.userUnit = null;
    appState.userRole = null;
    logoutButton.classList.add('hidden');
    loginButton.classList.remove('hidden');
    showToast('Logged out successfully.');

    renderAll();
    showPage('home');
}

function validatePhone(phone) {
    return /^\d{10}$/.test(phone);
}
