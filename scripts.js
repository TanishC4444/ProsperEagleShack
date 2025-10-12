// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const navToggle = document.querySelector('.nav-toggle');
const backToTopButton = document.querySelector('.back-to-top');
const announcementsContainer = document.getElementById('announcements-container');
const opportunitiesContainer = document.getElementById('opportunities-container');

// Firebase database reference (initialized in HTML)
const database = firebase.database();

// Data arrays (populated from Firebase)
let announcements = [];
let opportunities = [];

// Analytics tracking object
const analytics = {
    pageViews: 0,
    interactions: {
        announcementsViewed: 0,
        opportunitiesViewed: 0,
        navigationClicks: 0,
        faqAccordionClicks: 0
    },
    sessionStart: new Date(),
    userId: generateUserId() // Generate unique session ID
};

/**
 * generateUserId
 * Purpose: Generate a unique session identifier
 * Input: None
 * Output: return: Unique session ID string
 */
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * trackAnalytic
 * Purpose: Log analytics event to Firebase in real-time
 * Input: eventType (string), eventData (object)
 * Output: return: None, environment changes: Updates Firebase analytics database
 */
function trackAnalytic(eventType, eventData = {}) {
    const timestamp = new Date().toISOString();
    const analyticsRef = database.ref('analytics');
    
    const event = {
        eventType,
        userId: analytics.userId,
        timestamp,
        sessionStart: analytics.sessionStart.toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...eventData
    };
    
    // Push to analytics collection (creates new entry)
    analyticsRef.push(event)
        .catch(error => console.error('Analytics tracking error:', error));
}

/**
 * trackPageView
 * Purpose: Track initial page load
 * Input: None
 * Output: return: None, environment changes: Increments page view count and logs to Firebase
 */
function trackPageView() {
    analytics.pageViews++;
    trackAnalytic('page_view', {
        pageTitle: document.title,
        referrer: document.referrer
    });
}

/**
 * trackInteraction
 * Purpose: Track user interactions with specific elements
 * Input: interactionType (string), elementName (string), additionalData (object)
 * Output: return: None, environment changes: Updates interaction counter and logs to Firebase
 */
function trackInteraction(interactionType, elementName, additionalData = {}) {
    analytics.interactions[interactionType] = (analytics.interactions[interactionType] || 0) + 1;
    trackAnalytic('interaction', {
        interactionType,
        elementName,
        ...additionalData
    });
}

/**
 * trackEngagement
 * Purpose: Track time spent on page and sections viewed
 * Input: sectionName (string), duration (number in milliseconds)
 * Output: return: None, environment changes: Logs engagement data to Firebase
 */
function trackEngagement(sectionName, duration) {
    trackAnalytic('engagement', {
        section: sectionName,
        durationMs: duration,
        scrollDepth: calculateScrollDepth()
    });
}

/**
 * calculateScrollDepth
 * Purpose: Calculate how far down the page the user has scrolled
 * Input: None
 * Output: return: Scroll depth as percentage (number 0-100)
 */
function calculateScrollDepth() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return height > 0 ? Math.round((winScroll / height) * 100) : 0;
}

/**
 * trackConversion
 * Purpose: Track important user actions (e.g., signup, opportunity registration)
 * Input: conversionType (string), value (number), details (object)
 * Output: return: None, environment changes: Logs conversion to Firebase
 */
