# Steam Accounts Shop

A modern React web application for buying and selling Steam accounts, game keys, and more.

## Features

- Browse and purchase Steam accounts, game keys, and skins
- User profile management
- Product listings with detailed information
- Shopping cart functionality
- Admin panel for site management
- Responsive design for all devices

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- Node.js 16 or higher

### Installation

1. Clone the repository
2. Install dependencies

```bash
bun install
```

3. Start the development server

```bash
bun run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Admin Panel

The application includes a full-featured admin panel for site management.

### Accessing the Admin Panel

1. Navigate to `/adminpaneel` in your browser
2. Use the following credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

### Admin Panel Features

- Dashboard with site statistics
- User management
- Product moderation
- Category management
- Site settings

### Troubleshooting Admin Panel Issues

If you encounter issues with the admin panel (such as redirect loops or missing data), try the following steps:

1. Clear your browser's localStorage:
   - Open Developer Tools (F12)
   - Go to Application tab > Storage > LocalStorage
   - Clear all localStorage data

2. Run the cleanup script:
   ```bash
   bun run cleanup
   ```

3. Restart the development server:
   ```bash
   bun run dev
   ```

4. After logging in to the admin panel, use the "Clear Temporary Data" button at the top of the dashboard to reset all statistics and pending moderation items.

## Building for Production

To build the application for production:

```bash
bun run build
```

The built files will be in the `dist` directory.

## Deployment

The application is configured for deployment on Netlify. Make sure to check the `netlify.toml` file for the correct build settings.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
