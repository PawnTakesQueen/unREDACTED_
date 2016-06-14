module.exports.replieEndpoint = function(app, module) {
  //get rows from the database
  app.post('/reply', function(req, res) {
    reply_id = sanitize((req.body.replyid.toString()).split(' ').join(''));
    hash = crypto.createHash('sha512').update(reply_id).digest('hex')
    module.exports.db.connection.models.Lookup.findOne({
      lookup_hash: hash
    }, function(err, docs_lookup) {
      if (!docs) {
        res.send({});
      } else {
        // TODO var key = decrypt(docks_lookup['decryption_key'], server_key)
        module.exports.db.connection.models.Replie.find({
          lookup_hash: hash
        }, function(err, docs_reply) {
          if (!docs) {
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