function trackConversion(conversionType, value = 1, details = {}) {
    trackAnalytic('conversion', {
        conversionType,
        value,
        ...details
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    trackPageView();
    initNavigation();
    initScrollEvents();
    initAnalyticsTracking();
    
    // Load from Firebase with real-time updates
    database.ref('announcements').on('value', (snapshot) => {
        const data = snapshot.val();
        announcements = data ? Object.values(data) : [];
        loadAnnouncements();
        trackInteraction('announcementsViewed', 'announcements-container', {
            count: announcements.length
        });
    });
    
    database.ref('opportunities').on('value', (snapshot) => {
        const data = snapshot.val();
        opportunities = data ? Object.values(data) : [];
        loadOpportunities();
        trackInteraction('opportunitiesViewed', 'opportunities-container', {
            count: opportunities.length
        });
    });
});

/**
 * initAnalyticsTracking
 * Purpose: Initialize all analytics event listeners
 * Input: None
 * Output: return: None, environment changes: Sets up analytics event listeners
 */
function initAnalyticsTracking() {
    // Track navigation clicks
    const navLinks = document.querySelectorAll('nav a, .nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            trackInteraction('navigationClicks', 'nav_link', {
                linkText: link.textContent,
                href: link.getAttribute('href')
            });
        });
    });
    
    // Track opportunity card clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('.opportunity-card')) {
            const card = e.target.closest('.opportunity-card');
            trackInteraction('opportunityClicked', 'opportunity_card', {
                opportunityTitle: card.querySelector('.opportunity-title')?.textContent,
                opportunityType: card.dataset.type
            });
        }
        if (e.target.closest('.announcement-card')) {
            const card = e.target.closest('.announcement-card');
            trackInteraction('announcementClicked', 'announcement_card', {
                announcementTitle: card.querySelector('.announcement-title')?.textContent
            });
        }
    });
    
    // Track time spent on page
    setInterval(() => {
        trackEngagement('current_session', 60000); // Track every minute
    }, 60000);
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            trackAnalytic('session_end', {
                totalInteractions: Object.values(analytics.interactions).reduce((a, b) => a + b, 0),
                scrollDepth: calculateScrollDepth()
            });
        } else {
            trackAnalytic('session_resume');
        }
    });
}

/**
 * initNavigation
 * Purpose: Initialize navigation functionality including mobile menu toggle and smooth scrolling
 * Input: None
 * Output: return: None, environment changes: Sets up event listeners for navigation elements
 * Error handling: Returns early if nav elements don't exist
 */
// Navigation functions
function initNavigation() {
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        trackInteraction('navigationClicks', 'mobile_menu_toggle', {
            menuState: navMenu.classList.contains('active') ? 'opened' : 'closed'
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.getAttribute('href') === '#') return;
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                trackInteraction('navigationClicks', 'anchor_link', {
                    targetId: targetId,
                    targetName: targetElement.textContent?.substring(0, 50)
                });
                
                // Close mobile menu when clicking a link
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

/**
 * initScrollEvents
 * Purpose: Initialize scroll-related events like back-to-top button visibility
 * Input: None
 * Output: return: None, environment changes: Sets up scroll event listeners
 * Error handling: Returns early if back-to-top button doesn't exist
 */
// Scroll events
function initScrollEvents() {
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        // Back to top button visibility
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Back to top button click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        trackInteraction('navigationClicks', 'back_to_top_button');
    });
}

/**
 * loadAnnouncements
 * Purpose: Load and display announcements in the UI
 * Input: None
 * Output: return: None, environment changes: Populates the announcementsContainer with announcement cards
 * Error handling: Returns early if container doesn't exist, shows placeholder if no announcements
 */
