function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
}

module.exports.replieEndpoint = function(app, module ) {
  //get rows from the database
  app.get('/api/replies/:lookup', function(req, res) {
    module.exports.db.models.Replie.findOne({lookup: req.params.lookup}, function(err, docs) {
      res.send({message: req.body['message'], time: req.body['time']});
    });
  });
};
