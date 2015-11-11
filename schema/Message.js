exports = module.exports = function(app, mongoose) {
  //This creates the Message Collection
  var messageSchema = new mongoose.Schema({
    id_pgp: {type: String},
    message: {type: String},
    time: {type: Date, default: Date.now},
  });
  //Form index on the _id field
  messageSchema.index({ _id: 1 });
  messageSchema.set('autoIndex', (app.get('env') === 'development'));
  var Message = app.db.model('Message', messageSchema);
};
