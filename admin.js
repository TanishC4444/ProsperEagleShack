// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const adminName = document.getElementById('admin-name');
const logoutBtn = document.getElementById('logout-btn');

// Announcement form elements
const announcementsList = document.getElementById('admin-announcements-list');
const addAnnouncementBtn = document.getElementById('add-announcement-btn');
const announcementForm = document.getElementById('announcement-form');
const announcementEditor = document.getElementById('announcement-editor');
const cancelAnnouncementBtn = document.getElementById('cancel-announcement-btn');
const announcementFormTitle = document.getElementById('announcement-form-title');

// Volunteer opportunity form elements
const opportunitiesList = document.getElementById('admin-opportunities-list');
const addOpportunityBtn = document.getElementById('add-opportunity-btn');
const opportunityForm = document.getElementById('opportunity-form');
const opportunityEditor = document.getElementById('opportunity-editor');
const cancelOpportunityBtn = document.getElementById('cancel-opportunity-btn');
const opportunityFormTitle = document.getElementById('opportunity-form-title');

// Sample data (in a real app, this would be stored in a database)
let announcements = JSON.parse(localStorage.getItem('eagleShackAnnouncements')) || [
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

let opportunities = JSON.parse(localStorage.getItem('eagleShackOpportunities')) || [
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

// Initialize the admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    initAdminDashboard();
    loadAdminInfo();
    loadAnnouncements();
    loadOpportunities();
    initLogout();
});

// Initialize admin dashboard functionality
function initAdminDashboard() {
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tab}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Announcement form events
    if (addAnnouncementBtn) {
        addAnnouncementBtn.addEventListener('click', () => {
            showAnnouncementForm('add');
        });
    }
    
    if (cancelAnnouncementBtn) {
        cancelAnnouncementBtn.addEventListener('click', () => {
            hideAnnouncementForm();
        });
    }
    
    if (announcementEditor) {
        announcementEditor.addEventListener('submit', handleAnnouncementSubmit);
    }
    
    // Opportunity form events
    if (addOpportunityBtn) {
        addOpportunityBtn.addEventListener('click', () => {
            showOpportunityForm('add');
        });
    }
    
    if (cancelOpportunityBtn) {
        cancelOpportunityBtn.addEventListener('click', () => {
            hideOpportunityForm();
        });
    }
    
    if (opportunityEditor) {
        opportunityEditor.addEventListener('submit', handleOpportunitySubmit);
    }
}

// Load admin information
function loadAdminInfo() {
    const authData = JSON.parse(localStorage.getItem('eagleShackAuth') || sessionStorage.getItem('eagleShackAuth') || '{"username": "Administrator"}');
    
    if (adminName) {
        adminName.textContent = authData.username || 'Administrator';
    }
}

// Initialize logout functionality
function initLogout() {
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear auth data
            localStorage.removeItem('eagleShackAuth');
            sessionStorage.removeItem('eagleShackAuth');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
}

// =========== ANNOUNCEMENTS MANAGEMENT ===========

// Load announcements into the admin list
function loadAnnouncements() {
    if (!announcementsList) return;
    
    announcementsList.innerHTML = '';
    
    if (announcements.length === 0) {
        announcementsList.innerHTML = `
            <div class="admin-list-message">
                <p>No announcements yet. Click "Add New" to create your first announcement.</p>
            </div>
        `;
        return;
    }
    
    // Sort announcements by date (newest first)
    const sortedAnnouncements = [...announcements].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Display the announcements
    sortedAnnouncements.forEach(announcement => {
        const formattedDate = formatDate(announcement.date);
        
        const announcementItem = document.createElement('div');
        announcementItem.className = 'admin-item';
        announcementItem.dataset.id = announcement.id;
        
        announcementItem.innerHTML = `
            <div class="admin-item-header">
                <div>
                    <h3 class="admin-item-title">${announcement.title}</h3>
                    <div class="admin-item-meta">
                        <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                        <span><i class="fas fa-flag"></i> Priority: ${announcement.priority}</span>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="item-action-btn edit-btn" data-id="${announcement.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="item-action-btn delete-btn" data-id="${announcement.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="admin-item-content">${announcement.content}</div>
        `;
        
        announcementsList.appendChild(announcementItem);
        
        // Add edit event listener
        const editBtn = announcementItem.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            const id = parseInt(editBtn.dataset.id);
            editAnnouncement(id);
        });
        
        // Add delete event listener
        const deleteBtn = announcementItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const id = parseInt(deleteBtn.dataset.id);
            deleteAnnouncement(id);
        });
    });
}

