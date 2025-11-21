// --- EVENT & ACTION HANDLERS ---

function handleUpdateProfile() {
    if (!appState.userId) return;

    const newName = profileNameInput.value.trim();
    const newUnit = profileUnitInput.value.trim();

    if (!newName || !newUnit) {
        showToast("Name and Unit cannot be empty.");
        return;
    }

    appState.userName = newName;
    appState.userUnit = newUnit;

    const userIndex = appState.registeredUsers.findIndex(u => u.id === appState.userId);
    if (userIndex > -1) {
        appState.registeredUsers[userIndex].name = newName;
        appState.registeredUsers[userIndex].unit = newUnit;
    }

    renderAll();
    showToast("Profile updated successfully!");
}

function handleSendMessage() {
    if (!appState.userId) {
        showToast("Please log in to send messages.");
        toggleModal('modal-login');
        return;
    }
    const text = chatInput.value.trim();
    
    if (text) {
        chatInput.disabled = true;
        simulateLoading(() => {
            const newMessage = {
                id: appState.chatMessages.length + 1,
                user: appState.userName,
                unit: appState.userUnit,
                text: text,
                timestamp: Date.now()
            };
            appState.chatMessages.push(newMessage);
            chatInput.value = '';
            chatInput.disabled = false;
            renderChat();
            showToast('Message sent!');
        });
    } else {
        showToast('Message cannot be empty.');
    }
}

function handleRSVP(eventId, eventTitle) {
    if (!appState.userId) {
        showToast("Please log in to RSVP.");
        toggleModal('modal-login');
        return;
    }
    appState.rsvpEventId = eventId;
    rsvpEventTitle.textContent = eventTitle;
    toggleModal('modal-rsvp');
}

function handleConfirmRSVP() {
    const event = appState.events.find(e => e.id === appState.rsvpEventId);
    if (event) {
        if (event.rsvps < 15) { 
            event.rsvps += 1; 
            showToast('You have successfully RSVPd!');
        } else {
            showToast('Sorry, this event is full!');
        }
    }
    renderEvents();
    appState.rsvpEventId = null;
    toggleModal('modal-rsvp');
}

function handleSuggestEvent() {
    if (!appState.userId) {
        showToast("Please log in to suggest an event.");
        toggleModal('modal-login');
        return;
    }
    const newEventId = appState.events.reduce((max, e) => Math.max(max, e.id), 0) + 1;
    const newEvent = {
        id: newEventId,
        title: `Suggested Event by ${appState.userName}`,
        date: 'TBD (Awaiting Approval)',
        location: 'TBD',
        desc: `A new activity suggested by ${appState.userName}. Needs admin review.`,
        approved: false,
        rsvps: 0
    };
    appState.events.push(newEvent);
    renderEvents();
    showToast('Event suggested! Awaiting admin approval.');
}

function handleQuickHelp() {
    if (!appState.userId) {
         showToast("Please log in for Quick Help. Emergency contact: 9999999999");
         toggleModal('modal-login');
         return;
    }
    showToast('URGENT REQUEST SENT to admins! They will contact you shortly.');
}

function handleNewPost() {
    if (!appState.userId) {
        showToast("Please log in to post to the forum.");
        toggleModal('modal-login');
        return;
    }
    const input = document.getElementById('forum-post-input');
    const text = input.value.trim();
    
    if (text) {
        const newPost = {
            id: appState.forumPosts.length + 1,
            user: appState.userName,
            text: text
        };
        appState.forumPosts.push(newPost);
        input.value = '';
        renderForumPosts();
        showToast('Post added!');
    } else {
        showToast('Post cannot be empty.');
    }
}

function handleAISuggestion() {
    const aiTipsContainer = document.getElementById('ai-tips-container');
    const aiTipsContent = document.getElementById('ai-tips-content');
    
    aiTipsContainer.classList.remove('hidden');
    aiTipsContent.innerHTML = `<i data-lucide="loader-circle" class="w-4 h-4 mr-2 animate-spin"></i> Generating tip...`;
    lucide.createIcons();

    simulateLoading(() => {
        const tip = "To reduce water usage, install low-flow aerators on all faucets. This can save up to 30% water without compromising pressure. Also, consider signing up for the 'Green Volunteer Group' via the WhatsApp link below!";
        aiTipsContent.textContent = tip;
    });
}

