# Post-Deployment Manual Instructions

The production-safe automated cleanup is now complete. The repository has been sanitized, and all MongoDB connections strictly depend on Environment Variables rather than hardcoded credentials.

To complete the rollout and ensure zero downtime on your live platforms, you must manually perform the following steps:

## 1. Configure Render (Backend) Environments
Since all hardcoded MongoDB credentials (`mongodb+srv://...`) have been removed from the backend (`seedDatabase.js`, `test_mongo.js`, controllers, etc.), the server will crash if it does not have the URI explicitly provided in the cloud environment.

- Go to your **Render Dashboard**.
- Select your Backend Web Service.
- Navigate to **Environment -> Environment Variables**.
- Ensure the following key is present and correct:
  - `MONGO_URI`: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/...`
- Save and Trigger a Manual Deploy if Render does not automatically sync the repository push.

## 2. Configure Vercel (Frontend)
The frontend uses purely REST API endpoints and Socket.IO.
- Ensure your `VITE_API_URL` environment variable points to your Render backend in your **Vercel Dashboard**.
- E.g. `VITE_API_URL=https://your-backend-instance.onrender.com/api`

## 3. Seed Database (Optional)
If you decide to reset the production or staging DB:
- Open your terminal connected to Render (or do it locally while connected to Atlas).
- Run: `node backend/scripts/seedDatabase.js`
- Because we moved the credentials securely out, you must either export `MONGO_URI` locally before running it, or run it through Render's shell where the Environment variable is already injected.

> [!TIP]
> The dashboard UI now features a **Machine Selector** dropdown! Try switching from "All Machines (Fleet)" to a specific machine (e.g., `MCH-102`), and you will instantly see all stats, alerts, and live Socket.IO telemetry filter exclusively to that machine!
