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

// Firebase database reference (initialized in HTML)
const database = firebase.database();

// Data arrays (populated from Firebase)
let announcements = [];
let opportunities = [];

// Initialize the admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    initAdminDashboard();
    loadAdminInfo();
    initLogout();
    
    // Load from Firebase with real-time updates
    database.ref('announcements').on('value', (snapshot) => {
        const data = snapshot.val();
        announcements = data ? Object.values(data) : [];
        loadAnnouncements();
    });
    
    database.ref('opportunities').on('value', (snapshot) => {
        const data = snapshot.val();
        opportunities = data ? Object.values(data) : [];
        loadOpportunities();
    });
});

/**
 * initAdminDashboard
 * Purpose: Initialize the admin dashboard with tab switching and form event handlers
 * Input: N/A
 * Output: return: None, environment changes: Sets up event listeners for tab buttons and form controls
 * Error handling: N/A
 */
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

/**
 * loadAdminInfo
 * Purpose: Load admin information from local/session storage and display username
 * Input: N/A
 * Output: return: None, environment changes: Updates adminName text content
 * Error handling: Default to 'Administrator' if no auth data exists
 */
// Load admin information
function loadAdminInfo() {
    const authData = JSON.parse(localStorage.getItem('eagleShackAuth') || sessionStorage.getItem('eagleShackAuth') || '{"username": "Administrator"}');
    
    if (adminName) {
        adminName.textContent = authData.username || 'Administrator';
    }
}

/**
 * initLogout
 * Purpose: Initialize logout functionality
 * Input: N/A
 * Output: return: None, environment changes: Sets up click event for logout button
 * Error handling: N/A
 */
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

/**
 * loadAnnouncements
 * Purpose: Load and display announcements in the admin interface
 * Input: N/A
 * Output: return: None, environment changes: Populates the announcementsList with announcement items
 * Error handling: Returns early if list element doesn't exist, shows message if no announcements
 */
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

/**
 * showAnnouncementForm
 * Purpose: Display the announcement form in add or edit mode
 * Input: mode (string), announcementData (object, optional)
 * Output: return: None, environment changes: Updates form title and fields, displays the form
 * Error handling: Returns early if form elements don't exist
 */
// Show the announcement form (add or edit mode)
function showAnnouncementForm(mode, announcementData = null) {
    if (!announcementForm || !announcementFormTitle) return;
    
    // Set form title based on mode
    announcementFormTitle.textContent = mode === 'add' ? 'Add New Announcement' : 'Edit Announcement';
    
    if (announcementEditor) {
        announcementEditor.reset();
    }
    
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

/**
 * hideAnnouncementForm
 * Purpose: Hide the announcement form
 * Input: N/A
 * Output: return: None, environment changes: Sets form display to 'none'
 * Error handling: Returns early if form element doesn't exist
 */
// Hide the announcement form
function hideAnnouncementForm() {
    if (!announcementForm) return;
    announcementForm.style.display = 'none';
}

/**
 * editAnnouncement
 * Purpose: Prepare the form for editing an existing announcement
 * Input: id (number)
 * Output: return: None, environment changes: Calls showAnnouncementForm with edit mode
 * Error handling: Only proceeds if announcement with given id exists
 */
// Edit an announcement
function editAnnouncement(id) {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
        showAnnouncementForm('edit', announcement);
    }
}

/**
 * deleteAnnouncement
 * Purpose: Delete an announcement after confirmation
 * Input: id (number)
 * Output: return: None, environment changes: Removes announcement from Firebase
 * Error handling: Confirms deletion with user before proceeding
 */
// Delete an announcement
function deleteAnnouncement(id) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        database.ref('announcements/' + id).remove()
            .then(() => {
                console.log('Announcement deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting announcement:', error);
                alert('Failed to delete announcement. Please try again.');
            });
    }
}

