var crypto = require('crypto'),
    fs = require('fs'),
    openpgp = require('openpgp'),
    shredfile = require('shredfile') ({
      iterations: 25,
      remove: true,
      zero: true
    });

function encrypt_message(public_key, message, callback) {
  var key = openpgp.key.readArmored(public_key);
  openpgp.encryptMessage(key.keys, message).then(function(ciphertext) {
    callback(ciphertext);
  });
}

module.exports.messageEndpoint = function(app, module) {
  //add data into the database
  app.post('/submit', multipartMiddleware, function(req, res) {
    var attachment = fs.readFileSync(req.files.attachment.path, 'utf8');
    shredfile.shred(req.files.attachment.path);
    var id = '',
        id_spaces = '',
        possible = 'ACEFHJKLMNPRTUVWXYabcdefghijkmnopqrstuvwxyz34789';
    function get_id() {
      var rnd = crypto.randomBytes(24),
          value = new Array(24),
          len = possible.length;
      for (var i = 0; i < 24; i++) {
          value[i] = possible[rnd[i] % len];
      };
      return value.join('');
    }
    var id = get_id();
    for (var i = 0; i < id.length; i++) {
      if (i > 0 && i % 4 == 0) {
        id_spaces += ' ';
      }
      id_spaces += id[i];
    }
    function sanitize(val) {
      return val.replace(/\\/g, '\\\\').replace(/\//g, '\\/');
    }
    function byte_length(str) {
      // returns the byte length of an utf8 string
      var s = str.length;
      for (var i=str.length-1; i>=0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) {
          s++;
        } else if (code > 0x7ff && code <= 0xffff) {
          s+=2;
        }
        if (code >= 0xDC00 && code <= 0xDFFF) {
          i--; //trail surrogate
        }
      }
      return s;
    }

    var message_no_id = ('/SUBJECT' + sanitize(req.body.subject.toString()) +
                        '/MESSAGE' + sanitize(req.body.message.toString()) +
                        '/ATTACHMENT' + sanitize(attachment.toString())),
        message_full = message_no_id + '/ID' + id,
        hash = crypto.createHash('sha512').update(message_no_id).digest('hex')
          .toString();
    var repeat = false;
        overflow = false;
        nothing = false;
        no_subject = false;
    var subject_length = byte_length(req.body.subject.toString());
        message_length = byte_length(req.body.message.toString());
        attachment_length = byte_length(attachment.toString());
    module.exports.db.connection.models.Message.findOne({'checksum': hash},
                                                 function(err, docs) {
      if (docs) {
        repeat = true;
      }
      if (subject_length > 256 || message_length > 2097152 ||
          attachment_length > 262144000) {
        overflow = true;
      } else if (subject_length == 0) {

      } else if (message_length + attachment_length == 0) {
        nothing = true;
      }
      if (repeat) {
        res.render('submit', {'repeat': repeat});
      } else if (overflow) {
        res.render('submit', {'overflow': overflow});
      } else if (nothing) {
        res.render('submit', {'nothing': nothing});
      } else if (no_subject) {
        res.render('submit', {'no_subject': no_subject});
      } else {
        pgp_pub = fs.readFileSync('./public/PGP.txt', 'utf-8');
        encrypt_message(pgp_pub, message_full, function(message_pgp) {
          var messages = new module.exports.db.connection.models.Message(
            {message: message_pgp, checksum: hash});
          messages.save(function(err, doc) {
            res.render('submit', {'reply_id_spaces': id_spaces});
          });
        });
      }
    });
  });
};