// Show the announcement form (add or edit mode)
function showAnnouncementForm(mode, announcementData = null) {
    if (!announcementForm || !announcementFormTitle) return;
    
    // Set form title based on mode
    announcementFormTitle.textContent = mode === 'add' ? 'Add New Announcement' : 'Edit Announcement';
    
    // Clear form
    announcementEditor.re
    set();
    
    // If editing, fill the form with announcement data
    if (mode === 'edit' && announcementData) {
        document.getElementById('announcement-id').value = announcementData.id;
        document.getElementById('announcement-title').value = announcementData.title;
        document.getElementById('announcement-content').value = announcementData.content;
        document.getElementById('announcement-date').value = announcementData.date;
        document.getElementById('announcement-priority').value = announcementData.priority;
    } else {
        // Set today's date as default for new announcements
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];
        document.getElementById('announcement-date').value = formattedToday;
    }
    
    // Show the form
    announcementForm.style.display = 'block';
    
    // Scroll to form
    announcementForm.scrollIntoView({ behavior: 'smooth' });
}

// Hide the announcement form
function hideAnnouncementForm() {
    if (!announcementForm) return;
    announcementForm.style.display = 'none';
}

// Edit an announcement
function editAnnouncement(id) {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
        showAnnouncementForm('edit', announcement);
    }
}

// Delete an announcement
function deleteAnnouncement(id) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        announcements = announcements.filter(a => a.id !== id);
        localStorage.setItem('eagleShackAnnouncements', JSON.stringify(announcements));
        loadAnnouncements();
    }
}

// Handle announcement form submission
function handleAnnouncementSubmit(e) {
    e.preventDefault();
    
    const announcementId = document.getElementById('announcement-id').value;
    const title = document.getElementById('announcement-title').value.trim();
    const content = document.getElementById('announcement-content').value.trim();
    const date = document.getElementById('announcement-date').value;
    const priority = document.getElementById('announcement-priority').value;
    
    // Validate inputs
    if (!title || !content || !date) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (announcementId) {
        // Update existing announcement
        const id = parseInt(announcementId);
        const index = announcements.findIndex(a => a.id === id);
        
        if (index !== -1) {
            announcements[index] = {
                id,
                title,
                content,
                date,
                priority
            };
        }
    } else {
        // Create new announcement
        const newId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1;
        
        announcements.push({
            id: newId,
            title,
            content,
            date,
            priority
        });
    }
    localStorage.setItem('eagleShackAnnouncements', JSON.stringify(announcements));

    // Hide form and refresh list
    hideAnnouncementForm();
    loadAnnouncements();
}

// =========== OPPORTUNITIES MANAGEMENT ===========

