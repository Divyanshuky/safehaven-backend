const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebaseServiceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ✅ API: Add a new Safe Spot
app.post("/api/safe-spots", async (req, res) => {
  try {
    const { name, location, lat, lng } = req.body;
    if (!name || !location || !lat || !lng) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newSpot = { name, location, lat, lng };
    await db.collection("safe_spots").add(newSpot);
    res.json({ message: "Safe spot added successfully!", data: newSpot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ API: Get all Safe Spots
app.get("/api/safe-spots", async (req, res) => {
  try {
    const snapshot = await db.collection("safe_spots").get();
    const safeSpots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(safeSpots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ API: Send an SOS Alert
app.post("/api/send-sos", async (req, res) => {
  try {
    const { user, location, timestamp } = req.body;
    if (!user || !location || !timestamp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const alert = { user, location, timestamp };
    await db.collection("sos_alerts").add(alert);
    res.json({ message: "SOS Alert Sent!", data: alert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ API: Get all SOS Alerts
app.get("/api/sos-alerts", async (req, res) => {
  try {
    const snapshot = await db.collection("sos_alerts").get();
    const sosAlerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(sosAlerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
