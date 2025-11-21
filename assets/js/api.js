// --- APPLICATION STATE & API SIMULATION ---

const appState = {
    isAdmin: false,
    userId: null, // Track logged in user ID
    userName: 'Guest', // Display name
    userPhone: null, // User's phone number
    userUnit: null, // User's unit number
    currentPage: 'home',
    rsvpEventId: null,
    pendingPayment: null, // To track payment in modal
    commentingPetId: null, // Track pet for commenting
    offeringPetsitPetId: null, // Track pet for pet-sit offer
    
    // Simulated User Database (Phone is the primary key)
    registeredUsers: [
        { id: 'admin-001', name: 'Admin User', phone: '0000000000', unit: 'M-001', role: 'admin' },
        { id: 'user-123', name: 'Priya S.', phone: '9876543210', unit: 'A-101', role: 'resident' },
        { id: 'user-B402', name: 'Rohan K.', phone: '9000012345', unit: 'B-402', role: 'resident' },
    ],

    // Sports Data (Simulated)
    sportsProfiles: [
        { id: 1, userId: 'user-123', sport: 'cricket', name: 'Priya S.', role: 'Batsman', matches: 10, runs: 350, wickets: 2, bestScore: 85, bestBowling: '1/20', lastMatch: '2023-10-15' },
        { id: 2, userId: 'user-B402', sport: 'badminton', name: 'Rohan K.', matches: 25, wins: 18, losses: 7, looking: true, lastMatch: '2023-11-01' }
    ],

    events: [
        { id: 1, title: 'Morning Yoga', date: '2025-11-20', location: 'Yoga Deck', desc: 'Start your day with rejuvenating yoga.', approved: true, rsvps: 12 },
        { id: 2, title: 'Community Mixer', date: '2025-12-05', location: 'Clubhouse', desc: 'Get to know your neighbors.', approved: true, rsvps: 25 },
        { id: 3, title: 'Book Club', date: '2025-11-28', location: 'Library', desc: 'Discussing "The Alchemist".', approved: true, rsvps: 8 },
    ],
    forumPosts: [
        { id: 1, user: 'Admin', text: 'Welcome to the new community app! Use the forum to connect.' },
        { id: 2, user: 'Priya S.', text: 'Does anyone know a good plumber in the area?' },
        { id: 3, user: 'Rohan K.', text: 'Found a set of keys near the elevator in Block C.' },
    ],
    galleryImages: [
        { id: 1, url: 'https://placehold.co/300x300/e0e7ff/4f46e5?text=Yoga+Class', alt: 'Yoga Event' },
        { id: 2, url: 'https://placehold.co/300x300/fef2f2/ef4444?text=Community+Mixer', alt: 'Community Mixer' },
        { id: 3, url: 'https://placehold.co/300x300/ecfdf5/059669?text=Pool+Party', alt: 'Pool Area' },
        { id: 4, url: 'https://placehold.co/300x300/f3e8ff/9333ea?text=Garden+Day', alt: 'Community Garden' },
        { id: 5, url: 'https://placehold.co/300x300/fff7ed/f97316?text=Clubhouse+Fun', alt: 'Clubhouse' },
        { id: 6, url: 'https://placehold.co/300x300/d1fae5/065f46?text=Building+View', alt: 'Community' },
    ],
    petProfiles: [
        { id: 1, name: 'Buddy', breed: 'Golden Retriever', owner: 'A-101', ownerId: 'user-123', img: 'https://placehold.co/200x200/fef3c7/b45309?text=Buddy', comments: [{user: 'Priya S.', text: 'So cute!'}], phone: '9876543210' },
        { id: 2, name: 'Cleo', breed: 'Siamese Cat', owner: 'B-402', ownerId: 'user-B402', img: 'https://placehold.co/200x200/d1d5db/4b5563?text=Cleo', comments: [], phone: '9000000000' },
    ],
    petCareRequests: [
        { id: 1, user: 'Rohan K.', dates: 'Nov 25-28', desc: 'Need someone to feed my cat Cleo twice a day.', phone: '9000012345' }
    ],
    subscriptions: [
        { id: 'maint', title: 'Monthly Maintenance', desc: 'Covers all common area upkeep.', amount: 2500, isSubscribed: false },
        { id: 'rent', title: 'Rent (Block A-101)', desc: 'Due on the 1st of each month.', amount: 20000, isSubscribed: false },
        { id: 'yoga', title: 'Yoga Class Pass', desc: 'Access to all morning yoga sessions.', amount: 500, isSubscribed: false },
        { id: 'gym', title: 'Gym Membership', desc: '24/7 access to the community gym.', amount: 300, isSubscribed: true },
    ],
    chatMessages: [
        { id: 1, user: 'Admin User', unit: 'M-001', text: 'Welcome to the community chat! Feel free to ask questions here.', timestamp: Date.now() - 3600000 },
        { id: 2, user: 'Priya S.', unit: 'A-101', text: 'Hi Admin, I have a question about the parking policy.', timestamp: Date.now() - 1800000 },
    ],
};

// --- CONSTANTS ---
const UPI_VPA = 'communityhub@okicici';
