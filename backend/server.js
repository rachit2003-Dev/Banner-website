const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors({
  origin: 'https://banner-website.netlify.app',
}));
const mysql = require('mysql2');

const app = express();
const port = 9090;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12725296',
  password: 'he5tvpJzUF',
  database: 'sql12725296'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Database connected');
});

app.get('/api/banner/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM banner WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching banner data:', err);
      res.status(500).send('Error fetching banner data');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Banner not found');
      return;
    }
    res.json(results[0]);
  });
});

app.post('/api/updateBanner', (req, res) => {
  const { id, description, timer, link, isVisible } = req.body;
  if (!id) {
    res.status(400).send('ID is required to update the banner');
    return;
  }

  db.query('SELECT * FROM banner WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error checking banner existence:', err);
      res.status(500).send('Error checking banner existence');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Banner not found');
      return;
    }

    db.query(
      'UPDATE banner SET description = ?, timer = ?, link = ?, isVisible = ? WHERE id = ?',
      [description, timer, link, isVisible, id],
      (err, results) => {
        if (err) {
          console.error('Error updating banner:', err);
          res.status(500).send('Error updating banner');
          return;
        }
        res.json({ id, description, timer, link, isVisible });
      }
    );
  });
});

app.post('/api/addBanner', (req, res) => {
  const { description, timer, link } = req.body;
  db.query(
    'INSERT INTO banner (description, timer, link, isVisible) VALUES (?, ?, ?, ?)',
    [description, timer, link, true],
    (err, results) => {
      if (err) {
        console.error('Error adding banner:', err);
        res.status(500).send('Error adding banner');
        return;
      }
      res.json({ id: results.insertId, description, timer, link, isVisible: true });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
