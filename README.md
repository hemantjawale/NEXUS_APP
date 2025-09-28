# NEXUS - Complete E-commerce Platform

A modern e-commerce platform built with React, Express.js, and PostgreSQL featuring:

- Product catalog with category browsing
- Shopping cart functionality
- User authentication with email/password
- Responsive design with dark/light mode
- Real-time inventory tracking

## Prerequisites

Before running NEXUS locally, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://postgresql.org/download/)
- **npm** (comes with Node.js)

## Local Setup Instructions

### 1. Clone the Project

```bash
git clone <your-repository-url>
cd nexus-ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Using Local PostgreSQL

1. Start PostgreSQL service on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE nexus_db;
   ```

#### Option B: Using Docker PostgreSQL

```bash
docker run --name nexus-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=nexus_db -p 5432:5432 -d postgres:15
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/nexus_db
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=nexus_db

# Session Secret (generate a random string)
SESSION_SECRET=your-super-secret-session-key-here

# Development
NODE_ENV=development
```

**Important:** Replace the database credentials with your actual PostgreSQL setup.

### 5. Database Schema Setup

Push the database schema to your PostgreSQL database:

```bash
npm run db:push
```

If you encounter any issues, try:

```bash
npm run db:push --force
```

### 6. Seed Sample Data (Optional)

The application will automatically create sample categories and products when you first access it. You can also manually add products through the admin interface.

### 7. Start the Application

```bash
npm run dev
```

This will start both the frontend (React) and backend (Express) servers. The application will be available at:

- **Frontend:** http://localhost:5000
- **Backend API:** http://localhost:5000/api

## Features

### User Features

- **Browse Products**: View products by category or search
- **Shopping Cart**: Add/remove items, update quantities
- **User Authentication**: Register and login with email/password
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes

### Developer Features

- **TypeScript**: Full type safety across frontend and backend
- **Modern React**: Hooks, Context API, and functional components
- **Express.js**: RESTful API with proper error handling
- **PostgreSQL**: Reliable database with proper relationships
- **Drizzle ORM**: Type-safe database operations
- **Session Management**: Secure user sessions
- **Password Hashing**: bcrypt for secure password storage

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug/products` - Get products by category

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart

## Database Schema

### Users
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `firstName`
- `lastName`
- `createdAt`

### Categories
- `id` (UUID, Primary Key)
- `name`
- `slug`
- `description`

### Products
- `id` (UUID, Primary Key)
- `name`
- `description`
- `price`
- `imageUrl`
- `categoryId` (Foreign Key)
- `stock`
- `featured`

### Cart Items
- `id` (UUID, Primary Key)
- `sessionId`
- `productId` (Foreign Key)
- `quantity`

## Customization

### Adding New Products

Products can be added through the database or by modifying the seed data in `server/storage.ts`.

### Styling

The application uses Tailwind CSS with custom color variables defined in `client/src/index.css`:

```css
:root {
  --nexus-primary: #2563eb; /* Blue */
  --nexus-secondary: #64748b; /* Gray */
}
```

### Environment Variables

For production deployment, make sure to set:

- `DATABASE_URL`: Your production PostgreSQL connection string
- `SESSION_SECRET`: A secure random string
- `NODE_ENV=production`

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL is correct
   - Ensure database exists

2. **Session Issues**
   - Make sure SESSION_SECRET is set
   - Clear browser cookies and try again

3. **Port Already in Use**
   - Change the port in server configuration
   - Kill any processes using port 5000

4. **Build Errors**
   - Delete `node_modules` and run `npm install` again
   - Ensure Node.js version is 18 or higher

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:push          # Sync schema
npm run db:push --force  # Force sync schema
npm run db:studio        # Open database GUI
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, TypeScript, bcryptjs (password hashing)
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Session Store**: PostgreSQL sessions

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- CSRF protection via session store
- SQL injection prevention with prepared statements
- Input validation with Zod schemas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.