// --- DOM ELEMENTS ---
const navItems = document.querySelectorAll('.nav-item');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const homeEventsList = document.getElementById('home-events-list');
const eventsList = document.getElementById('events-list');
const forumPostsList = document.getElementById('forum-posts-list');
const galleryGrid = document.getElementById('gallery-grid');
const petProfilesList = document.getElementById('pet-profiles-list');
const rsvpEventTitle = document.getElementById('rsvp-event-title');
const globalLoader = document.getElementById('global-loader');
const subscriptionsList = document.getElementById('subscriptions-list'); 
const upiItemTitle = document.getElementById('upi-item-title'); 
const upiItemAmount = document.getElementById('upi-item-amount'); 
const petCareRequestsList = document.getElementById('pet-care-requests-list');
const petGalleryGrid = document.getElementById('pet-gallery-grid');
const commentPetName = document.getElementById('comment-pet-name');
const upiDeeplinkButton = document.getElementById('upi-deeplink-button');
const chatMessagesContainer = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const adminDashboard = document.getElementById('admin-dashboard');
const adminMetrics = document.getElementById('admin-metrics');

// Profile Page Elements
const profileDisplayName = document.getElementById('profile-display-name');
const profileDisplayUnit = document.getElementById('profile-display-unit');
const profileDisplayRole = document.getElementById('profile-display-role');
const profileNameInput = document.getElementById('profile-name');
const profileUnitInput = document.getElementById('profile-unit');
const profilePhoneInput = document.getElementById('profile-phone');


// --- UI HELPER FUNCTIONS ---

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) {
            lucide.createIcons();
        }
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 3000);
}

function simulateLoading(callback) {
    globalLoader.classList.remove('hidden');
    setTimeout(() => {
        globalLoader.classList.add('hidden');
        if (callback) callback();
    }, 500);
}

// --- RENDER FUNCTIONS ---

function renderAll() {
    renderEvents();
    renderForumPosts();
    renderGallery();
    renderPetProfiles();
    renderSubscriptions();
    renderPetCareRequests();
    renderPetGallery();
    renderProfile();
    renderChat();
    renderSports();
    lucide.createIcons();
}

function renderEvents() {
    if (!eventsList || !homeEventsList) return;
    eventsList.innerHTML = '';
    homeEventsList.innerHTML = '';

    const approvedEvents = appState.events.filter(e => e.approved);

    if (approvedEvents.length === 0) {
        const placeholder = '<p class="text-sm text-gray-500">No upcoming events. Stay tuned!</p>';
        eventsList.innerHTML = placeholder;
        homeEventsList.innerHTML = placeholder;
        return;
    }

    approvedEvents.forEach(event => {
        const isRsvpd = false; // This logic can be enhanced if we track RSVPs per user
        const eventHtml = `
            <div class="bg-white p-4 rounded-xl shadow border border-gray-200">
                <h4 class="font-bold text-lg text-indigo-700">${event.title}</h4>
                <p class="text-sm text-gray-600 flex items-center mt-1">
                    <i data-lucide="calendar" class="w-4 h-4 mr-2"></i> ${event.date} at ${event.location}
                </p>
                <p class="text-sm text-gray-500 mt-2">${event.desc}</p>
                <div class="flex justify-between items-center mt-3 pt-3 border-t">
                    <p class="text-xs text-gray-500">${event.rsvps} RSVP${event.rsvps !== 1 ? 's' : ''}</p>
                    ${appState.userId ? 
                        `<button class="text-sm px-3 py-1 rounded-full ${isRsvpd ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}" ${isRsvpd ? 'disabled' : ''} onclick="handleRSVP(${event.id}, '${event.title}')">${isRsvpd ? 'RSVP Confirmed' : 'RSVP Now'}</button>` :
                        `<button class="text-sm px-3 py-1 rounded-full bg-gray-500 text-white" onclick="toggleModal('modal-login')">Login to RSVP</button>`
                    }
                </div>
            </div>
        `;
        eventsList.innerHTML += eventHtml;
        if (homeEventsList.children.length < 2) {
            homeEventsList.innerHTML += eventHtml;
        }
    });
}

