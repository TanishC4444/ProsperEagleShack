// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const navToggle = document.querySelector('.nav-toggle');
const backToTopButton = document.querySelector('.back-to-top');
const announcementsContainer = document.getElementById('announcements-container');
const opportunitiesContainer = document.getElementById('opportunities-container');

// Sample data for announcements (would normally come from a database)
const announcements = JSON.parse(localStorage.getItem('eagleShackAnnouncements')) || [
    {
        id: 1,
        title: "Spring Sale",
        content: "Visit Eagle Shack for our Spring Sale starting next Monday! Get 15% off on all Prosper merchandise, including hoodies, shirts, and caps.",
        date: "2025-04-28",
        priority: "normal"
    },
    {
        id: 2,
        title: "Student Volunteers Needed",
        content: "We're looking for student volunteers to help with the upcoming basketball tournament concessions. Great opportunity to earn service hours!",
        date: "2025-05-01",
        priority: "important"
    },
    {
        id: 3,
        title: "New Products Alert",
        content: "We've just added new snacks to our inventory! Come try our new selection of protein bars, trail mix, and healthier snack alternatives.",
        date: "2025-04-25",
        priority: "normal"
    },
    {
        id: 4,
        title: "Price Change Notice",
        content: "Due to supplier changes, some prices will be adjusted starting May 15. Most items will remain at the same price, but a few may increase by 25¢.",
        date: "2025-04-30",
        priority: "urgent"
    }
];

// Sample data for opportunities (loaded from localStorage)
const opportunities = JSON.parse(localStorage.getItem('eagleShackOpportunities')) || [
    {
        id: 1,
        title: "Concession Stand Volunteers",
        type: "volunteer",
        description: "Help run the Eagle Shack concession stand during the varsity football game against Allen High School. Tasks include selling snacks, drinks, and merchandise.",
        date: "2025-05-15",
        time: "18:00",
        location: "PHS Stadium",
        slots: 8,
        contact: "Coach Thompson"
    },
    {
        id: 2,
        title: "Marketing Internship",
        type: "internship",
        description: "Gain real business experience by helping manage Eagle Shack's social media accounts, creating promotional materials, and planning marketing campaigns.",
        date: "2025-05-01",
        time: "15:30",
        location: "Eagle Shack Store",
        slots: 2,
        contact: "Mr. Foster"
    },
    {
        id: 3,
        title: "Inventory Management Help",
        type: "volunteer",
        description: "Assist with receiving shipments, organizing stock, and conducting inventory counts. Perfect for students interested in business operations.",
        date: "2025-05-05",
        time: "16:00",
        location: "Eagle Shack Store",
        slots: 4,
        contact: "Ms. Rodriguez"
    },
    {
        id: 4,
        title: "Graduation Ceremony Sales",
        type: "event",
        description: "Sell graduation-themed merchandise and refreshments before and after the senior graduation ceremony. This is one of our biggest events of the year!",
        date: "2025-05-25",
        time: "17:00",
        location: "Prosper Event Center",
        slots: 12,
        contact: "Mr. Foster"
    }
];

window.addEventListener('storage', function(e) {
    if (e.key === 'eagleShackAnnouncements') {
        loadAnnouncements();
    }
    if (e.key === 'eagleShackOpportunities') {
        loadOpportunities();
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEvents();
    loadAnnouncements();
    loadOpportunities();
});

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
        
        question.addEventListener('click', () => {
            // Toggle active class on clicked item
            item.classList.toggle('active');
            
            // Close other items when one is opened (optional)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
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