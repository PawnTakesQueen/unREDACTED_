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

