const crypto = require('crypto');

// Replace this with your actual encrypted data
const encryptedData = 'Buffer.from("f235c970767b321417b682713d808c7b3885d03b100c6e30f630f1e57936a72a", "hex")';

// Replace this with your secure key
const key = 'Buffer.from("your-secure-key-goes-here", "hex")';

// Asynchronous decryption function using Promises
async function decryptData(encryptedData, key) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
        let decryptedData = decipher.update(encryptedData, 'hex', 'buffer');
        decryptedData = Buffer.concat([decryptedData, decipher.final('buffer')]);
        return decryptedData.toString('utf-8');
    } catch (error) {
        console.error('Error decrypting data:', error.message);
        throw error;
    }
}

// Main function to run the decryption
async function main() {
    try {
        const encryptedBuffer = eval(encryptedData);
        const keyBuffer = eval(key);
        const decryptedText = await decryptData(encryptedBuffer, keyBuffer);
        console.log('Decrypted data:', decryptedText);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
