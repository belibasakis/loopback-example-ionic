module.exports = function(Tweet) {
  Tweet.greet = function (msg, cb) {
    cb(null, 'Greetings...' + msg);
  }

  Tweet.remoteMethod(
    'greet',
    {
      accepts: {arg: 'msg', type: 'string'},
      returns: {arg: 'greeting', type: 'string'}
    }
  )
};