// Load opportunities into the admin list
function loadOpportunities() {
    if (!opportunitiesList) return;
    
    opportunitiesList.innerHTML = '';
    
    if (opportunities.length === 0) {
        opportunitiesList.innerHTML = `
            <div class="admin-list-message">
                <p>No volunteer opportunities yet. Click "Add New" to create your first opportunity.</p>
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
        
        const opportunityItem = document.createElement('div');
        opportunityItem.className = 'admin-item';
        opportunityItem.dataset.id = opportunity.id;
        
        opportunityItem.innerHTML = `
            <div class="admin-item-header">
                <div>
                    <h3 class="admin-item-title">${opportunity.title}</h3>
                    <div class="admin-item-meta">
                        <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                        <span><i class="far fa-clock"></i> ${opportunity.time || 'TBD'}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${opportunity.location}</span>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="item-action-btn edit-btn" data-id="${opportunity.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="item-action-btn delete-btn" data-id="${opportunity.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="admin-item-content">
                <p><strong>Type:</strong> <span class="opportunity-type ${opportunity.type}">${opportunity.type}</span></p>
                <p><strong>Description:</strong> ${opportunity.description}</p>
                <p><strong>Available Slots:</strong> ${opportunity.slots}</p>
                <p><strong>Contact:</strong> ${opportunity.contact}</p>
            </div>
        `;
        
        opportunitiesList.appendChild(opportunityItem);
        
        // Add edit event listener
        const editBtn = opportunityItem.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            const id = parseInt(editBtn.dataset.id);
            editOpportunity(id);
        });
        
        // Add delete event listener
        const deleteBtn = opportunityItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const id = parseInt(deleteBtn.dataset.id);
            deleteOpportunity(id);
        });
    });
}

// Show the opportunity form (add or edit mode)
function showOpportunityForm(mode, opportunityData = null) {
    if (!opportunityForm || !opportunityFormTitle) return;
    
    // Set form title based on mode
    opportunityFormTitle.textContent = mode === 'add' ? 'Add New Volunteer Opportunity' : 'Edit Volunteer Opportunity';
    
    // Clear form
    opportunityEditor.reset();
    
    // If editing, fill the form with opportunity data
    if (mode === 'edit' && opportunityData) {
        document.getElementById('opportunity-id').value = opportunityData.id;
        document.getElementById('opportunity-title').value = opportunityData.title;
        document.getElementById('opportunity-type').value = opportunityData.type;
        document.getElementById('opportunity-description').value = opportunityData.description;
        document.getElementById('opportunity-date').value = opportunityData.date;
        document.getElementById('opportunity-time').value = opportunityData.time || '';
        document.getElementById('opportunity-location').value = opportunityData.location;
        document.getElementById('opportunity-slots').value = opportunityData.slots;
        document.getElementById('opportunity-contact').value = opportunityData.contact;
    } else {
        // Set today's date as default for new opportunities
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];
        document.getElementById('opportunity-date').value = formattedToday;
    }
    
    // Show the form
    opportunityForm.style.display = 'block';
    
    // Scroll to form
    opportunityForm.scrollIntoView({ behavior: 'smooth' });
}

// Hide the opportunity form
function hideOpportunityForm() {
    if (!opportunityForm) return;
    opportunityForm.style.display = 'none';
}

// Edit an opportunity
function editOpportunity(id) {
    const opportunity = opportunities.find(o => o.id === id);
    if (opportunity) {
        showOpportunityForm('edit', opportunity);
    }
}

// Delete an opportunity
function deleteOpportunity(id) {
    if (confirm('Are you sure you want to delete this volunteer opportunity?')) {
        opportunities = opportunities.filter(o => o.id !== id);
        localStorage.setItem('eagleShackOpportunities', JSON.stringify(opportunities));
        loadOpportunities();
    }
}

localStorage.setItem('eagleShackOpportunities', JSON.stringify(opportunities));
    hideOpportunityForm();
    loadOpportunities();

// Handle opportunity form submission
function handleOpportunitySubmit(e) {
    e.preventDefault();
    
    const opportunityId = document.getElementById('opportunity-id').value;
    const title = document.getElementById('opportunity-title').value.trim();
    const type = document.getElementById('opportunity-type').value;
    const description = document.getElementById('opportunity-description').value.trim();
    const date = document.getElementById('opportunity-date').value;
    const time = document.getElementById('opportunity-time').value;
    const location = document.getElementById('opportunity-location').value.trim();
    const slots = parseInt(document.getElementById('opportunity-slots').value);
    const contact = document.getElementById('opportunity-contact').value.trim();
    
    // Validate inputs
    if (!title || !description || !date || !location || !contact) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (opportunityId) {
        // Update existing opportunity
        const id = parseInt(opportunityId);
        const index = opportunities.findIndex(o => o.id === id);
        
        if (index !== -1) {
            opportunities[index] = {
                id,
                title,
                type,
                description,
                date,
                time,
                location,
                slots,
                contact
            };
        }
    } else {
        // Create new opportunity
        const newId = opportunities.length > 0 ? Math.max(...opportunities.map(o => o.id)) + 1 : 1;
        
        opportunities.push({
            id: newId,
            title,
            type,
            description,
            date,
            time,
            location,
            slots,
            contact
        });
    }
    
    // Hide form and refresh list
    hideOpportunityForm();
    loadOpportunities();
}

// Helper function for formatting dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}