// Load announcements
function loadAnnouncements() {
    if (!announcementsContainer) return;
    
    announcementsContainer.innerHTML = '';
    
    // Filter out announcements older than 2 weeks
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const recentAnnouncements = announcements.filter(announcement => {
        const announcementDate = new Date(announcement.date);
        return announcementDate >= twoWeeksAgo;
    });
    
    if (recentAnnouncements.length === 0) {
        announcementsContainer.innerHTML = `
            <div class="announcement-placeholder">
                <p>No announcements at this time.</p>
            </div>
        `;
        return;
    }
    
    // Sort announcements by date (newest first) and priority
    const sortedAnnouncements = [...recentAnnouncements].sort((a, b) => {
        // First sort by priority (urgent > important > normal)
        const priorityOrder = { urgent: 0, important: 1, normal: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        // Then by date (newest first)
        return new Date(b.date) - new Date(a.date);
    });
    
    // Display the announcements
    sortedAnnouncements.forEach(announcement => {
        const formattedDate = formatDate(announcement.date);
        
        const announcementCard = document.createElement('div');
        announcementCard.className = 'announcement-card';
        
        announcementCard.innerHTML = `
            <div class="announcement-header">
                <h3 class="announcement-title">${announcement.title}</h3>
                <span class="announcement-date">${formattedDate}</span>
            </div>
            <p class="announcement-content">${announcement.content}</p>
            <span class="announcement-badge ${announcement.priority}">${announcement.priority}</span>
        `;
        
        announcementsContainer.appendChild(announcementCard);
    });
}

/**
 * loadOpportunities
 * Purpose: Load and display volunteer opportunities in the UI
 * Input: None
 * Output: return: None, environment changes: Populates the opportunitiesContainer with opportunity cards
 * Error handling: Returns early if container doesn't exist, shows placeholder if no opportunities
 */
// Load volunteer opportunities
function loadOpportunities() {
    if (!opportunitiesContainer) return;
    
    opportunitiesContainer.innerHTML = '';
    
    if (opportunities.length === 0) {
        opportunitiesContainer.innerHTML = `
            <div class="opportunity-placeholder">
                <p>No volunteer opportunities at this time.</p>
            </div>
        `;
        return;
    }
    
    // Sort opportunities by date (upcoming first)
    const sortedOpportunities = [...opportunities].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    
    // Display the opportunities
    sortedOpportunities.forEach(opportunity => {
        const formattedDate = formatDate(opportunity.date);
        
        const opportunityCard = document.createElement('div');
        opportunityCard.className = 'opportunity-card';
        opportunityCard.dataset.type = opportunity.type;
        
        opportunityCard.innerHTML = `
            <div class="opportunity-header">
                <h3 class="opportunity-title">${opportunity.title}</h3>
                <span class="opportunity-type ${opportunity.type}">${opportunity.type}</span>
            </div>
            <div class="opportunity-details">
                <p class="opportunity-description">${opportunity.description}</p>
                <div class="opportunity-meta">
                    <div class="opportunity-meta-item">
                        <i class="far fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="opportunity-meta-item">
                        <i class="far fa-clock"></i>
                        <span>${opportunity.time || 'TBD'}</span>
                    </div>
                    <div class="opportunity-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${opportunity.location}</span>
                    </div>
                    <div class="opportunity-meta-item">
                        <i class="fas fa-users"></i>
                        <span>${opportunity.slots} slots available</span>
                    </div>
                    <div class="opportunity-meta-item">
                        <i class="fas fa-user"></i>
                        <span>Contact: ${opportunity.contact}</span>
                    </div>
                </div>
            </div>
        `;
        
        opportunitiesContainer.appendChild(opportunityCard);
    });
}

/**
 * formatDate
 * Purpose: Format a date string into a readable format
 * Input: dateString (string)
 * Output: return: Formatted date string, environment changes: None
 * Error handling: None
 */
// Helper function for formatting dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Toggle active class on clicked item
                item.classList.toggle('active');
                
                // Track FAQ accordion interaction
                trackInteraction('faqAccordionClicks', 'faq_question', {
                    questionText: question.textContent?.substring(0, 50),
                    opened: item.classList.contains('active')
                });
                
                // Close other items when one is opened (optional)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });
});

/**
 * getOpportunitiesByType
 * Purpose: Filter opportunities by their type category
 * Input: type (string)
 * Output: return: Array of filtered opportunities, environment changes: None
 * Error handling: None
 */
// Example: Filter opportunities by type
function getOpportunitiesByType(type) {
    return opportunities.filter(opp => opp.type === type);
}

/**
 * getTotalAvailableSlots
 * Purpose: Calculate the total number of available slots across all opportunities
 * Input: None
 * Output: return: Total number of slots (number), environment changes: None
 * Error handling: None
 */
// Example: Get total available slots across all opportunities
function getTotalAvailableSlots() {
    return opportunities.reduce((total, opp) => total + opp.slots, 0);
}

/**
 * getAnnouncementsByPriority
 * Purpose: Group announcements by their priority level
 * Input: None
 * Output: return: Object with priorities as keys and arrays of announcements as values, environment changes: None
 * Error handling: None
 */
// Example: Group announcements by priority
function getAnnouncementsByPriority() {
    return announcements.reduce((groups, announcement) => {
        const priority = announcement.priority;
        if (!groups[priority]) {
            groups[priority] = [];
        }
        groups[priority].push(announcement);
        return groups;
    }, {});
}