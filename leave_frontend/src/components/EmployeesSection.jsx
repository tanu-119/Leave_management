import React from "react";

function EmployeesSection({ empForm, setEmpForm, employees, addEmployee }) {
    return (
        <div className="section-row">
            <div className="card">
                <h3>Add Employee</h3>
                <form onSubmit={addEmployee}>
                    <label>Name</label>
                    <input
                        type="text"
                        value={empForm.name}
                        onChange={(e) =>
                            setEmpForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        required
                    />
                    <label>Email</label>
                    <input
                        type="email"
                        value={empForm.email}
                        onChange={(e) =>
                            setEmpForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        required
                    />
                    <label>Department</label>
                    <input
                        type="text"
                        value={empForm.department}
                        onChange={(e) =>
                            setEmpForm((prev) => ({ ...prev, department: e.target.value }))
                        }
                        required
                    />
                    <label>Joining Date</label>
                    <input
                        type="date"
                        value={empForm.joining_date}
                        onChange={(e) =>
                            setEmpForm((prev) => ({
                                ...prev,
                                joining_date: e.target.value,
                            }))
                        }
                        required
                    />
                    <button type="submit">Create</button>
                </form>
            </div>

            <div className="card">
                <h3>Employees</h3>
                <div className="table-scroll">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Dept</th>
                                <th>Joining</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp, idx) => (
                                <tr key={emp._id}>
                                    <td>{idx + 1}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.department}</td>
                                    <td>{new Date(emp.joining_date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan="5">No employees yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default EmployeesSection;
