# Test Assignment

## Live Demo
- **URL**: [https://scandiweb-assignment.free.nf/](https://scandiweb-assignment.free.nf/)
- **Category View**: [https://scandiweb-assignment.free.nf/all](https://scandiweb-assignment.free.nf/all)

## Architecture
- **Backend**: PHP 8.1+ (Vanilla + GraphQL-PHP), OOP with Models, Singleton Database, PSR-4 Autoloading.
- **Frontend**: React 18, TypeScript, TailwindCSS, Apollo Client, React Router 7.
- **Deployment**: Hosted on InfinityFree. Managed subdirectory routing via `.htaccess` and custom PHP Router logic to handle base paths.

## Setup & Run

### Backend
1. **Requirements**: PHP 8.1+, Composer, MySQL.
2. **Setup**:
   - Navigate to `backend/`
   - Run `composer install`
   - Create a `.env` file or configure `src/Config/Database.php` (defaults: `localhost`, `root`, no password).
   - Run `php scripts/setup_database.php` from the `backend/` folder to create DB and seed data from `data.json`.
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
   - Note: Frontend expects backend at `http://localhost:8000/graphql` by default or via `VITE_GRAPHQL_URL` env variable.