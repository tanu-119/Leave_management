import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import EmployeesSection from "./components/EmployeesSection";
import LeavesSection from "./components/LeavesSection";
import BalanceSection from "./components/BalanceSection";
import ReportsSection from "./components/ReportsSection";

const apiBase = "http://localhost:5000";

function App() {
  const [active, setActive] = useState("dashboard");

  // global data
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState(null);

  // employee form
  const [empForm, setEmpForm] = useState({
    name: "",
    email: "",
    department: "",
    joining_date: "",
  });

  // leave form
  const [leaveForm, setLeaveForm] = useState({
    employee_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  // balance check
  const [balanceEmployeeId, setBalanceEmployeeId] = useState("");
  const [balance, setBalance] = useState(null);
  const [balanceIncludePending, setBalanceIncludePending] = useState(false);

  // fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${apiBase}/employees`);
      setEmployees(res.data || []);
    } catch {
      setMessage("Failed to load employees.");
    }
  };

  // fetch leaves
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${apiBase}/leaves`);
      setLeaves(res.data || []);
    } catch {
      setMessage("Unable to fetch leaves.");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
  }, []);

  // Add employee
  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBase}/employees`, empForm);
      setMessage(res.data.message || "Employee added");
      setEmpForm({ name: "", email: "", department: "", joining_date: "" });
      fetchEmployees();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error adding employee");
    }
  };

  // Apply leave
  const applyLeave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBase}/leaves`, leaveForm);
      setMessage(res.data.message || "Leave applied");
      setLeaveForm({
        employee_id: "",
        start_date: "",
        end_date: "",
        reason: "",
      });
      fetchLeaves();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error applying leave");
    }
  };

  // Approve / Reject leave
  const changeLeaveStatus = async (id, action) => {
    try {
      await axios.put(`${apiBase}/leaves/${id}/${action}`);
      setMessage(`Leave ${action}d`);
      fetchLeaves();
    } catch (err) {
      setMessage(err.response?.data?.error || `Error ${action}ing leave`);
    }
  };

  // Get balance
  const getBalance = async () => {
    if (!balanceEmployeeId) return setMessage("Select an employee");
    try {
      const q = balanceIncludePending ? "?includePending=true" : "";
      const res = await axios.get(
        `${apiBase}/employees/${balanceEmployeeId}/balance${q}`
      );
      setBalance(res.data);
      setMessage(null);
    } catch {
      setMessage("Error fetching balance");
      setBalance(null);
    }
  };

  // KPIs
  const kpi = {
    totalEmployees: employees.length,
    pendingLeaves: leaves.filter((l) => l.status === "pending").length,
    approvedThisMonth: leaves.filter((l) => {
      const d = new Date(l.start_date);
      const now = new Date();
      return (
        l.status === "approved" &&
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth()
      );
    }).length,
  };

  return (
    <div className="app-layout">
      <Sidebar
        active={active}
        setActive={setActive}
        fetchLeaves={fetchLeaves}
      />

      <div className="main-section">
        <header className="header">
          <h1>Leave Management</h1>
          <button
            onClick={() => {
              fetchEmployees();
              fetchLeaves();
              setMessage("Refreshed");
            }}
          >
            Refresh
          </button>
        </header>

        <main className="content">
          {message && <div className="alert">{message}</div>}
          {active === "dashboard" && <Dashboard kpi={kpi} />}
          {active === "employees" && (
            <EmployeesSection
              empForm={empForm}
              setEmpForm={setEmpForm}
              employees={employees}
              addEmployee={addEmployee}
            />
          )}
          {active === "leaves" && (
            <LeavesSection
              employees={employees}
              leaveForm={leaveForm}
              setLeaveForm={setLeaveForm}
              applyLeave={applyLeave}
              leaves={leaves}
              changeLeaveStatus={changeLeaveStatus}
            />
          )}
          {active === "balance" && (
            <BalanceSection
              employees={employees}
              balanceEmployeeId={balanceEmployeeId}
              setBalanceEmployeeId={setBalanceEmployeeId}
              balanceIncludePending={balanceIncludePending}
              setBalanceIncludePending={setBalanceIncludePending}
              balance={balance}
              getBalance={getBalance}
            />
          )}
          {active === "reports" && <ReportsSection employees={employees} />}
        </main>
      </div>
    </div>
  );
}

export default App;
