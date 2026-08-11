# Eagle Shack

A school-store web platform for Prosper High School that presents products, announcements, volunteer information, and authenticated administrative tools.

## Overview

Eagle Shack provides students with a central place to browse store offerings and school merchandise. Firebase supplies authentication and real-time data services for administrative workflows.

## Features

- Product and pricing catalog
- Store announcements
- Volunteer registration
- Firebase Authentication for administrators
- Firebase Realtime Database integration
- Administrative inventory and announcement management
- Responsive HTML, CSS, and JavaScript interface

## Prerequisites

- A modern web browser
- A Firebase project configured for the application
- Firebase configuration/secrets supplied through the deployment environment

## Installation

```bash
git clone https://github.com/TanishC4444/ProsperEagleShack.git
cd ProsperEagleShack
```

Configure the Firebase client settings required by `scripts.js` and `auth.js`, then serve the project with your preferred static web server.

## Quick Start

Open `index.html` through a local/static web server. Do not open Firebase-dependent pages directly from `file://` when browser security restrictions prevent required requests.

## Project Structure

```text
ProsperEagleShack/
├── index.html
├── services.html
├── volunteer.html
├── login.html
├── admin.html
├── admindashboard.html
├── styles.css
├── scripts.js
├── auth.js
└── admin.js
```

## Configuration

Keep Firebase credentials and privileged configuration out of source control. Enforce authorization with Firebase Security Rules rather than relying on client-side checks alone.

## Status

Maintained school project.

## License

Use and distribution are subject to the project's school policies; no separate open-source license is specified.

## Contact

For operational questions, contact Prosper High School administration. Use GitHub Issues for technical project feedback.
