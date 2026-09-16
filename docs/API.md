# LinkHub API Documentation

## Authentication Routes
Base Path: `/api/v1/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Authenticate user & get tokens | No |
| POST | `/refresh` | Get new access token using refresh cookie | No |
| POST | `/logout` | Clear HTTP-only cookies | Yes |

---

## Links Routes
Base Path: `/api/v1/links`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all links for authenticated user (paginated) | Yes |
| POST | `/` | Create a new short link (auto or custom alias) | Yes |
| PUT | `/:id` | Update an existing link | Yes |
| DELETE | `/:id` | Delete a link | Yes |

---

## Analytics Routes
Base Path: `/api/v1/analytics`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/summary` | Get total clicks, links, and quick stats | Yes |
| GET | `/time-series` | Get clicks over time for charts | Yes |
| GET | `/devices` | Get device distribution data | Yes |
| GET | `/referrers` | Get top traffic sources | Yes |

---

## Bio Studio Routes
Base Path: `/api/v1/bio`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get user's Bio profile | Yes |
| PUT | `/profile` | Update Bio profile details & theme | Yes |
| POST | `/links` | Add a new social link | Yes |
| PUT | `/links/:id` | Update a social link | Yes |
| DELETE | `/links/:id` | Delete a social link | Yes |
| PATCH | `/links/reorder`| Update display order of social links | Yes |

---

## Public & Redirect Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/r/:shortCode` | Redirection Engine - Returns 302 & tracks click | No |
| GET | `/api/v1/public/bio/:username` | Fetch public bio profile data for rendering | No |

---

## Rate Limits
The API is protected by `express-rate-limit`:
- **Auth Routes**: 20 requests per 15 minutes
- **Link Creation**: 100 requests per 15 minutes
- **Redirection**: 300 requests per 1 minute

## Security
- Authentication is handled via **HTTP-Only Cookies**.
- IP addresses captured during redirection are hashed using HMAC-SHA256 before being stored in the database. Raw IPs are never saved.
