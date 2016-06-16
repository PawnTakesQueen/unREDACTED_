var crypto = require('crypto'),
    openpgp = require('openpgp');

module.exports =  {
  // Decrypts value iv_ciphertext using value of key and AES256-CBC.
  aesdecrypt: function(iv_ciphertext, key) {
    var iv = new Buffer(iv_ciphertext.substr(0, 32), 'hex');
        ciphertext = iv_ciphertext.substr(32);
    ciphertext = new Buffer(ciphertext, 'hex').toString('binary');
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv),
        decrypted = decipher.update(ciphertext, 'binary', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  },
  // Encrypts value plaintext using values of key and iv with AES256-CBC.
  aesencrypt: function(plaintext, key, iv) {
    var encipher = crypto.createCipheriv('aes-256-cbc', key, iv),
        encrypted = encipher.update(plaintext, 'utf8', 'binary');
    encrypted += encipher.final('binary');
    iv_ciphertext = iv.toString('hex') + Buffer(encrypted, 'binary')
      .toString('hex');
    return iv_ciphertext;
  },
  // PGP encryption of message using public_key to encrypt
  pgpencrypt: function(public_key, message, callback) {
    var key = openpgp.key.readArmored(public_key);
    openpgp.encryptMessage(key.keys, message).then(function(ciphertext) {
      callback(ciphertext);
    });
  }
};
