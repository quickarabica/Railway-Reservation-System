const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const fs=require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Session setup
app.use(session({
    secret: 'your_secret_key_here', // Change this to a secure key
    resave: false,
    saveUninitialized: false
}));

// Database connection
// Connect to the database (creates railway.db if it doesn't exist)
const db = new sqlite3.Database('railway.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database.');

        // Read SQL file
        const sql = fs.readFileSync('database.sql', 'utf8');

        // Execute SQL commands
        db.exec(sql, (err) => {
            if (err) {
                console.error('Error executing SQL file:', err.message);
            } else {
                console.log('Database initialized successfully from database.sql');
            }

        });
    }
});

// Homepage
app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'views', 'index.html'));
});

// Register page
app.get('/register', (req, res) => {
    res.render(path.join(__dirname, 'views', 'register.html'));
});

app.post('/register', async (req, res) => {
    const { username, email, password, phone } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    db.run(
        `INSERT INTO User (Username, Email, PasswordHash, PhoneNumber) VALUES (?, ?, ?, ?)`,
        [username, email, passwordHash, phone],
        (err) => {
            if (err) {
                console.error(err.message);
                return res.send('Error registering user.');
            }
            res.redirect('/login');
        }
    );
});

// Login page
app.get('/login', (req, res) => {
    res.render(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM User WHERE Email = ?`, [email], async (err, user) => {
        if (err || !user || !(await bcrypt.compare(password, user.PasswordHash))) {
            return res.send('Invalid credentials.');
        }
        req.session.userId = user.UserID;
        res.redirect('/search');
    });
});

// Search trains
app.get('/search', (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    res.render(path.join(__dirname, 'views', 'search.html'));
});

  
app.get('/stations', (req, res) => {
    db.query('SELECT StationName FROM Station', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/search', (req, res) => {
    const { source, destination, date } = req.body;
    console.log('Search params:', source, destination, date);
    db.all(`
        SELECT s.ScheduleID, t.TrainName, t.TrainNumber, 
               src.StationName AS Source, dest.StationName AS Dest,
               s.DepartureTime, s.ArrivalTime, s.TotalSeats
        FROM Schedule s
        JOIN Train t ON s.TrainID = t.TrainID
        JOIN Route r ON s.RouteID = r.RouteID
        JOIN Station src ON r.SourceStationID = src.StationID
        JOIN Station dest ON r.DestinationStationID = dest.StationID
        WHERE UPPER(src.StationName) = UPPER(?) AND UPPER(dest.StationName) = UPPER(?) AND DATE(s.DepartureTime) = ?`,
        [source, destination, date],
        (err, rows) => {
            if (err) {
                console.error('DB Error:', err);
                return res.status(500).send('Error searching trains.');
            }
            res.json(rows);
        }
    );
});

// Booking page
app.get('/booking/:scheduleId', (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    const { scheduleId } = req.params;
    db.get(`
        SELECT s.*, t.TrainName, src.StationName AS Source, dest.StationName AS Dest
        FROM Schedule s
        JOIN Train t ON s.TrainID = t.TrainID
        JOIN Route r ON s.RouteID = r.RouteID
        JOIN Station src ON r.SourceStationID = src.StationID
        JOIN Station dest ON r.DestinationStationID = dest.StationID
        WHERE s.ScheduleID = ?`, 
        [scheduleId], 
        (err, row) => {
            if (err || !row) return res.send('Invalid schedule.');
            res.render(path.join(__dirname, 'views', 'booking.html'), { schedule: row });
        }
    );
});

app.post('/booking', (req, res) => {
    const { scheduleId, passengers } = req.body;
    const userId = req.session.userId;
    const totalFare = passengers * 50; // Simplified fare calculation

    db.run(
        `INSERT INTO Booking (UserID, ScheduleID, TotalFare, Status) VALUES (?, ?, ?, 'Confirmed')`,
        [userId, scheduleId, totalFare],
        function(err) {
            if (err) return res.send('Error booking.');
            res.send(`Booking confirmed! Booking ID: ${this.lastID}`);
        }
    );
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.set('view engine', 'ejs');
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);
// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});