# Sticky Notes API

A comprehensive Node.js REST API built with **Express** and **Mongoose** for managing personal sticky notes. The system features secure user authentication, data encryption, and advanced querying capabilities[cite: 1].

## 🚀 Features

*   **User Authentication:** Secure Signup and Login using JWT (expires in 1 hour).
*   **Security:** Password hashing and phone number encryption.
*   **Data Validation:** Custom Mongoose validators for data integrity (e.g., age ranges and title formatting)
*   **Notes Management:** Full CRUD operations with ownership protection—only owners can modify or delete their notes.
*   **Advanced Querying:** Supports pagination, descending sorting by date, and Mongoose aggregation for complex data joins.

---

## 🛠 Database Schema

### Users
*   **name**: String (Required).
*   **email**: String (Unique, Required).
*   **password**: String (Required, Hashed).
*   **phone**: String (Required, Encrypted).
*   **age**: Number (Must be between 18 and 60).

### Notes
*   **title**: String (Required) — *Validator: Must not be entirely uppercase*.
*   **content**: String (Required).
*   **userId**: Reference to Users (Required).
*   **Timestamps**: `createdAt` and `updatedAt`.

---

## 🔌 API Endpoints

### User APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/users/signup` | Register a new user with hashed credentials. |
| `POST` | `/users/login` | Authenticate and receive a JWT. |
| `PATCH` | `/users` | Update profile info (except password) for logged-in user. |
| `DELETE` | `/users` | Delete the logged-in user account. |
| `GET` | `/users` | Retrieve profile data for the current user. |

### Note APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/notes` | Create a new note. |
| `PATCH` | `/notes/:id` | Update a specific note (Owner only). |
| `PUT` | `/notes/replace/:id` | Replace an entire note document (Owner only). |
| `PATCH` | `/notes/all` | Bulk update titles for all notes owned by the user. |
| `DELETE` | `/notes/:id` | Delete a specific note (Owner only). |
| `DELETE` | `/notes` | Delete all notes belonging to the logged-in user. |
| `GET` | `/notes/paginate-sort` | Paginated list of notes, sorted by date (newest first). |
| `GET` | `/notes/:id` | Get a single note by ID (Owner only). |
| `GET` | `/notes/note-by-content` | Search for notes by content keyword. |
| `GET` | `/notes/note-with-user` | Get notes populated with specific user fields. |
| `GET` | `/notes/aggregate` | Advanced search by title using Mongoose aggregation. |

---

## 📂 Project Structure

This project follows the modular structure discussed in class:
```text
/src
  /models        # Mongoose Schemas (User, Note)
  /controllers   # Route Logic
  /routes        # Express Routing
  /middleware    # Auth (JWT) & Validation
  /utils         # Helpers for Hashing & Encryption
app.js           # Express App Setup
index.js         # Entry point (DB connection & Server)
```

---

## 🛠 Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (Database URI, JWT Secret, Encryption Keys).
4. Start the server:
   
```bash
   npm run start
   ```
