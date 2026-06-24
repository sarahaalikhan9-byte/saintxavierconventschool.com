const express = require('express');
const cors = require('cors');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Global State
let sock = null;
let currentPairingCode = null;
let isConnected = false;
let isPairing = false;

// Setup WhatsApp connection
async function connectToWhatsApp(phoneNumber = null) {
    if (sock && isConnected) return;

    // Use persistent auth state
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth_info_baileys'));

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }), // Suppress detailed logs for cleaner output
        browser: Browsers.macOS('Desktop'),
        syncFullHistory: false
    });

    // If a phone number is provided and we are not registered
    if (phoneNumber && !sock.authState.creds.registered) {
        isPairing = true;
        currentPairingCode = null;
        try {
            // Request the pairing code (OTP-like code) for the provided phone number
            const code = await sock.requestPairingCode(phoneNumber);
            // Format code visually (XXX-XXX)
            currentPairingCode = code?.match(/.{1,4}/g)?.join('-') || code;
            console.log(`Pairing code for ${phoneNumber}: ${currentPairingCode}`);
        } catch (error) {
            console.error("Failed to request pairing code:", error);
            isPairing = false;
        }
    }

    // Handle connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            isConnected = false;
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            // reconnect if not logged out
            if (shouldReconnect) {
                connectToWhatsApp();
            } else {
                console.log('You are logged out. Please request a new pairing code.');
            }
        } else if (connection === 'open') {
            console.log('opened connection');
            isConnected = true;
            isPairing = false;
            currentPairingCode = null;
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

// Auto connect on startup if auth state exists
connectToWhatsApp();

// API Endpoints

app.get('/api/whatsapp/status', (req, res) => {
    res.json({
        isConnected,
        isPairing,
        pairingCode: currentPairingCode,
        isRegistered: sock?.authState?.creds?.registered || false
    });
});

app.post('/api/whatsapp/connect', async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required (e.g., 917869232331)" });
    }

    if (isConnected) {
        return res.json({ message: "Already connected" });
    }

    // Format phone number: remove any non-digit
    const formattedNumber = phoneNumber.replace(/\D/g, '');

    await connectToWhatsApp(formattedNumber);
    
    // Wait briefly for the code to generate
    setTimeout(() => {
        if (currentPairingCode) {
            res.json({ message: "Pairing code generated", pairingCode: currentPairingCode });
        } else {
            res.status(500).json({ error: "Failed to generate pairing code. Please try again." });
        }
    }, 2000);
});

// Endpoint to send broadcast messages
app.post('/api/whatsapp/send-broadcast', async (req, res) => {
    const { numbers, message } = req.body;
    
    if (!isConnected || !sock) {
        return res.status(400).json({ error: "WhatsApp is not connected." });
    }

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
        return res.status(400).json({ error: "A list of numbers is required." });
    }

    if (!message) {
        return res.status(400).json({ error: "Message content is required." });
    }

    res.json({ message: `Broadcast started for ${numbers.length} numbers.` });

    // Send messages asynchronously to avoid blocking the API response
    // And add a slight delay between messages to prevent spam bans
    const sendMessagesInLoop = async () => {
        for (let i = 0; i < numbers.length; i++) {
            let num = numbers[i].replace(/\D/g, '');
            // Basic check if Indian number format (10 digits, add 91)
            if (num.length === 10) num = `91${num}`;
            
            const jid = `${num}@s.whatsapp.net`;
            try {
                // Check if number exists on WA
                const [result] = await sock.onWhatsApp(jid);
                if (result?.exists) {
                    await sock.sendMessage(jid, { text: message });
                    console.log(`[Success] Sent to ${num}`);
                } else {
                    console.log(`[Failed] Number not on WhatsApp: ${num}`);
                }
            } catch (err) {
                console.error(`[Error] Failed sending to ${num}:`, err.message);
            }
            
            // Wait 2-3 seconds between messages
            await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000));
        }
        console.log('Broadcast complete.');
    };

    sendMessagesInLoop();
});

function buildLocalPromotion({ topic, platform, audience, tone, contentType }) {
    const cleanTopic = topic || 'Saint Xavier Convent School update';
    const cleanPlatform = platform || 'social media';
    const cleanAudience = audience || 'parents and students';
    const cleanTone = tone || 'professional';
    const cleanType = contentType || 'post';
    const hook = cleanTone === 'festive'
        ? `Celebrate with Saint Xavier Convent School!`
        : cleanTone === 'urgent'
            ? `Important update from Saint Xavier Convent School`
            : `Saint Xavier Convent School presents`;

    return [
        `${hook}: ${cleanTopic}`,
        '',
        `For ${cleanAudience}, this ${cleanType} is designed for ${cleanPlatform}. Join us as we continue building confidence, discipline, creativity, and academic excellence.`,
        '',
        'Call to action: Contact the school office today or visit the campus for details.',
        '',
        '#SaintXavierConventSchool #IndoreSchool #SchoolUpdate #StudentSuccess #Education'
    ].join('\n');
}

app.post('/api/ai/promotion', async (req, res) => {
    const {
        topic,
        platform = 'Instagram',
        audience = 'parents and students',
        tone = 'professional',
        contentType = 'post'
    } = req.body || {};

    if (!topic || !topic.trim()) {
        return res.status(400).json({ error: 'Promotion topic is required.' });
    }

    res.json({
        source: 'school-local-generator',
        promotion: buildLocalPromotion({ topic, platform, audience, tone, contentType })
    });
});

app.listen(PORT, () => {
    console.log(`WhatsApp Bot Server is running on port ${PORT}`);
});
