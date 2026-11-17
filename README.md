# FoodSwing: Taste in Motion

FoodSwing is a full-stack food ordering and delivery demo. Customers can explore
the menu, place Cash on Delivery orders, and follow order progress. Admins manage
orders and rider assignments, while riders handle deliveries through a dedicated
portal.

<p align="center">
  <img src="docs/images/foodswing-home.png" alt="FoodSwing homepage showing the Taste in Motion hero section" width="100%">
</p>

## Features

### Customer experience

- Browse, search, sort, and filter food items by category.
- Add items to a cart and apply eligible promotion codes.
- Place orders with Cash on Delivery.
- Optionally share a map location at checkout and track an order.
- Register and sign in with a phone number and password.

### Admin dashboard

- Review orders and update their status.
- View an order's status and delivery history.
- Create and manage rider accounts.
- Check rider availability and assign eligible orders.

### Rider portal

- Create an account and sign in using a phone number and password.
- Set availability to online or offline.
- Review assigned deliveries and the customer's shared map location.
- Update delivery status and view completed delivery history.

## Technology

- **Frontend:** HTML, CSS, and vanilla JavaScript
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Authentication:** bcrypt password hashing and HTTP-only session cookies

## Requirements

- Node.js 20 or newer
- PostgreSQL 14 or newer

## Run locally

1. Clone the repository and enter the project:

   ```sh
   git clone https://github.com/AWPriyo/FoodSwing.git
   cd FoodSwing
   ```

2. Create a PostgreSQL database named `foodswing`.

3. Configure the backend environment. In PowerShell:

   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```

   On macOS or Linux:

   ```sh
   cd backend
   cp .env.example .env
   ```

   Edit `.env` and set `DATABASE_URL` to your PostgreSQL connection
   string. The template includes the other local development settings. Use a
   strong `ADMIN_PASSWORD` of at least 12 characters for the initial admin
   setup.

4. Install dependencies, create the database schema and sample data, and
   provision the admin account:

   ```sh
   npm install
   npm run db:init
   npm run db:seed
   npm run db:admin
   ```

5. Start the server:

   ```sh
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000).

The Express server serves both the frontend and API. Do not open the HTML files
directly from the filesystem.

After the admin account has been created successfully, remove `ADMIN_PASSWORD`
from `.env`; the running server does not need it. Never commit `.env` or
put real credentials in frontend files. For hosted deployment, configure
secrets in the hosting provider's environment settings and use a hosted
PostgreSQL database.

## Available scripts

Run these commands from the `backend` directory.

| Command | Description |
| --- | --- |
| `npm start` | Start the production server |
| `npm run dev` | Start the server in watch mode |
| `npm run db:init` | Create or update the database schema |
| `npm run db:seed` | Add or update sample products and promotions |
| `npm run db:admin` | Create or update the admin account |
| `npm test` | Run the backend test suite |

## Project structure

```text
FoodSwing/
├── backend/          # Express API, PostgreSQL schema, and backend scripts
├── docs/
│   └── images/       # README screenshots
├── frontend/         # Customer, admin, and rider HTML/CSS/JavaScript
├── images/           # Food and restaurant image assets
└── README.md
```

For API routes, order workflow details, and database notes, see
[backend/README.md](backend/README.md).

## Notes

- Cash on Delivery is the currently supported payment method. Online payments
  such as bKash or Nagad require a merchant payment-gateway integration.
- Promotion eligibility, prices, and delivery fees are recalculated by the
  server.
- Use a managed PostgreSQL database for deployment; a database running only on
  your computer is not accessible to a hosted application.
