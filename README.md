# Social Initiatives Platform API

## Objects
- **Event (Primary)**: title, description, date, location, organizer, type, capacity, status, tags
- **Participant (Secondary)**: event (ref -> Event), name, email, status

## Architecture (MVC)
- `models/` Mongoose schemas
- `controllers/` request + DB logic
- `routes/` endpoint mapping
- `middleware/` JWT auth, RBAC, error logging/handling

## Security
- Passwords are hashed with bcrypt before saving (never plain text).
- JWT is issued on register/login.

## RBAC Rules
- All **GET** routes are public:
  - GET /api/events
  - GET /api/events/:id
  - GET /api/participants
  - GET /api/participants/:id
- All **POST/PUT/DELETE** routes require:
  - `Authorization: Bearer <token>`
  - user role == `admin`

## Setup
1) Install dependencies:
   npm install

2) Create `.env` from `.env.example` and set `MONGO_URI`, `JWT_SECRET`.

3) Run:
   npm run dev
   (or) npm start

## Auth Endpoints
- POST /api/auth/register
  Body: { "email": "...", "password": "..." }
  Note: Public registration creates role "user" by design.

- POST /api/auth/login
  Body: { "email": "...", "password": "..." }

## Creating an admin
Set role manually in MongoDB for a user:
- role: "admin"
