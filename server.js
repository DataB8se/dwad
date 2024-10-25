const express = require("express");
const fs = require("fs");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

// File to store visitor count data
const countFile = "visitorCount.json";

// Initialize visitor count if file doesn't exist
if (!fs.existsSync(countFile)) {
    fs.writeFileSync(countFile, JSON.stringify({ uniqueVisits: 0 }));
}

// Helper function to get the unique visitor count
const getVisitorCount = () => {
    const data = fs.readFileSync(countFile);
    return JSON.parse(data).uniqueVisits;
};

// Endpoint to get the unique visitor count
app.get("/count", (req, res) => {
    res.json({ uniqueVisits: getVisitorCount() });
});

// Endpoint to track visits
app.get("/visit", (req, res) => {
    const visitorId = req.cookies.visitorId;

    if (!visitorId) {
        const uniqueVisitorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        res.cookie("visitorId", uniqueVisitorId, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 year

        let data = JSON.parse(fs.readFileSync(countFile));
        data.uniqueVisits += 1;
        fs.writeFileSync(countFile, JSON.stringify(data));
    }

    res.redirect("/");
});

app.use(express.static("public")); // Serve static files from "public" folder

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
