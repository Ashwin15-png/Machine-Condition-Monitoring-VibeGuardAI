# Industry 4.0 Real-Time Industrial IoT Platform — Project Summary

> The **Machine Condition Monitoring System** has been upgraded into a production-ready, full-stack **Real-Time Industrial IoT Platform**. It features an Express/Node.js backend with Socket.IO telemetry streaming, a physical data simulator engine, an automated anomaly detection rule processing pipeline, and Mongoose database models integrated with the approved enterprise React UI shell.

---

## 🏗️ End-to-End System Architecture

```mermaid
graph TD
    subgraph Edge Layer & Hardware Simulation
        Sim[Industrial Data Simulator Engine - 2s Tick]
        Anom[Anomaly Detection Rules Engine]
        Sim -->|Random Walk Telemetry| Anom
    end

    subgraph Backend Core (Express + Socket.IO + Mongoose)
        Srv[server.js - Node.js Express Server]
        Sock[Socket.IO Server - port 5000]
        DB[(MongoDB Database / In-Memory Store)]
        
        Anom -->|Save Alarms| DB
        Sim -->|Broadcast Data| Sock
        Anom -->|Emit alert:new| Sock
        Srv --> Routes[REST API Routes /api/*]
        Routes --> DB
    end

    subgraph Frontend Realtime UI (React + Vite + Recharts)
        SockClient[socket.js - Socket.IO Client]
        Hook[useRealtimeDashboard Hook]
        Services[API Service Layer: api.js, machineService, alertService]

        Sock -->|WebSockets| SockClient
        SockClient --> Hook
        Services -->|HTTP REST| Routes
        Hook --> Dash[Dashboard.jsx - Live Telemetry & KPI Stats]
        Hook --> Alrt[Alerts.jsx - Live Alarm Stream & Ack Actions]
        Hook --> Mach[Machines.jsx - Asset Fleet Inventory & Status Cards]
        Services --> Hist[History.jsx & Analytics.jsx]
    end
```

---

## 📑 Completed Missions & Architectural Features

| Mission / Area | Status | Deliverables & Implementation Highlights |
| :--- | :---: | :--- |
| **Mission Beta 1: Project Architecture** | ✅ Completed | Clean modular file structure (`components/ui`, `cards`, `charts`, `table`, `layout`, `pages`, `context`, `routes`, `services`, `utils`), barrel export index files. |
| **Mission Beta 2: Layout & Shell System** | ✅ Completed | Collapsible sidebar, mobile drawer overlay, glassmorphism sticky topbar, live clock, breadcrumbs, footers, skeleton shimmer loaders, error boundaries. |
| **Mission Beta 3: Routing & Transitions** | ✅ Completed | React Router v7 layout structure with `React.lazy()` code splitting, `Suspense`, Framer Motion page transitions, active link highlights, 404 catch-all. |
| **Mission Beta 4: Industrial Design System** | ✅ Completed | Dark theme (`#020617`, `#0F172A`, `#111827`), rounded XL cards, glassmorphism, Framer Motion hover lifts, reusable primitives (`Button`, `Card`, `Badge`, `Modal`, `Input`, `Dropdown`, `ProgressBar`, `ConfirmDialog`, `Avatar`). |
| **Mission Beta 5: Real-Time IoT Backend Engine** | ✅ Completed | Built Express + Socket.IO server in `backend/` with Helmet, CORS, Morgan, Compression, Rate Limiting, and JWT auth. |
| **Mission Beta 6: Industrial Data Simulator** | ✅ Completed | 2-second telemetry simulator (`backend/services/simulatorService.js`) using random walk algorithm for non-jarring temperature, RPM, voltage, current, pressure, humidity, power, and health score calculations. |
| **Mission Beta 7: Anomaly Engine & Models** | ✅ Completed | Created Mongoose database schemas (`Machine`, `Sensor`, `Telemetry`, `Alert`, `User`, `Maintenance`, `Prediction`, `AuditLog`) and an Anomaly Engine (`backend/services/anomalyEngine.js`) that auto-evaluates rules and broadcasts `alert:new`. |
| **Mission Beta 8: Frontend Service Integration** | ✅ Completed | Developed `socket.js`, `dashboardService.js` (`useRealtimeDashboard`), `machineService.js`, `alertService.js`, and `telemetryService.js`. Replaced all static dummy datasets across pages while preserving visual design. |

---

## 📡 Socket.IO Real-Time Event Matrix

| Event Name | Frequency | Payload Description | Connected Component |
| :--- | :--- | :--- | :--- |
| `telemetry:update` | Every 2 sec | Live thermal & tri-axial vibration ($X, Y, Z$ + Peak RMS) data stream | `TemperatureChart`, `VibrationChart` |
| `machine:update` | Every 2 sec | Dynamic fleet machine metrics, operating states, and health scores | `Machines.jsx`, `MachineTable` |
| `dashboard:update` | Every 2 sec | Aggregated plant KPIs (OEE, total readings, average temp/vibration, alert counts) | `StatCard` Grid, `HealthPieChart` |
| `alert:new` | Event-driven | Instant alarm trigger when temperature, vibration, or current breaches limit | `Live Industrial Alarm Stream`, `Alerts.jsx` |

---

## 🎨 UI & Technology Stack Highlights

- **Backend:** Node.js, Express.js, Socket.IO, MongoDB, Mongoose, JWT, Helmet, Morgan, Compression, Rate Limiter.
- **Frontend Core:** React 19 & Vite (`1.12s` production build time).
- **Styling & Motion:** Tailwind CSS v4 with dark industrial palette, Framer Motion micro-interactions.
- **Data Visualization:** Recharts tri-axial vibration line graphs, thermal envelope area charts, health distribution pie charts.
- **Service Layer:** Axios REST client and Socket.IO real-time hooks with offline banner indicators and automatic reconnects.

---

## ⚡ How to Run the Industrial IoT System

1. **Start Backend Server & IoT Simulator (Port 5000):**
   ```bash
   cd backend
   node server.js
   ```
2. **Start Real-Time Frontend (Port 5173):**
   ```bash
   cd frontend
   npm run dev
   ```
3. **Access App:** Open browser at `http://localhost:5173`
4. **Demo Credentials:** Click *"Autofill Demo Engineer Profile"* on the login screen (`a.sterling@apex-industrial.com` / `enterprise123`).
