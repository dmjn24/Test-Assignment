# Test Assignment

## Setup & Run

### Backend

1. **Requirements**: PHP 8.1+, Composer, MySQL.
2. **Setup**:
   - Navigate to `backend/`
   - Run `composer install`
   - Configure database connection in `src/Config/Database.php` if needed (default: localhost, root, no pass).
   - Run `php setup_database.php` to create DB and seed data from `../data.json`.
3. **Run**:
   - `php -S localhost:8000 -t public`

### Frontend

1. **Requirements**: Node.js, NPM.
2. **Setup**:
   - Navigate to `frontend/`
   - Run `npm install`
3. **Run**:
   - `npm run dev`
   - Access at `http://localhost:5173`

## Architecture

- **Backend**: PHP (Vanilla + GraphQL-PHP), OOP with Models (Product, Category, Attribute), Singleton Database.
- **Frontend**: React (Vite), TypeScript, TailwindCSS, Apollo Client, Context API for Cart.