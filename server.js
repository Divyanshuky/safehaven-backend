const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const firebaseConfig = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Fix multiline key issue
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};


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
