// Create web server
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var file = "comments.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create table if it does not exist
db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE Comments (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, comment TEXT)");
  }
});

// Get all comments
app.get('/comments', function(req, res) {
  db.all("SELECT id, name, comment FROM Comments", function(err, rows) {
    res.json(rows);
  });
});

// Add a new comment
app.post('/comments', function(req, res) {
  db.run("INSERT INTO Comments (name, comment) VALUES (?, ?)", [req.body.name, req.body.comment], function(err, row) {
    res.json({ id: this.lastID });
  });
});

// Delete a comment
app.delete('/comments/:id', function(req, res) {
  db.run("DELETE FROM Comments WHERE id = ?", req.params.id, function(err, row) {
    res.json({ id: req.params.id });
  });
});

// Start server
var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});