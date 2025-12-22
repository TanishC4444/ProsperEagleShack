# Eagle Shack

## Overview

Eagle Shack is the official school store platform for Prosper High School, providing students with convenient access to snacks, beverages, school merchandise, and event concessions at competitive prices. The platform offers both physical store operations and digital service management.

## Project Information

**Repository:** https://github.com/TanishC4444/ProsperEagleShack  
**Live Site:** https://tanishc4444.github.io/ProsperEagleShack/  
**Institution:** Prosper High School

## Core Features

### Student Services

The platform provides comprehensive access to store offerings through a clean, navigable interface. Students can view real-time pricing, browse available merchandise, and stay informed about store operations through the announcements system.

### Product Categories

The store maintains inventory across multiple categories, including snacks and pastries, chips and salty snacks, chocolate bars, gummy and sour candy, beverages, and school spirit wear. All items are priced competitively to remain accessible to the student body.

### Administrative Dashboard

Administrative personnel can access a secure dashboard to manage store operations, including inventory control, pricing updates, announcement management, and volunteer coordination. The admin interface requires authentication to ensure operational security.

### Volunteer Management

The platform includes a dedicated volunteer portal where students can register their interest in supporting store operations. The system facilitates scheduling and coordination of volunteer activities.

## Technical Architecture

### Frontend Components

The application is built using HTML5, CSS3, and vanilla JavaScript, ensuring broad compatibility and optimal performance across devices. The interface is responsive and designed to function effectively on both desktop and mobile platforms.

### Backend Infrastructure

Eagle Shack leverages Firebase as its backend-as-a-service solution, providing comprehensive data management and authentication capabilities without requiring dedicated server infrastructure.

#### Firebase Realtime Database

The platform utilizes Firebase Realtime Database as its primary data store. This NoSQL cloud database stores and synchronizes data in real time across all connected clients. The database structure is organized hierarchically to support efficient data retrieval and updates.

The database schema includes collections for product inventory, pricing information, announcement posts, volunteer registrations, and administrative user profiles. Data is structured in JSON format, enabling flexible querying and efficient data synchronization. Real-time listeners are implemented throughout the application to ensure that changes to inventory, pricing, or announcements are immediately reflected across all active user sessions.

The Realtime Database provides automatic data persistence and offline capabilities, allowing the application to function effectively even during temporary network interruptions. Security rules are configured at the database level to enforce read and write permissions based on authentication status and user roles.

#### Firebase Authentication

The authentication system is implemented using Firebase Authentication, which provides secure user identity management for administrative access. The platform supports email and password authentication, though the architecture is extensible to additional authentication providers if required.

Administrative users authenticate through the login interface, which communicates with Firebase Authentication services via the auth.js module. Upon successful authentication, Firebase generates a secure authentication token that is used to verify user identity for all subsequent operations. This token is automatically managed by the Firebase SDK and is included in all database requests to enforce security rules.

The authentication system implements session management, maintaining user login state across page refreshes and browser sessions until explicit logout. Password reset functionality is available through Firebase's built-in email recovery system, ensuring administrators can securely regain access if credentials are lost.

Role-based access control is implemented by storing user role information in the Realtime Database, associated with each authenticated user's unique identifier. The admin.js module verifies these roles before granting access to privileged operations such as inventory management, pricing updates, and announcement posting.

#### Data Security and Privacy

Firebase security rules are configured to restrict database access based on authentication status. Public-facing data such as product listings, pricing, and announcements are readable by all users, while write operations and sensitive administrative data require authenticated access with appropriate permissions. The security rules are defined in Firebase's declarative security language and are enforced server-side, preventing unauthorized access regardless of client-side manipulation attempts.

All communication between the application and Firebase services occurs over HTTPS, ensuring data encryption in transit. Firebase Authentication credentials are never stored client-side in plain text, and password hashing is handled automatically by Firebase's authentication infrastructure.

### File Structure

The repository contains the following primary components:

- **index.html**: Main landing page and store information
- **services.html**: Detailed service offerings and descriptions
- **volunteer.html**: Volunteer registration and information portal
- **login.html**: Administrative authentication interface
- **admin.html / admindashboard.html**: Administrative control panels
- **styles.css**: Comprehensive styling and responsive design rules
- **scripts.js**: Core JavaScript functionality and Firebase SDK initialization
- **auth.js**: Authentication and authorization logic with Firebase Authentication integration
- **admin.js**: Administrative dashboard functionality with Firebase Realtime Database operations

## Announcements System

The platform maintains a dynamic announcements system that keeps the school community informed about important updates, including summer internship opportunities, new merchandise arrivals, and extended operating hours during exam periods.

## Pricing Structure

Eagle Shack maintains transparent and competitive pricing across all product categories. Current pricing ranges from $0.50 for individual items such as Rice Krispie Treats to $30.00 for premium spirit wear items like hoodies. Complete pricing information is available on the main platform.

## Development and Deployment

The application is deployed via GitHub Pages, providing reliable hosting and continuous deployment capabilities. Updates to the main branch are automatically reflected on the live site.

## Security Considerations

Administrative functions are protected by authentication mechanisms implemented in the auth.js module. Access to inventory management, pricing controls, and announcement posting is restricted to authorized personnel only.

## Future Development

The platform is designed to support ongoing enhancement, including potential integration of online ordering capabilities, expanded payment processing, and enhanced reporting for administrative oversight.

## Contact and Support

For operational inquiries, technical support, or partnership opportunities, interested parties should contact Prosper High School administration through official channels.

## License

This project is maintained as an internal school resource. Use and distribution are subject to Prosper High School policies and guidelines.

---

**Maintained by:** TanishC4444  
**Last Updated:** December 2024
