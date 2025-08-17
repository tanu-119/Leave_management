import React from "react";

function Sidebar({ active, setActive, fetchLeaves }) {
    return (
        <aside className="sidebar">
            <div className="brand"></div>
            <nav>
                <button
                    className={active === "dashboard" ? "active" : ""}
                    onClick={() => setActive("dashboard")}
                >
                    Dashboard
                </button>
                <button
                    className={active === "employees" ? "active" : ""}
                    onClick={() => setActive("employees")}
                >
                    Employees
                </button>
                <button
                    className={active === "leaves" ? "active" : ""}
                    onClick={() => {
                        setActive("leaves");
                        fetchLeaves();
                    }}
                >
                    Leave Requests
                </button>
                <button
                    className={active === "balance" ? "active" : ""}
                    onClick={() => setActive("balance")}
                >
                    Balance
                </button>
                <button
                    className={active === "reports" ? "active" : ""}
                    onClick={() => setActive("reports")}
                >
                    Reports
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;
