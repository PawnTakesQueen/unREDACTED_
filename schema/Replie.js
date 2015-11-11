exports = module.exports = function(app, mongoose) {
  //This creates the Replie Collection
  var replieSchema = new mongoose.Schema({
    lookup: {type: String},
    message: {type: String},
    time: {type: Date, default: Date.now},
  });
  //Form index on the _id field
  replieSchema.index({ _id: 1 });
  replieSchema.set('autoIndex', (app.get('env') === 'development'));
  var Replie = app.db.model('Replie', replieSchema);
};
