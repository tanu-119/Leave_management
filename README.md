# Leave Management System – README

## Project Overview

This is a **Leave Management System (LMS)** designed to streamline employee leave requests, approvals, and tracking. The system supports multiple roles (Employee, Manager, Admin) and provides an efficient way to manage employee leaves with role-based access control.

The project demonstrates **React (Frontend)**, **Node.js/Express (Backend APIs)**, and **MongoDB (Database)** integration with a scalable architecture.

---

## Setup Instructions

### 🔹 Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 🔹 Steps to Run Locally

1. Clone the repository

   ```bash
   git clone <repo-url>
   cd leave-management
   ```

2. Install dependencies for backend

   ```bash
   cd backend
   npm install
   ```

3. Configure environment variables (`.env`)

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/leave_mgmt
   ```

4. Start backend

   ```bash
   npm start
   ```

5. Install and run frontend

   ```bash
   cd frontend
   npm install
   npm start
   ```

6. Access the app at [http://localhost:3000](http://localhost:3000).

---

## High-Level Design (HLD)

### 1. Architecture Diagram

Includes **Frontend (React)** → **Backend (Node.js APIs)** → **Database (MongoDB)**.

### 2. API & Database Interaction

Request flows from UI → Backend → Database → Backend → UI.

### 3. Scaling Strategy

- Load Balancer + Multiple Backend Servers
- MongoDB with Read Replicas
- Stateless APIs to handle 50 → 500+ employees.

### 4. Database Schema

- **Employees**: id, name, role, email
- **Leaves**: leave_id, employee_id, type, start_date, end_date, status

### 5. Role-Based Access

- Employee → Apply leave, View status
- Manager → Approve/Reject leave, View team leaves
- Admin → Manage employees, Reports

---

## Assumptions

- Employees belong to one manager.
- Only Admin can add/remove employees.
- Leave balance validation is done in backend.
- Each leave request must be approved by the reporting manager.

---

## Edge Cases Handled

- Duplicate leave requests blocked.
- Prevent overlapping leaves for the same employee.
- Unauthorized API access blocked via JWT authentication.
- Manager/Admin cannot apply for leave on behalf of others.
- Proper error messages for invalid inputs.

---
