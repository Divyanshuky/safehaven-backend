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

// API: Get all safe spots from Firestore
app.get("/api/safe-spots", async (req, res) => {
  try {
    const snapshot = await db.collection("safe_spots").get();
    const safeSpots = snapshot.docs.map(doc => doc.data());
    res.json(safeSpots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Send an SOS alert
app.post("/api/send-sos", async (req, res) => {
  try {
    await db.collection("sos_alerts").add(req.body);
    res.json({ message: "SOS Alert Sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
