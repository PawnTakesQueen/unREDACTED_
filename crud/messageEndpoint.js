var openpgp = require('openpgp');
var fs = require('fs');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
}

function encrypt_message(public_key, message, callback) {
  var key = openpgp.key.readArmored(public_key);
  openpgp.encryptMessage(key.keys, message).then(function(ciphertext) {
    callback(ciphertext);
  });
}

module.exports.messageEndpoint = function(app, module ) {
  //add data into the database
  app.post('/api/messages', function(req, res) {
    function gen_id() {
      var result = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (var i = 0; i < 24; i++) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return result;
    }
    var id = gen_id();
    pgp_pub = fs.readFileSync('./public/PGP.txt', 'utf-8');
    encrypt_message(pgp_pub, id, function(id_pgp) {
      encrypt_message(req.body['pgp_pubkey'], id, function(id_pgp_client) {
        req.body['id_pgp'] = id_pgp;
        var message = new module.exports.db.models.Message(req.body);
        message.save(function(err, doc) {
          res.send({'id_pgp': id_pgp_client});
        });
      });
    });
  });
};