function renderForumPosts() {
    if (!forumPostsList) return;
    forumPostsList.innerHTML = '';
    if (appState.forumPosts.length === 0) {
        forumPostsList.innerHTML = '<p class="text-sm text-gray-500">No posts yet. Start a conversation!</p>';
        return;
    }
    [...appState.forumPosts].reverse().forEach(post => {
        forumPostsList.innerHTML += `
            <div class="bg-white p-4 rounded-xl shadow border border-gray-200">
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-indigo-600">${post.user}</span>
                    <span class="text-xs text-gray-400">${new Date().toLocaleTimeString()}</span>
                </div>
                <p class="text-gray-700 mt-1">${post.text}</p>
                <div class="flex space-x-2 mt-2 pt-2 border-t text-sm text-gray-500">
                    <button class="flex items-center hover:text-indigo-600"><i data-lucide="message-square" class="w-4 h-4 mr-1"></i> Reply</button>
                    <button class="flex items-center hover:text-indigo-600"><i data-lucide="thumbs-up" class="w-4 h-4 mr-1"></i> Like</button>
                </div>
            </div>
        `;
    });
}

function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    if (appState.galleryImages.length === 0) {
         galleryGrid.innerHTML = '<p class="text-gray-500 text-sm col-span-2">No media uploaded yet. Be the first!</p>';
         return;
    }
    [...appState.galleryImages].reverse().forEach(image => {
        galleryGrid.innerHTML += `
            <img src="${image.url}" alt="${image.alt}" class="w-full h-auto aspect-square rounded-lg object-cover shadow-sm hover:opacity-80 transition-opacity" onerror="this.src='https://placehold.co/300x300/e0e7ff/4f46e5?text=Bad+URL'">
        `;
    });
}

function renderPetProfiles() {
    if (!petProfilesList) return;
    petProfilesList.innerHTML = '';
    if (appState.petProfiles.length === 0) {
         petProfilesList.innerHTML = '<p class="text-gray-500 text-sm">No pet profiles yet. Add your furry friend!</p>';
         return;
    }
    appState.petProfiles.forEach(pet => {
        let commentsHtml = pet.comments.map(comment => `<div class="text-xs bg-gray-100 p-1.5 rounded-md mt-1"><span class="font-semibold">${comment.user}:</span><span class="text-gray-700">${comment.text}</span></div>`).join('');
        let buttonsHtml = '';
        if (appState.userId && appState.userId !== pet.ownerId) {
            buttonsHtml += `<button class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full hover:bg-green-200" onclick="handleOpenPetsitOfferModal(${pet.id}, '${pet.name}')">Offer to Pet Sit</button>`;
        }
        if (appState.userId) {
            buttonsHtml += `<button class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-200" onclick="handleOpenPetCommentModal(${pet.id}, '${pet.name}')">Add Comment</button>`;
        }
        petProfilesList.innerHTML += `
            <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                <div class="flex gap-3">
                    <img src="${pet.img}" alt="${pet.name}" class="w-24 h-24 rounded-lg object-cover" onerror="this.src='https://placehold.co/200x200/d1d5db/4b5563?text=No+Img'">
                    <div class="flex-1">
                        <h4 class="font-semibold text-lg">${pet.name}</h4>
                        <p class="text-sm text-gray-500">${pet.breed}</p>
                        <p class="text-xs text-gray-400">Owner: ${pet.owner} (${pet.ownerId === appState.userId ? 'You' : pet.owner})</p>
                    </div>
                </div>
                <div class="mt-2">
                    <h5 class="text-sm font-semibold mb-1">Comments:</h5>
                    <div class="max-h-20 overflow-y-auto space-y-1">${commentsHtml || '<p class="text-xs text-gray-400">No comments yet.</p>'}</div>
                    <div class="flex justify-end gap-2 mt-2 pt-2 border-t">${buttonsHtml || '<p class="text-xs text-gray-400">Login to interact</p>'}</div>
                </div>
            </div>
        `;
    });
}

