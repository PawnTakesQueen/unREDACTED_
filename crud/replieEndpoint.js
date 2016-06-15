var crypto = require('crypto'),
    fs = require('fs');

// Server's decryption key for encrypted database files
const server_key = new Buffer(fs.readFileSync('./key.txt').toString(), 'hex');
console.log(server_key);

// Decrypts value iv_ciphertext using value of key and AES256-CBC.
function decrypt(iv_ciphertext, key) {
  var iv = new Buffer(iv_ciphertext.substr(0, 32), 'hex');
      ciphertext = iv_ciphertext.substr(32);
  ciphertext = new Buffer(ciphertext, 'hex').toString('binary');
  var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv),
      decrypted = decipher.update(ciphertext, 'binary', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Encrypts value plaintext using values of key and iv with AES256-CBC.
function encrypt(plaintext, key, iv) {
  var encipher = crypto.createCipheriv('aes-256-cbc', key, iv),
      encrypted = encipher.update(plaintext, 'utf8', 'binary');
  encrypted += encipher.final('binary');
  iv_ciphertext = iv.toString('hex') + Buffer(encrypted, 'binary').toString('hex');
  console.log(iv_ciphertext);
  return iv_ciphertext;
}

module.exports.replieEndpoint = function(app, module) {
  app.post('/reply', function(req, res) {
    function sanitize(val) {
      return val.replace(/\\/g, '\\\\').replace(/\//g, '\\/');
    }
    reply_id = sanitize((req.body.replyid.toString()).split(' ').join(''));
    hash = crypto.createHash('sha512').update(reply_id).digest('hex')
    module.exports.db.connection.models.Lookup.findOne({
      lookup_hash: hash
    }, function(err, docs_lookup) {
      if (!docs_lookup) {
        res.send({});
      } else {
        // TODO var key = decrypt(docs_lookup['decryption_key'], server_key)
        module.exports.db.connection.models.Replie.find({
          lookup_hash: hash
        }, function(err, docs_reply) {
          if (!docs_reply) {
            res.send({});
          } else {
            /*
            // TODO Decrypt all messages with var key and sort by time 
            var messages = [];
            for (var i = 0; i < docs_reply.length; i++) {
              var date = new Date(docs[i]['time']),
                  month = ('0' + (date.getUTCMonth() + 1)).slice(-2),
                  day = ('0' + date.getUTCDate()).slice(-2),
                  year = date.getUTCFullYear(),
                  hour = ('0' + date.getUTCHours()).slice(-2),
                  minute = ('0' + date.getUTCMinutes()).slice(-2),
                  second = ('0' + date.getUTCSeconds()).slice(-2),
                  datetime_stamp = (year + '-' + month + '-' + day + ':' +
                                    hour + ':' + minute + ':' + second +
                                    ' UTC')
              var full_message = decrypt(docs_reply[i]['message'], key);
              var reply_data = {
                subject: get_subject(full_message),
                message: get_message(full_message),
                time: datetime_stamp,
                timestamp: docs_reply[i]['time']
              };
              replies.push(reply_data);
            }
            replies.sort(function(a, b) {
              return a.timestamp - b.timestamp;
            });
            res.render('reply', {'replies': replies});
            */
          }
        });
      }
    });
  });
};
