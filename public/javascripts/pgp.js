function encrypt_message(public_key, message, callback) {
  var key = openpgp.key.readArmored(public_key);
  openpgp.encryptMessage(key.keys, message).then(function(ciphertext) {
    callback(ciphertext);
  });
}