function renderPetCareRequests() {
    if (!petCareRequestsList) return;
    petCareRequestsList.innerHTML = '';
    if (appState.petCareRequests.length === 0) {
        petCareRequestsList.innerHTML = '<p class="text-gray-500 text-sm">No active caretaker requests.</p>';
        return;
    }
    [...appState.petCareRequests].reverse().forEach(req => {
        const whatsappLink = `https://wa.me/91${req.phone}?text=${encodeURIComponent(`Hi ${req.user.split(' ')[0]}, I saw your pet care request for ${req.dates} on the Community App and I might be able to help!`)}`;
        petCareRequestsList.innerHTML += `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
                <p class="font-semibold text-blue-800">${req.user} needs help</p>
                <p class="text-sm text-gray-700"><span class="font-medium">Dates:</span> ${req.dates}</p>
                <p class="text-sm text-gray-700 mt-1">${req.desc}</p>
                <div class="flex space-x-2 mt-2 pt-2 border-t">
                    <button class="text-xs bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700">Help Out</button>
                    <a href="${whatsappLink}" target="_blank" class="text-xs bg-green-500 text-white px-2 py-1 rounded-full flex items-center hover:bg-green-600"><i data-lucide="message-circle" class="w-3 h-3 mr-1"></i> WhatsApp Contact</a>
                </div>
            </div>
        `;
    });
}

function renderPetGallery() {
    if (!petGalleryGrid) return;
    petGalleryGrid.innerHTML = '';
    const petImages = appState.petProfiles.map(pet => pet.img);
    if (petImages.length === 0) {
        petGalleryGrid.innerHTML = '<p class="text-gray-500 text-sm col-span-3">No pet photos yet. Add your pet!</p>';
        return;
    }
    petImages.forEach(imgUrl => {
        petGalleryGrid.innerHTML += `
            <div class="aspect-square rounded-lg overflow-hidden">
                <img src="${imgUrl}" alt="Pet Photo" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/200x200/d1d5db/4b5563?text=No+Img'">
            </div>
        `;
    });
}

function renderSubscriptions() {
    if (!subscriptionsList) return;
    subscriptionsList.innerHTML = '';
    appState.subscriptions.forEach(sub => {
        subscriptionsList.innerHTML += `
            <div class="p-4 bg-white rounded-lg shadow border border-gray-200">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-semibold text-lg">${sub.title}</h4>
                        <p class="text-sm text-gray-500">${sub.desc}</p>
                    </div>
                    <p class="text-xl font-bold text-gray-800">₹${sub.amount.toLocaleString()}</p>
                </div>
                ${appState.userId ? 
                    `<button class="mt-3 w-full py-2 rounded-lg font-medium shadow ${sub.isSubscribed ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}" ${sub.isSubscribed ? 'disabled' : ''} onclick="handlePaymentClick(${sub.isSubscribed ? null : `'${sub.id}'`}, '${sub.title}', ${sub.amount})">${sub.isSubscribed ? 'Subscribed' : 'Subscribe Now'}</button>` : 
                    `<button class="mt-3 w-full py-2 rounded-lg font-medium shadow bg-gray-500 text-white" onclick="toggleModal('modal-login')">Login to Pay</button>`
                }
            </div>
        `;
    });
}

