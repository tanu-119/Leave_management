import React from "react";

function LeavesSection({
    employees,
    leaveForm,
    setLeaveForm,
    applyLeave,
    leaves,
    changeLeaveStatus,
}) {
    return (
        <div>
            <div className="card">
                <h3>Apply Leave</h3>
                <form onSubmit={applyLeave}>
                    <label>Employee</label>
                    <select
                        value={leaveForm.employee_id}
                        onChange={(e) =>
                            setLeaveForm((prev) => ({ ...prev, employee_id: e.target.value }))
                        }
                        required
                    >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                                {emp.name} ({emp.email})
                            </option>
                        ))}
                    </select>
                    <label>Start</label>
                    <input
                        type="date"
                        value={leaveForm.start_date}
                        onChange={(e) =>
                            setLeaveForm((prev) => ({ ...prev, start_date: e.target.value }))
                        }
                        required
                    />
                    <label>End</label>
                    <input
                        type="date"
                        value={leaveForm.end_date}
                        onChange={(e) =>
                            setLeaveForm((prev) => ({ ...prev, end_date: e.target.value }))
                        }
                        required
                    />
                    <label>Reason</label>
                    <input
                        type="text"
                        value={leaveForm.reason}
                        onChange={(e) =>
                            setLeaveForm((prev) => ({ ...prev, reason: e.target.value }))
                        }
                        required
                    />
                    <button type="submit">Apply</button>
                </form>
            </div>

            <div className="card">
                <h3>All Leave Requests</h3>
                <div className="table-scroll">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Employee</th>
                                <th>Dates</th>
                                <th>Days</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((l) => {
                                const emp = employees.find(
                                    (x) =>
                                        String(x._id) === String(l.employee_id) ||
                                        String(x._id) === String(l.employee_id?._id)
                                );
                                return (
                                    <tr key={l._id}>
                                        <td>{String(l._id).slice(-6)}</td>
                                        <td>{emp ? emp.name : l.employee_id}</td>
                                        <td>
                                            {l.start_date?.slice(0, 10)} → {l.end_date?.slice(0, 10)}
                                        </td>
                                        <td>
                                            {Math.round(
                                                (new Date(l.end_date) - new Date(l.start_date)) /
                                                (1000 * 60 * 60 * 24)
                                            ) + 1}
                                        </td>
                                        <td className={`status ${l.status}`}>
                                            {l.status.toUpperCase()}
                                        </td>
                                        <td>
                                            {l.status === "pending" && (
                                                <>
                                                    <button
                                                        className="small"
                                                        onClick={() =>
                                                            changeLeaveStatus(l._id, "approve")
                                                        }
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="small outline"
                                                        onClick={() =>
                                                            changeLeaveStatus(l._id, "reject")
                                                        }
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {leaves.length === 0 && (
                                <tr>
                                    <td colSpan="6">No leave requests</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LeavesSection;
