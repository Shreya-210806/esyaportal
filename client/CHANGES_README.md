# Summary of Changes (Plain English)

This document explains what was changed in the project and why, in simple terms.

---

## 1. The Project Has Two Parts

- **Frontend** — The website you see in the browser (built with React). It runs on its own “port” (think of it as a channel number), often **8082**.
- **Backend** — The server that talks to the database and handles login, users, bills, etc. It runs on port **5001**.

Both need to be running for the app to work.

---

## 2. Backend Port: 5000 → 5001

**What changed:** The backend was set to use port **5000**. On Mac computers, port 5000 is already used by a system feature (AirPlay Receiver). So when the app tried to use port 5000, it either failed or the browser got a confusing “invalid response” or “CORS error.”

**What we did:** We changed the backend to use port **5001** instead, so it no longer conflicts with the Mac.

**What you need to know:**  
- The API (backend) is now at: **http://localhost:5001**  
- If you open that link in a browser, you should see: **API Running**

---

## 3. Database Connection and “Create If Missing”

**What changed:** We made sure the app always connects to a specific database. If that database doesn’t exist yet, MongoDB will create it automatically when the app first saves data (for example, when the first user registers).

**What we did:**  
- If you don’t set any database link, the app uses a default one: `mongodb://localhost:27017/portalpal`.  
- We added a small file in the `backend` folder (`.env.example`) that shows what settings you can use. You can copy it to `.env` and edit the values if needed.

**What you need to know:**  
- You can keep using your existing `.env` in the `backend` folder (with your MongoDB link).  
- The app will show in the console which database it’s using when it starts.

---

## 4. Login / CORS Error Fix

**What changed:** The website (frontend) was still trying to call the backend at **http://localhost:5000**. Because the backend had been moved to port 5001, those requests were going to the wrong place (or to the Mac’s AirPlay), and the browser showed a **CORS error** when you tried to log in.

**What we did:**  
- We updated the frontend so it calls the backend at **http://localhost:5001** (or whatever is set in the `.env` file at the project root).  
- We changed this in: login (AuthContext), registration, dashboard, admin dashboard, new connection page, and bills page.

**What you need to know:**  
- After these changes, login and other API calls go to the correct backend.  
- Make sure the **root** `.env` file (in the main project folder, not inside `backend`) contains:  
  `VITE_API_URL=http://localhost:5001`

---

## 5. How to Run the Project

**First time (or after pulling new code):**

1. **Install dependencies**
   - In the **main project folder**: run `npm install`
   - In the **backend** folder: run `npm install`

2. **Start the backend**
   - Open a terminal, go to the `backend` folder, and run:  
     `npm run dev`  
   - Wait until you see something like: “MongoDB Connected Successfully” and “Server running on port 5001”.

3. **Start the frontend**
   - Open **another** terminal, go to the **main project folder**, and run:  
     `npm run dev`  
   - The app will open at a address like **http://localhost:8082** (the exact port may vary; it will be shown in the terminal).

4. **Use the app**
   - Open the frontend URL (e.g. http://localhost:8082) in your browser.  
   - Login and other features will talk to the backend at http://localhost:5001.

**Restarting later:**  
- Stop each running app with **Ctrl+C** in its terminal, then run the same commands again (`npm run dev` in backend, then `npm run dev` in main folder).

---

## 6. Quick Reference

| What              | Where / Value                                      |
|-------------------|----------------------------------------------------|
| Frontend (website)| Usually http://localhost:8082 (see terminal)      |
| Backend (API)     | http://localhost:5001                              |
| API health check  | Open http://localhost:5001 in browser → “API Running” |
| Frontend API URL  | Set in **root** `.env`: `VITE_API_URL=http://localhost:5001` |
| Backend port      | Set in **backend** `.env`: `PORT=5001` (optional; 5001 is default) |
| Database link     | Set in **backend** `.env`: `MONGO_URI=...`         |

---

## 7. If Something Goes Wrong

- **“This page isn’t working” or “Invalid response” on port 5000**  
  You’re still opening the old port. Use **http://localhost:5001** for the API and make sure the frontend’s `.env` has `VITE_API_URL=http://localhost:5001`. Restart the frontend after changing `.env`.

- **CORS error when logging in**  
  The frontend is calling the wrong port. Confirm `VITE_API_URL=http://localhost:5001` in the **root** `.env`, then restart the frontend (`npm run dev` in the main folder).

- **Backend won’t start / “port in use”**  
  Another app might be using that port. Make sure you’re using port **5001** for the backend (and not 5000). You can set `PORT=5001` in `backend/.env`.

- **Database connection error**  
  Check `backend/.env` and ensure `MONGO_URI` is correct (e.g. your MongoDB Atlas link or local MongoDB address). The backend folder must have its own `.env` with `MONGO_URI` and optionally `PORT`.

---

*This document describes changes made to get the project running with the backend on port 5001, a clear database connection, and working login without CORS errors.*