/**
 * handleAnnouncementSubmit
 * Purpose: Process announcement form submission for create or update
 * Input: e (event object)
 * Output: return: None, environment changes: Updates Firebase with announcement data
 * Error handling: Validates required fields, prevents default form submission
 */
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
        database.ref('announcements/' + id).set({
            id,
            title,
            content,
            date,
            priority
        })
        .then(() => {
            console.log('Announcement updated successfully');
            hideAnnouncementForm();
        })
        .catch((error) => {
            console.error('Error updating announcement:', error);
            alert('Failed to update announcement. Please try again.');
        });
    } else {
        // Create new announcement
        const newId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1;
        database.ref('announcements/' + newId).set({
            id: newId,
            title,
            content,
            date,
            priority
        })
        .then(() => {
            console.log('Announcement created successfully');
            hideAnnouncementForm();
        })
        .catch((error) => {
            console.error('Error creating announcement:', error);
            alert('Failed to create announcement. Please try again.');
        });
    }
}

// =========== OPPORTUNITIES MANAGEMENT ===========

/**
 * loadOpportunities
 * Purpose: Load and display volunteer opportunities in the admin interface
 * Input: N/A
 * Output: return: None, environment changes: Populates the opportunitiesList with opportunity items
 * Error handling: Returns early if list element doesn't exist, shows message if no opportunities
 */
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

/**
 * showOpportunityForm
 * Purpose: Display the opportunity form in add or edit mode
 * Input: mode (string), opportunityData (object, optional)
 * Output: return: None, environment changes: Updates form title and fields, displays the form
 * Error handling: Returns early if form elements don't exist
 */
// Show the opportunity form (add or edit mode)
function showOpportunityForm(mode, opportunityData = null) {
    if (!opportunityForm || !opportunityFormTitle) return;
    
    // Set form title based on mode
    opportunityFormTitle.textContent = mode === 'add' ? 'Add New Volunteer Opportunity' : 'Edit Volunteer Opportunity';
    
    if (opportunityEditor) {
        opportunityEditor.reset();
    }
    
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

/**
 * hideOpportunityForm
 * Purpose: Hide the opportunity form
 * Input: None
 * Output: return: None, environment changes: Sets form display to 'none'
 * Error handling: Returns early if form element doesn't exist
 */
// Hide the opportunity form
function hideOpportunityForm() {
    if (!opportunityForm) return;
    opportunityForm.style.display = 'none';
}

/**
 * editOpportunity
 * Purpose: Prepare the form for editing an existing opportunity
 * Input: id (number)
 * Output: return: None, environment changes: Calls showOpportunityForm with edit mode
 * Error handling: Only proceeds if opportunity with given id exists
 */
// Edit an opportunity
function editOpportunity(id) {
    const opportunity = opportunities.find(o => o.id === id);
    if (opportunity) {
        showOpportunityForm('edit', opportunity);
    }
}

/**
 * deleteOpportunity
 * Purpose: Delete an opportunity after confirmation
 * Input: id (number)
 * Output: return: None, environment changes: Removes opportunity from Firebase
 * Error handling: Confirms deletion with user before proceeding
 */
// Delete an opportunity
function deleteOpportunity(id) {
    if (confirm('Are you sure you want to delete this volunteer opportunity?')) {
        database.ref('opportunities/' + id).remove()
            .then(() => {
                console.log('Opportunity deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting opportunity:', error);
                alert('Failed to delete opportunity. Please try again.');
            });
    }
}

/**
 * handleOpportunitySubmit
 * Purpose: Process opportunity form submission for create or update
 * Input: e (event object)
 * Output: return: None, environment changes: Updates Firebase with opportunity data
 * Error handling: Validates required fields, prevents default form submission
 */
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
        database.ref('opportunities/' + id).set({
            id,
            title,
            type,
            description,
            date,
            time,
            location,
            slots,
            contact
        })
        .then(() => {
            console.log('Opportunity updated successfully');
            hideOpportunityForm();
        })
        .catch((error) => {
            console.error('Error updating opportunity:', error);
            alert('Failed to update opportunity. Please try again.');
        });
    } else {
        // Create new opportunity
        const newId = opportunities.length > 0 ? Math.max(...opportunities.map(o => o.id)) + 1 : 1;
        database.ref('opportunities/' + newId).set({
            id: newId,
            title,
            type,
            description,
            date,
            time,
            location,
            slots,
            contact
        })
        .then(() => {
            console.log('Opportunity created successfully');
            hideOpportunityForm();
        })
        .catch((error) => {
            console.error('Error creating opportunity:', error);
            alert('Failed to create opportunity. Please try again.');
        });
    }
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