const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for simplicity (reset on server restart)
const visitors = new Set();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Route for tracking unique visitors
app.post("/api/visit", (req, res) => {
    const visitorId = req.cookies.visitorId;

    // If visitorId doesn't exist, create it and add to visitor count
    if (!visitorId) {
        const newVisitorId = Math.random().toString(36).substring(2);
        visitors.add(newVisitorId);

        // Set the cookie to identify the visitor on future visits
        res.cookie("visitorId", newVisitorId, { maxAge: 365 * 24 * 60 * 60 * 1000 });
        res.json({ totalUniqueVisitors: visitors.size });
    } else {
        // Visitor already counted, just return the current count
        res.json({ totalUniqueVisitors: visitors.size });
    }
});

app.get("/api/visit", (req, res) => {
    res.json({ totalUniqueVisitors: visitors.size });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
