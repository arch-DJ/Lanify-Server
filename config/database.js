const crypto = require('crypto').randomBytes(256).toString('hex'); // Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)

// Export config object
module.exports = {
  db: 'lanify', // Database name
  uri: function() {
                return 'mongodb://localhost:27017/' + this.db;
        },
  secret: crypto // Cryto-created secret
}
