import React from "react";

function BalanceSection({
    employees,
    balanceEmployeeId,
    setBalanceEmployeeId,
    balanceIncludePending,
    setBalanceIncludePending,
    balance,
    getBalance,
}) {
    return (
        <div className="card">
            <h3>Check Leave Balance</h3>
            <label>Employee</label>
            <select
                value={balanceEmployeeId}
                onChange={(e) => setBalanceEmployeeId(e.target.value)}
            >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                    </option>
                ))}
            </select>
            <label>
                <input
                    type="checkbox"
                    checked={balanceIncludePending}
                    onChange={(e) => setBalanceIncludePending(e.target.checked)}
                />{" "}
                Include pending
            </label>
            <button onClick={getBalance}>Get Balance</button>

            {balance ? (
                <div>
                    <p>Total: {balance.total_balance}</p>
                    <p>Used: {balance.used_leaves}</p>
                    <p>Remaining: {balance.remaining_balance}</p>
                </div>
            ) : (
                <p className="help">Select employee and click Get Balance</p>
            )}
        </div>
    );
}

export default BalanceSection;
