const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware for JSON body parsing
app.use(express.json());

// A constant for our encryption key in a secure manner
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes for AES-256
const IV_LENGTH = 16; // For AES, this is always 16

// Encrypt function
const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex'); // Storing both iv and encrypted data
}

// Decrypt function
const decrypt = (text) => {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
}

// Sample API routes
app.post('/encrypt', (req, res) => {
    const { data } = req.body;
    const encryptedData = encrypt(data);
    res.json({ encryptedData: encryptedData });
});

app.post('/decrypt', (req, res) => {
    const { encryptedData } = req.body;
    try {
        const decryptedData = decrypt(encryptedData);
        res.json({ decryptedData: decryptedData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to decrypt data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