function renderChat() {
    if (!chatMessagesContainer) return;
    if (!appState.userId) {
        chatMessagesContainer.innerHTML = `<p class="text-center text-gray-500 italic mt-4">Please log in to join the chat.</p>`;
        return;
    }
    const messagesHtml = appState.chatMessages.map(msg => {
        const isSelf = msg.user === appState.userName;
        const alignClass = isSelf ? 'justify-end' : 'justify-start';
        const bubbleClass = isSelf ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-tl-none';
        const userDisplay = isSelf ? 'You' : `${msg.user} (${msg.unit})`;
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="flex ${alignClass} mb-3">
                <div class="max-w-xs md:max-w-md">
                    <div class="text-xs ${isSelf ? 'text-right text-gray-500' : 'text-left text-indigo-600 font-semibold'} mb-1">${userDisplay}</div>
                    <div class="p-3 ${bubbleClass} rounded-xl shadow-md text-sm">${msg.text}</div>
                    <div class="text-right text-xs text-gray-400 mt-0.5">${time}</div>
                </div>
            </div>
        `;
    }).join('');
    chatMessagesContainer.innerHTML = messagesHtml;
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; 
}

function renderProfile() {
    if (!profileDisplayName) return;
    if (!appState.userId) {
        profileDisplayName.textContent = 'Please Log In';
        profileDisplayUnit.textContent = '';
        profileDisplayRole.textContent = '';
        profileNameInput.value = '';
        profileUnitInput.value = '';
        profilePhoneInput.value = '';
        adminDashboard.classList.add('hidden');
        return;
    }
    
    profileDisplayName.textContent = appState.userName;
    profileDisplayUnit.textContent = `Unit: ${appState.userUnit}`;
    profileDisplayRole.textContent = appState.isAdmin ? 'Role: Admin' : 'Role: Resident';
    
    profileNameInput.value = appState.userName;
    profileUnitInput.value = appState.userUnit;
    profilePhoneInput.value = appState.userPhone;

    // --- Admin Dashboard Logic ---
    if (appState.isAdmin) {
        const pendingEventsCount = appState.events.filter(e => !e.approved).length;
        const totalUsers = appState.registeredUsers.length;
        const activeRequests = appState.petCareRequests.length;
        
        adminMetrics.innerHTML = `
            <div class="p-3 bg-red-100 rounded-lg shadow-sm">
                <p class="text-3xl font-bold text-red-700">${pendingEventsCount}</p>
                <p class="text-sm text-gray-700">Pending Events</p>
            </div>
            <div class="p-3 bg-red-100 rounded-lg shadow-sm">
                <p class="text-3xl font-bold text-red-700">${totalUsers}</p>
                <p class="text-sm text-gray-700">Total Residents</p>
            </div>
            <div class="p-3 bg-red-100 rounded-lg shadow-sm col-span-2">
                <p class="text-3xl font-bold text-red-700">${activeRequests}</p>
                <p class="text-sm text-gray-700">Active Pet Care Requests</p>
            </div>
        `;
        adminDashboard.classList.remove('hidden');
    } else {
        adminDashboard.classList.add('hidden');
    }
}

function renderSports() {
    const cricketList = document.getElementById('cricket-leaderboard');
    const badmintonList = document.getElementById('badminton-leaderboard');
    if (!cricketList || !badmintonList) return;

    // Render Cricket
    cricketList.innerHTML = '';
    const cricketProfiles = appState.sportsProfiles.filter(p => p.sport === 'cricket').sort((a, b) => b.runs - a.runs);
    
    if (cricketProfiles.length === 0) cricketList.innerHTML = '<p class="text-sm text-gray-500">No stats yet.</p>';
    
    cricketProfiles.forEach((p, idx) => {
        cricketList.innerHTML += `
            <div class="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                <div>
                    <p class="font-bold text-gray-800">#${idx+1} ${p.name}</p>
                    <p class="text-xs text-gray-500">${p.role} | ${p.matches} Matches</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-indigo-600">${p.runs} Runs</p>
                    <p class="text-xs text-gray-500">${p.wickets} Wickets</p>
                </div>
            </div>
        `;
    });

    // Render Badminton
    badmintonList.innerHTML = '';
    const badmintonProfiles = appState.sportsProfiles.filter(p => p.sport === 'badminton').sort((a, b) => b.wins - a.wins);

    if (badmintonProfiles.length === 0) badmintonList.innerHTML = '<p class="text-sm text-gray-500">No stats yet.</p>';

    badmintonProfiles.forEach((p, idx) => {
        badmintonList.innerHTML += `
            <div class="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                <div>
                    <p class="font-bold text-gray-800">#${idx+1} ${p.name}</p>
                    <p class="text-xs text-gray-500">${p.matches} Matches</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-green-600">${p.wins} Wins</p>
                    ${p.looking ? '<span class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Looking for Opponent</span>' : ''}
                </div>
            </div>
        `;
    });
}

// --- PAGE NAVIGATION ---
function showPage(pageId) {
    if (['profile', 'pets', 'payments', 'chat', 'sports'].includes(pageId) && !appState.userId) {
        showToast("Please log in to access this section.");
        toggleModal('modal-login');
        return;
    }

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const pageEl = document.getElementById(`page-${pageId}`);
    if (pageEl) {
        pageEl.classList.add('active');
    } else {
        document.getElementById('page-home').classList.add('active'); 
        pageId = 'home'; 
    }

    navItems.forEach(item => item.classList.remove('active'));
    
    if(pageId === 'home') navItems[0].classList.add('active');
    if(pageId === 'events') navItems[1].classList.add('active');
    if(pageId === 'chat') navItems[2].classList.add('active');
    if(pageId === 'payments') navItems[3].classList.add('active');
    if(pageId === 'profile') navItems[4].classList.add('active');
    
    appState.currentPage = pageId;
    lucide.createIcons(); 
}
