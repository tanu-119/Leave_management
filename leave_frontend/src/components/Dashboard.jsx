import React from "react";

function Dashboard({ kpi }) {
    return (
        <div className="grid">
            <div className="card kpi">
                <div className="kpi-title">Employees</div>
                <div className="kpi-num">{kpi.totalEmployees}</div>
            </div>
            <div className="card kpi">
                <div className="kpi-title">Pending Leaves</div>
                <div className="kpi-num">{kpi.pendingLeaves}</div>
            </div>
            <div className="card kpi">
                <div className="kpi-title">Approved This Month</div>
                <div className="kpi-num">{kpi.approvedThisMonth}</div>
            </div>
        </div>
    );
}

export default Dashboard;
