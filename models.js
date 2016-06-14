exports = module.exports = function(app, mongoose) {
  require('./schema/Message')(app, mongoose);
  require('./schema/Lookup')(app, mongoose);
  require('./schema/Replie')(app, mongoose);
};
