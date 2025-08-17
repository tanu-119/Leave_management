import React from "react";

function ReportsSection({ employees }) {
    const exportCSV = () => {
        const csv = [
            ["id", "name", "email", "department", "joining_date"],
            ...employees.map((e) =>
                [e._id, e.name, e.email, e.department, e.joining_date]
                    .map((x) => `"${String(x).replace(/"/g, '""')}"`)
                    .join(",")
            ),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "employees.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="card">
            <h3>Reports</h3>
            <button onClick={exportCSV}>Export Employees CSV</button>
        </div>
    );
}

export default ReportsSection;
