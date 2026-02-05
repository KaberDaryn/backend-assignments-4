# Social Initiatives Platform API (Assignment 4)

Backend REST API for a Social Initiatives Platform built with **Node.js + Express + MongoDB (Mongoose)**.
The project is refactored into a **modular MVC architecture** and secured with **bcrypt** password hashing and **JWT-based Role-Based Access Control (RBAC)**.

## Key Features (Assignment 4 Requirements)
- **MVC architecture**: `models/`, `controllers/`, `routes/`, `middleware/`
- **Two related resources**:
  - **Event** (primary object)
  - **Participant** (secondary object) linked to Event via `event` ObjectId
- **Full CRUD** for both Event and Participant
- **Users system**:
  - Registration & login
  - Password hashing with **bcrypt**
  - JWT authentication
- **RBAC**
  - **GET** requests are public (no token required)
  - **POST / PUT / DELETE** require **admin** role + valid JWT

---

## Tech Stack
- Node.js
- Express
- MongoDB Atlas / MongoDB
- Mongoose
- bcrypt
- jsonwebtoken
- dotenv

---

## Project Structure
```

.
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   └── participantController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── errorLogger.js
├── models/
│   ├── User.js
│   ├── Event.js
│   └── Participant.js
├── public/                 # (optional for Assignment 3 demo)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── participantRoutes.js
├── server.js
├── package.json
├── package-lock.json
├── .env.example
└── .gitignore

````

---

## Environment Variables
Create `.env` in the project root (do **NOT** commit it):

### `.env.example`
```env
PORT=3000
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=<YOUR_SECRET>
JWT_EXPIRES_IN=7d
````

---

## Installation & Run

```bash
npm install
npm run dev
```

Default:

* Server runs on: `http://localhost:3000`

---

## Authentication (Users)

### Register

`POST /api/auth/register`

Body (JSON):

```json
{
  "email": "user1@test.com",
  "password": "123456"
}
```

### Login

`POST /api/auth/login`

Body (JSON):

```json
{
  "email": "user1@test.com",
  "password": "123456"
}
```

Response contains:

* `user` (id, email, role)
* `token` (JWT)

Use JWT in protected requests:
Header:

```
Authorization: Bearer <TOKEN>
```

---

## RBAC Rules

| Method | Endpoint Type  | Access     |
| ------ | -------------- | ---------- |
| GET    | Any GET route  | Public     |
| POST   | Any POST route | Admin only |
| PUT    | Any PUT route  | Admin only |
| DELETE | Any DELETE     | Admin only |

**Note:** Newly registered users have role `user` by default.
To test admin access, set one user’s `role` to `admin` in MongoDB (Atlas / Compass).

---

## API Endpoints

### Events

* `GET /api/events` — list events (public)
* `GET /api/events/:id` — get event by id (public)
* `POST /api/events` — create event (**admin**)
* `PUT /api/events/:id` — update event (**admin**)
* `DELETE /api/events/:id` — delete event (**admin**)

**Event fields:**

* `title`, `description`, `date`, `location`, `organizer`, `type`, `capacity`, `status`, `tags[]`

### Participants

* `GET /api/participants` — list participants (public)
* `GET /api/participants/:id` — get participant by id (public)
* `POST /api/participants` — create participant (**admin**)
* `PUT /api/participants/:id` — update participant (**admin**)
* `DELETE /api/participants/:id` — delete participant (**admin**)

**Participant fields (example):**

* `event` (ObjectId, required)
* `name`, `email`, `status`

---

## Example Requests (cURL)

### Public GET

```bash
curl http://localhost:3000/api/events
```

### Admin create event

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title":"Charity meetup",
    "description":"Help local community",
    "date":"2026-02-01T10:00:00.000Z",
    "location":"Almaty",
    "organizer":"NGO Team",
    "type":"fundraising",
    "capacity":100,
    "status":"published",
    "tags":["charity","community"]
  }'
```

### Admin create participant

```bash
curl -X POST http://localhost:3000/api/participants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "event":"<EVENT_ID>",
    "name":"Aruzhan S.",
    "email":"aruzhan@test.com",
    "status":"registered"
  }'
```

---

## Error Handling

* Centralized error handling middleware returns consistent JSON errors.
* Authorization errors:

  * `401 Unauthorized` (missing/invalid token)
  * `403 Forbidden` (not admin)

---

## How to Test (Postman)

1. Register a user → `POST /api/auth/register`
2. Login → `POST /api/auth/login` → copy token
3. Change role to `admin` in MongoDB for that user
4. Use Bearer token in Postman Authorization tab
5. Verify:

   * GET works without token
   * POST/PUT/DELETE fails for non-admin
   * POST/PUT/DELETE works for admin

---

## Notes for Submission

* `.env` is excluded via `.gitignore`
* `.env.example` is provided for configuration
* Project follows MVC and security requirements of Assignment 4
::contentReference[oaicite:0]{index=0}
```
<img width="1512" height="702" alt="{A45B841B-1C2C-49C0-A920-C30D4DF67ED5}" src="https://github.com/user-attachments/assets/b303c550-f502-482e-ae69-eeadfd91109e" />

