module.exports = function(req, res, err) {
  console.error('Request: ' + req.path + ' error: ' + err);
  res.status(500).send('Something broke!');
};
