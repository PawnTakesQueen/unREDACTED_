function generate_key_pair(pass, callback) {
  var options = {
      numBits: 4096,
      userId: 'Anonymous User',
      passphrase: pass
  };
  openpgp.generateKeyPair(options).then(function(keypair) {
    callback(keypair);
  });
}

function encrypt_message(public_key, message, callback) {
  var key = openpgp.key.readArmored(public_key);
  openpgp.encryptMessage(key.keys, message).then(function(ciphertext) {
    callback(ciphertext);
  });
}

function decrypt_message(keys, ciphertext, pass, callback) {
  pgp_message = openpgp.message.readArmored(ciphertext);
  keys.key.decrypt(pass);
  openpgp.decryptMessage(keys.key, pgp_message).then(function(plaintext) {
    callback(plaintext);
  });
}
