function random(len) {
  var result = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++) {
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return result;
}

$('.entry > button').click(function() {
  alert(1);
  if ($(this).text() == 'Generate') {
    $(this).siblings('input').val(random(20));
  }
});

var hash = CryptoJS.SHA256("Testing");
var key = CryptoJS.enc.Hex.parse(hash.toString());
var iv  = CryptoJS.lib.WordArray.random(16);
var encrypted = CryptoJS.AES.encrypt("Message", key, {iv: iv});
var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {iv: iv});

function get_attachment(callback) {
  var file = $('#attachments > input')[0].files[0]
  if (file) {
    var reader = new FileReader();
    reader.onload = function() {
      callback(this.result);
    }
    reader.readAsText(file)
  } else {
    callback('');
  }
};
