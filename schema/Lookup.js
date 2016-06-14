exports = module.exports = function(app, mongoose) {
  //This creates the Lookup Collection
  var lookupSchema = new mongoose.Schema({
    lookup_hash: {type: String},
    decryption_key: {type: String}
  });
  //Form index on the _id field
  lookupSchema.index({_id: 1});
  lookupSchema.set('autoIndex', (app.get('env') === 'development'));
  var Lookup = app.db.model('Lookup', lookupSchema);
};
