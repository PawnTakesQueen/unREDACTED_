var local_crypto = require('../modules/local_crypto.js'),
    crypto = require('crypto'),
    fs = require('fs');


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
        res.render('reply', {'noreply': true});
      } else {
        // Server's decryption key for encrypted database files
        var server_key = new Buffer(fs.readFileSync('./key.txt')
          .toString(), 'hex');
        // Decrypt reply's key
        var key = new Buffer(local_crypto.aesdecrypt(
          docs_lookup['decryption_key'], server_key), 'hex');
        module.exports.db.connection.models.Replie.find({
          lookup_hash: hash
        }, function(err, docs_reply) {
          if (docs_reply.length == 0) {
            res.render('reply', {'noreply': true});
          } else {
            var replies = [];
            for (var i = 0; i < docs_reply.length; i++) {
              var date = new Date(docs_reply[i]['time']),
                  month = ('0' + (date.getUTCMonth() + 1)).slice(-2),
                  day = ('0' + date.getUTCDate()).slice(-2),
                  year = date.getUTCFullYear(),
                  hour = ('0' + date.getUTCHours()).slice(-2),
                  minute = ('0' + date.getUTCMinutes()).slice(-2),
                  second = ('0' + date.getUTCSeconds()).slice(-2),
                  datetime_stamp = (year + '-' + month + '-' + day + ' ' +
                                    hour + ':' + minute + ':' + second +
                                    ' UTC')
              var full_message = local_crypto.aesdecrypt(
                docs_reply[i]['message'], key);
              var reply_data = {
                message: full_message,
                author: docs_reply[i]['author'],
                time: datetime_stamp,
                timestamp: docs_reply[i]['time']
              };
              replies.push(reply_data);
            }
            replies.sort(function(a, b) {
              return a.timestamp - b.timestamp;
            });
            res.render('reply', {'replies': replies});
          }
        });
      }
    });
  });
};
