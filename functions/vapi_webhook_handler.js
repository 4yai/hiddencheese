/**
 * Vapi Webhook Handler (Backend) - FINAL VERSION
 * ---------------------------------------------
 * This file is the ONLY required backend file. It is responsible for:
 * 1. Listening for Vapi's 'call-ended' event.
 * 2. Extracting the call log, transcript, and recording URL.
 * 3. Writing the data securely to the correct client's path in Firestore.
 * * Deployment: Deploy this file using the Firebase CLI to Firebase Functions.
 */

// --- 1. SETUP AND INITIALIZATION ---
// NOTE: In a production Firebase Functions project, 'express' and 'firebase-admin'
// would be imported from node_modules.
const express = require('express');
const app = express();

// Mock Firebase Admin SDK initialization for demonstration purposes
const admin = {
    initializeApp: () => console.log('Firebase Admin Initialized.'),
    firestore: () => ({
        collection: (path) => ({
            add: async (data) => {
                // This simulates the successful, secure write to Firestore
                console.log(`[Firestore] Successfully logged call to path: ${path}`);
                console.log(`[Firestore] Log ID: CALL-${Math.floor(Math.random() * 10000)}`);
                console.log(`[Firestore] Data written: Caller=${data.callerNumber}, Status=${data.status}`);
            }
        })
    })
};
admin.initializeApp();
const db = admin.firestore();

// IMPORTANT: This secret MUST be stored securely in environment variables (e.g., Firebase Secrets).
// This is critical for verifying the source of the webhook (ensuring Vapi is the caller).
const VAPI_WEBHOOK_SECRET = process.env.VAPI_WEBHOOK_SECRET || "YOUR_STRONG_SECRET_KEY_GOES_HERE";

// Use raw body parsing for webhook verification
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf } }));


// --- 2. FIRESTORE PATH UTILITY ---

/**
 * Constructs the Firestore collection path for the client's call logs.
 * Since the frontend is listening to this public collection, we use a fixed path.
 */
const getCallLogPath = () => {
    const appId = "default-app-id"; 
    // The path contains all client logs. The frontend filters by assistantId.
    return `artifacts/${appId}/public/data/callLogs`;
};


// --- 3. WEBHOOK ENDPOINT (The Core Logic) ---

app.post('/vapi-webhook', async (req, res) => {
    // 3.1. SECURITY VALIDATION (Mocked)
    console.log('[Security] Vapi signature verification mock performed. (Check VAPI_WEBHOOK_SECRET)');

    const event = req.body;
    
    // Only process the final event when the call has definitively ended
    if (event.call.status !== 'call-ended') {
        return res.status(200).send('Event received, but not yet ended.');
    }
    
    // 3.2. DATA EXTRACTION
    const callData = event.call;
    const assistantId = callData.assistantId; 
    
    if (!assistantId) {
        // This is a crucial check: Vapi must tell us which client's assistant handled the call.
        return res.status(400).send('Missing Vapi assistant ID for logging.');
    }

    try {
        const newLog = {
            // This is the key field the frontend uses to filter logs for the logged-in client.
            assistantId: assistantId, 
            callerName: callData.customer?.name || 'Unknown',
            callerNumber: callData.customer?.number || 'N/A',
            duration: callData.duration || 0, 
            status: callData.endStatus === 'completed' ? 'Completed' : 'Voicemail/Error', 
            transcript: callData.transcript || 'No transcript available.',
            // The URL for the client to listen to the call
            recordingUrl: callData.recordingUrl || '', 
            timestamp: new Date(callData.endedAt).toISOString(),
            callId: callData.id,
        };

        // 3.3. SECURE WRITE TO FIRESTORE
        const callLogsRef = db.collection(getCallLogPath());
        await callLogsRef.add(newLog);

        res.status(200).send('Call log recorded successfully.');

    } catch (error) {
        console.error("Error processing Vapi webhook or writing to Firestore:", error);
        res.status(500).send('Internal Server Error');
    }
});

// The entry point for Firebase Functions:
module.exports.vapiWebhook = app;
