# Prep Master — Admin + MongoDB Edition

## Features
- Existing dark Prep Master UI and 11 app cards.
- Search bar with **Apps** and **My Apps** tabs.
- User account login/register.
- Purchased apps appear in **My Apps** after a valid premium code is redeemed.
- Premium code verification happens on the Node.js server and MongoDB.
- Admin panel at `/admin.html` for app price/authorized URL management and code generation/revocation.
- Telegram Buy Now flow remains pointed to the supplied contact: https://t.me/Subhanali011
- Startup Telegram channel popup points to: https://t.me/prepmaster0

## Setup
1. Install Node.js 18+.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Put your MongoDB Atlas connection string in `MONGODB_URI`.
5. Change `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`.
6. Run `npm start`.
7. Open `http://localhost:3000/` and admin at `http://localhost:3000/admin.html`.

## Important
The seeded app entries intentionally have blank `authorizedUrl` values. In the Admin Panel, enter only URLs for learning content/platforms you own or are authorized to distribute. A premium code does not itself create authorization to third-party content.

For production, use HTTPS, a strong unique JWT secret, a strong admin password, and restrict MongoDB network access to your server where possible.
