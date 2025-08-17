const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection (use your own MongoDB URI here)
mongoose.connect(
  "mongodb+srv://Tanuja:Devi%401219@cluster0.ndrzjhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  department: String,
  joining_date: Date,
  leave_balance: { type: Number, default: 20 },
});
const Employee = mongoose.model("Employee", employeeSchema);

// Leave Request Schema
const leaveSchema = new mongoose.Schema({
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  start_date: Date,
  end_date: Date,
  reason: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});
const Leave = mongoose.model("Leave", leaveSchema);

// Get all employees
app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add Employee
app.post("/employees", async (req, res) => {
  try {
    const { name, email, department, joining_date } = req.body;
    if (!name || !email || !department || !joining_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newEmployee = new Employee({ name, email, department, joining_date });
    await newEmployee.save();
    res.json({
      employee_id: newEmployee._id,
      message: "Employee added successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Email must be unique" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// Apply Leave
app.post("/leaves", async (req, res) => {
  try {
    const { employee_id, start_date, end_date, reason } = req.body;
    if (!employee_id || !start_date || !end_date || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const employee = await Employee.findById(employee_id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const start = new Date(start_date);
    const end = new Date(end_date);
    if (end < start)
      return res
        .status(400)
        .json({ error: "End date must be after start date" });
    if (start < employee.joining_date)
      return res
        .status(400)
        .json({ error: "Leave cannot be before joining date" });

    // Calculate days requested
    const oneDay = 24 * 60 * 60 * 1000;
    const daysRequested = Math.round((end - start) / oneDay) + 1;

    // Check balance
    const approvedLeaves = await Leave.aggregate([
      { $match: { employee_id: employee._id, status: "approved" } },
      {
        $group: {
          _id: null,
          totalDays: {
            $sum: {
              $add: [
                {
                  $divide: [
                    { $subtract: ["$end_date", "$start_date"] },
                    oneDay,
                  ],
                },
                1,
              ],
            },
          },
        },
      },
    ]);

    const usedLeaves =
      approvedLeaves.length > 0 ? approvedLeaves[0].totalDays : 0;

    if (daysRequested > employee.leave_balance - usedLeaves) {
      return res.status(400).json({ error: "Insufficient leave balance" });
    }

    // Check overlapping leaves
    const overlapping = await Leave.findOne({
      employee_id: employee._id,
      status: { $in: ["pending", "approved"] },
      start_date: { $lte: end },
      end_date: { $gte: start },
    });

    if (overlapping) {
      return res
        .status(400)
        .json({ error: "Leave dates overlap with an existing request" });
    }

    const leave = new Leave({
      employee_id,
      start_date: start,
      end_date: end,
      reason,
    });
    await leave.save();
    res.json({
      leave_id: leave._id,
      status: leave.status,
      message: "Leave application submitted",
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Approve Leave
app.put("/leaves/:id/approve", async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave)
      return res.status(404).json({ error: "Leave application not found" });
    if (leave.status !== "pending")
      return res.status(400).json({ error: "Leave request is not pending" });

    leave.status = "approved";
    await leave.save();
    res.json({ message: "Leave approved", leave_id: leave._id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Reject Leave
app.put("/leaves/:id/reject", async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave)
      return res.status(404).json({ error: "Leave application not found" });
    if (leave.status !== "pending")
      return res.status(400).json({ error: "Leave request is not pending" });

    leave.status = "rejected";
    await leave.save();
    res.json({ message: "Leave rejected", leave_id: leave._id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/employees/:id/balance", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Balance check for:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const includePending = req.query.includePending === "true";
    const statuses = includePending ? ["approved", "pending"] : ["approved"];

    console.log("Statuses used:", statuses);

    const leaves = await Leave.aggregate([
      {
        $match: {
          employee_id: new mongoose.Types.ObjectId(employee._id), // 🔑 fixed
          status: { $in: statuses },
        },
      },
      {
        $group: {
          _id: null,
          totalDays: {
            $sum: {
              $add: [
                {
                  $divide: [
                    { $subtract: ["$end_date", "$start_date"] },
                    1000 * 60 * 60 * 24,
                  ],
                },
                1,
              ],
            },
          },
        },
      },
    ]);

    const usedLeaves = leaves.length > 0 ? leaves[0].totalDays : 0;
    const remainingBalance = employee.leave_balance - usedLeaves;

    res.json({
      employee_id: employee._id,
      name: employee.name,
      total_balance: employee.leave_balance,
      used_leaves: usedLeaves,
      remaining_balance: remainingBalance,
    });
  } catch (err) {
    console.error("Balance error:", err); // 👈 check full error in terminal
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
