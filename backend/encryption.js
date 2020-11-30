'use strict';

const crypto = require('crypto');

const ENCRYPTION_KEY = 'ERTYUIOPASDFGHJKLZXCVBNM12345678';
const IV = crypto.randomBytes(16);

function encrypt(text) { 
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
 let encrypted = cipher.update(text);

 encrypted = Buffer.concat([encrypted, cipher.final()]);

 return encrypted.toString('hex');
}

function decrypt(text) {
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
 let decrypted = decipher.update(Buffer.from(text, 'hex'));

 decrypted = Buffer.concat([decrypted, decipher.final()]);

 return decrypted.toString();
}

module.exports = { decrypt, encrypt, iv: IV, key: ENCRYPTION_KEY };