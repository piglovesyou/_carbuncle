
module.exports = {
  promiseHandleError: function (res) {
    return function (error) {
      console.log(error.stack);
      res.json({error: error, stack: error.stack});
    }
  }
}