function handlePaymentClick(id, title, amount) {
    if (!appState.userId) {
        showToast("Please log in to make a payment.");
        toggleModal('modal-login');
        return;
    }

    let paymentAmount = amount;
    
    if (id === 'donate') {
        const donateAmount = document.getElementById('donate-amount').value;
        paymentAmount = parseFloat(donateAmount) || 0;
        if (paymentAmount <= 0) {
            showToast("Please enter a valid donation amount.");
            return;
        }
    }
    
    const transactionId = 'CH' + Date.now().toString().slice(-8);
    const encodedTitle = encodeURIComponent(title);
    const upiLink = `upi://pay?pa=${UPI_VPA}&pn=Community%20Hub&mc=0000&tid=${transactionId}&tr=${transactionId}&am=${paymentAmount.toFixed(2)}&cu=INR&tn=${encodedTitle}`;

    appState.pendingPayment = { id, title, amount: paymentAmount, upiLink };

    upiItemTitle.textContent = title;
    upiItemAmount.textContent = `₹${paymentAmount.toLocaleString()}`;
    upiDeeplinkButton.href = upiLink;
    
    toggleModal('modal-upi-payment');
}

function handleConfirmPayment() {
    if (!appState.pendingPayment) return;

    const { id } = appState.pendingPayment;

    if (id && id !== 'donate') {
        const subIndex = appState.subscriptions.findIndex(s => s.id === id);
        if (subIndex > -1) {
            appState.subscriptions[subIndex].isSubscribed = true;
        }
    }
    
    appState.pendingPayment = null;

    if (id === 'donate') {
        document.getElementById('donate-amount').value = '';
    }

    if (appState.currentPage === 'payments') { renderSubscriptions(); }

    toggleModal('modal-upi-payment');
    showToast('Payment successful!');
}

function handleOpenAddPetModal() {
    if (!appState.userId) {
        showToast("Please log in to add your pet.");
        toggleModal('modal-login');
        return;
    }
    document.getElementById('add-pet-form').reset();
    toggleModal('modal-add-pet');
}

function handleAddPet() {
    const name = document.getElementById('pet-name').value;
    const breed = document.getElementById('pet-breed').value;
    const img = document.getElementById('pet-img').value;

    if (!name || !breed || !img) {
        showToast("Please fill out all fields.");
        return;
    }

    const newPet = {
        id: appState.petProfiles.reduce((max, p) => Math.max(max, p.id), 0) + 1,
        name,
        breed,
        owner: appState.userName,
        ownerId: appState.userId,
        img,
        comments: [],
        phone: appState.userPhone,
    };

    appState.petProfiles.push(newPet);
    renderPetProfiles();
    renderPetGallery();
    toggleModal('modal-add-pet');
    showToast(`${name} has been added to the Pet Corner!`);
}

function handleAddPetCareRequest() {
    if (!appState.userId) {
        showToast("Please log in to make a request.");
        toggleModal('modal-login');
        return;
    }
    const dates = document.getElementById('pet-care-dates').value;
    const phone = document.getElementById('pet-care-phone').value;
    const desc = document.getElementById('pet-care-desc').value;

    if (!dates || !phone || !desc) {
        showToast("Please fill out all fields.");
        return;
    }
    
    if (!validatePhone(phone)) {
         showToast("Please enter a valid 10-digit phone number (digits only).");
         return;
    }

    const newRequest = {
        id: appState.petCareRequests.length + 1,
        user: appState.userName,
        dates,
        desc,
        phone
    };
    appState.petCareRequests.push(newRequest);
    renderPetCareRequests();
    document.getElementById('pet-care-form').reset();
    toggleModal('modal-pet-care');
    showToast("Your caretaker request has been posted!");
    renderProfile(); // Update dashboard metric
}

function handleViewVaccinations() {
    showToast("This would open the pet's vaccination records/chart.");
}

function handleOpenAddMediaModal() {
    if (!appState.userId) {
        showToast("Please log in to share media.");
        toggleModal('modal-login');
        return;
    }
    document.getElementById('add-media-form').reset();
    toggleModal('modal-add-media');
}

function handleAddMedia() {
    const url = document.getElementById('media-url').value;
    const alt = document.getElementById('media-alt').value;

    if (!url || !alt) {
        showToast("Please provide both a URL and a description.");
        return;
    }

    const newMedia = {
        id: appState.galleryImages.reduce((max, m) => Math.max(max, m.id), 0) + 1,
        url: url,
        alt: alt,
        user: appState.userName
    };

    appState.galleryImages.push(newMedia);
    renderGallery();
    toggleModal('modal-add-media');
    showToast(`Media posted by ${appState.userName}!`);
}

