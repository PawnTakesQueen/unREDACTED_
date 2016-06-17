var local_crypto = require('../modules/local_crypto'),
    crypto = require('crypto'),
    fs = require('fs'),
    shredfile = require('shredfile') ({
      iterations: 25,
      remove: true,
      zero: true
    });

module.exports.messageEndpoint = function(app, module) {
  // If post request to /submit page
  app.post('/submit', multipartMiddleware, function(req, res) {
    /*
     * Get attachment data and zero out the file in the file system and
     * delete it
     */
    var attachment = fs.readFileSync(req.files.attachment.path, 'utf8');
    shredfile.shred(req.files.attachment.path);
    var id = '',
        id_spaces = '',
        possible = 'ACEFHJKLMNPRTUVWXYabcdefghijkmnopqrstuvwxyz34789';
    // Create random id using 24 non-ambiguous characters
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
    // Add spaces to id for human readability
    for (var i = 0; i < id.length; i++) {
      if (i > 0 && i % 4 == 0) {
        id_spaces += ' ';
      }
      id_spaces += id[i];
    }
    // Replaces \ character with \\ and / character with \/ to sanitize val
    function sanitize(val) {
      return val.replace(/\\/g, '\\\\').replace(/\//g, '\\/');
    }
    // Returns the byte length of a UTF-8 string
    function byte_length(str) {
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
    // Create message syntax and checksum of content (var hash)
    var message = ('/MESSAGE' + sanitize(req.body.message.toString()) +
                   '/ATTACHMENT' + sanitize(attachment.toString())),
        id_hash = crypto.createHash('sha512').update(id).digest('hex'),
        message_full = message_no_id + '/IDHASH' + id_hash,
        hash = crypto.createHash('sha512').update(message_no_id).digest('hex')
          .toString();
    var repeat = false;
        overflow = false;
        nothing = false;
        no_subject = false;
    var subject_length = byte_length(req.body.subject.toString());
        message_length = byte_length(req.body.message.toString());
        attachment_length = byte_length(attachment.toString());
    // Checks if checksum exists in messages collection of database
    module.exports.db.connection.models.Message.findOne({'checksum': hash},
                                                 function(err, docs) {
      if (docs) {
        repeat = true;
      }
      // Checks if subject, message, or attachment are too large
      if (subject_length > 256 || message_length > 2097152 ||
          attachment_length > 262144000) {
        overflow = true;
      // Or if there is no subject
      } else if (subject_length == 0) {
        no_subject = true
      // Or if there is no message AND no attachment
      } else if (message_length + attachment_length == 0) {
        nothing = true;
      }
      // Sends error information if any exist
      if (repeat) {
        res.render('submit', {'repeat': repeat});
      } else if (overflow) {
        res.render('submit', {'overflow': overflow});
      } else if (nothing) {
        res.render('submit', {'nothing': nothing});
      } else if (no_subject) {
        res.render('submit', {'no_subject': no_subject});
      // If no errors
      } else {
        // Retrieve data from PGP.txt file in public folder
        pgp_pub = fs.readFileSync('./public/PGP.txt', 'utf8');
        // PGP encrypt message_full using pgp_pub as public key
        local_crypto.pgpencrypt(pgp_pub, message_full, function(message_pgp) {
          // Save PGP encrypted message and checksum to database
          var messages = new module.exports.db.connection.models.Message(
            {message: message_pgp, checksum: hash});
          messages.save(function(err, doc) {
            // Send human readable id back to user (id_spaces)
            res.render('submit', {'reply_id_spaces': id_spaces});
          });
        });
      }
    });
  });
};
