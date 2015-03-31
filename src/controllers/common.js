
module.exports = {
  promiseHandleError: function (res) {
    return function (error) {
      res.json({error: error, stack: error.stack});
    }
  }
}
