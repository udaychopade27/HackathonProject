// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./rds-config'); // Import the RDS configuration

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/form.html'));
});

// Insert data
app.post('/insert', (req, res) => {
  const { name, address, phone } = req.body;
  const sql = 'INSERT INTO students (name, address, phone) VALUES (?, ?, ?)';
  db.query(sql, [name, address, phone], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    } else {
      console.log('Data inserted successfully');
      res.redirect('/');
    }
  });
});

// Delete data
app.post('/delete', (req, res) => {
  const { name } = req.body;
  const sql = 'DELETE FROM students WHERE name = ?';
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      res.status(500).send('Error deleting data');
    } else {
      console.log('Data deleted successfully');
      res.redirect('/');
    }
  });
});

// View student names
app.get('/students', (req, res) => {
  const sql = 'SELECT name FROM students';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      res.status(500).send('Error fetching students');
    } else {
      let html = '<h1>Student Names</h1><ul>';
      results.forEach(student => {
        html += `<li>${student.name}</li>`;
      });
      html += '</ul><button onclick="window.location.href=\'/\'">Back to Home</button>';
      res.send(html);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