function toggleSport(sport) {
    document.getElementById('section-cricket').classList.toggle('hidden', sport !== 'cricket');
    document.getElementById('section-badminton').classList.toggle('hidden', sport !== 'badminton');
    document.getElementById('btn-cricket').className = `flex-1 py-1.5 text-sm font-medium rounded-md ${sport === 'cricket' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:text-gray-800'}`;
    document.getElementById('btn-badminton').className = `flex-1 py-1.5 text-sm font-medium rounded-md ${sport === 'badminton' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:text-gray-800'}`;
}

function handleAddCricketStats() {
    if (!appState.userId) return;
    const role = document.getElementById('c-role').value;
    const matches = parseInt(document.getElementById('c-matches').value) || 0;
    const runs = parseInt(document.getElementById('c-runs').value) || 0;
    const wickets = parseInt(document.getElementById('c-wickets').value) || 0;
    const bestScore = parseInt(document.getElementById('c-bestScore').value) || 0;
    const bestBowling = document.getElementById('c-bestBowling').value;
    const lastMatch = document.getElementById('c-lastMatch').value;

    appState.sportsProfiles = appState.sportsProfiles.filter(p => !(p.userId === appState.userId && p.sport === 'cricket'));

    appState.sportsProfiles.push({
        id: Date.now(),
        userId: appState.userId,
        sport: 'cricket',
        name: appState.userName,
        role, matches, runs, wickets, bestScore, bestBowling, lastMatch
    });

    toggleModal('modal-add-cricket');
    renderSports();
    showToast('Cricket stats updated!');
}

function handleAddBadmintonStats() {
    if (!appState.userId) return;
    const matches = parseInt(document.getElementById('b-matches').value) || 0;
    const wins = parseInt(document.getElementById('b-wins').value) || 0;
    const losses = parseInt(document.getElementById('b-losses').value) || 0;
    const lastMatch = document.getElementById('b-lastMatch').value;
    const looking = document.getElementById('b-looking').checked;

    appState.sportsProfiles = appState.sportsProfiles.filter(p => !(p.userId === appState.userId && p.sport === 'badminton'));

    appState.sportsProfiles.push({
        id: Date.now(),
        userId: appState.userId,
        sport: 'badminton',
        name: appState.userName,
        matches, wins, losses, looking, lastMatch
    });

    toggleModal('modal-add-badminton');
    renderSports();
    showToast('Badminton stats updated!');
}

function handleShowMyStats() {
    if (!appState.userId) {
        showToast('Please log in to view your stats.');
        return;
    }
    const container = document.getElementById('my-stats-content');
    container.innerHTML = '';
    
    const myStats = appState.sportsProfiles.filter(p => p.userId === appState.userId);
    
    if (myStats.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500">You have no sports stats recorded.</p>';
    } else {
        myStats.forEach(s => {
            if (s.sport === 'cricket') {
                container.innerHTML += `
                    <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <h4 class="font-bold text-indigo-800 mb-2">🏏 Cricket (${s.role})</h4>
                        <div class="grid grid-cols-2 gap-2">
                            <p>Matches: ${s.matches}</p>
                            <p>Runs: ${s.runs}</p>
                            <p>Wickets: ${s.wickets}</p>
                            <p>Best Score: ${s.bestScore}</p>
                            <p>Best Bowling: ${s.bestBowling || 'N/A'}</p>
                        </div>
                        <p class="text-xs text-gray-500 mt-2 border-t pt-1 border-indigo-200">Last Match: ${s.lastMatch || 'N/A'}</p>
                    </div>
                `;
            } else {
                container.innerHTML += `
                    <div class="bg-red-50 p-3 rounded-lg border border-red-100">
                        <h4 class="font-bold text-red-800 mb-2">🏸 Badminton</h4>
                        <div class="grid grid-cols-2 gap-2">
                            <p>Matches: ${s.matches}</p>
                            <p>Wins: ${s.wins}</p>
                            <p>Losses: ${s.losses}</p>
                            <p>${s.looking ? 'Looking for Game' : 'Not Looking'}</p>
                        </div>
                        <p class="text-xs text-gray-500 mt-2 border-t pt-1 border-red-200">Last Match: ${s.lastMatch || 'N/A'}</p>
                    </div>
                `;
            }
        });
    }
    toggleModal('modal-my-stats');
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial render of all content
    renderAll();

    // Activate icons
    lucide.createIcons();
    
    // Set default user state (Guest)
    appState.userId = null;
    appState.userName = 'Guest';
    appState.userPhone = null;
    appState.userUnit = null;
    appState.userRole = null;

    // Add event listener for Enter key in chat input
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default newline
            handleSendMessage();
        }
    });
});
