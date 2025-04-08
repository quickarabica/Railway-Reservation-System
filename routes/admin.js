const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./railway.db');
const bcrypt = require('bcrypt');


// View all users
router.get('/users', (req, res) => {
  db.all("SELECT * FROM User", [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.render('admin/users', { users: rows });
  });
});

// Add new user
router.post('/users/add', async (req, res) => {
    const { username, email, password, phone } = req.body;
    db.get(`SELECT * FROM User WHERE Email = ?`, [email], async (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Internal error');
      }
  
      if (row) {
        // Email already exists
        return res.send('<script>alert("Email already exists!"); window.location.href="/admin/users";</script>');
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
  
        db.run(
          `INSERT INTO User (Username, Email, PasswordHash, PhoneNumber) VALUES (?, ?, ?, ?)`,
          [username, email, hashedPassword, phone || null],
          function (err) {
            if (err) {
              console.error(err.message);
              res.status(500).send('Error adding user');
            } else {
              res.redirect('/admin/users');
            }
          }
        );
      }
    });
  });
// Delete user
router.post('/users/delete/:id', (req, res) => {
    const userId = req.params.id;
  
    db.run(`DELETE FROM User WHERE UserID = ?`, [userId], function (err) {
      if (err) {
        console.error('Error deleting user:', err.message);
        return res.status(500).send('Error deleting user');
      }
      res.redirect('/admin/users');
    });
  });

module.exports = router;
