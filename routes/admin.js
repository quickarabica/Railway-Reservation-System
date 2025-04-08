const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./railway.db');


router.get('/', (req, res) => {
  res.render('admin/dashboard');
});

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
        db.run(
          `INSERT INTO User (Username, Email, Password, PhoneNumber) VALUES (?, ?, ?, ?)`,
          [username, email, password, phone || null],
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

  router.post('/users/edit/:id', (req, res) => {
    const { username, email, phone, password } = req.body;
    const userId = req.params.id;
  
    db.run(
      `UPDATE User SET Username = ?, Email = ?, PhoneNumber = ?, Password = ? WHERE UserID = ?`,
      [username, email, phone || null, password, userId],
      function (err) {
        if (err) {
          console.error('Error updating user:', err.message);
          return res.status(500).send('Error updating user');
        }
        res.redirect('/admin/users');
      }
    );
  });
  

// example for stations
router.get('/stations', async (req, res) => {
  db.all("SELECT * FROM Station", (err, rows) => {
    res.render("admin/stations", { stations: rows });
  });
});

router.post('/stations/add', (req, res) => {
  const { StationName, StationCode, City } = req.body;
  db.run("INSERT INTO Station (StationName, StationCode, City) VALUES (?, ?, ?)", [StationName, StationCode, City], (err) => {
    res.redirect('/admin/stations');
  });
});

router.post('/stations/delete/:id', (req, res) => {
  db.run("DELETE FROM Station WHERE StationID = ?", [req.params.id], (err) => {
    res.redirect('/admin/stations');
  });
});

router.post('/stations/edit/:id', (req, res) => {
  const { StationName, StationCode, City } = req.body;
  const stationId = req.params.id;

  db.run(
    `UPDATE Station SET StationName = ?, StationCode = ?, City = ? WHERE StationID = ?`,
    [StationName, StationCode, City, stationId],
    (err) => {
      if (err) {
        console.error('Error updating station:', err.message);
        return res.status(500).send('Failed to update station');
      }
      res.redirect('/admin/stations');
    }
  );
});


// GET all trains
router.get('/trains', (req, res) => {
  db.all("SELECT * FROM Train", (err, rows) => {
    if (err) return res.send("Error fetching trains.");
    res.render("admin/trains", { trains: rows });
  });
});

// ADD a new train
router.post('/trains/add', (req, res) => {
  const { TrainNumber, TrainName, TrainType } = req.body;
  db.run("INSERT INTO Train (TrainNumber, TrainName, TrainType) VALUES (?, ?, ?)",
    [TrainNumber, TrainName, TrainType], (err) => {
      if (err) return res.send("Train number must be unique.");
      res.redirect('/admin/trains');
    });
});

// DELETE a train
router.post('/trains/delete/:id', (req, res) => {
  db.run("DELETE FROM Train WHERE TrainID = ?", [req.params.id], (err) => {
    res.redirect('/admin/trains');
  });
});

// EDIT a train (update existing)
router.post('/trains/edit/:id', (req, res) => {
  const { TrainNumber, TrainName, TrainType } = req.body;
  db.run("UPDATE Train SET TrainNumber = ?, TrainName = ?, TrainType = ? WHERE TrainID = ?",
    [TrainNumber, TrainName, TrainType, req.params.id], (err) => {
      res.redirect('/admin/trains');
    });
});

// GET all schedules with Train and Route info
router.get('/schedules', (req, res) => {
  db.all(`SELECT s.*, t.TrainName, r.SourceStationID, r.DestinationStationID 
          FROM Schedule s
          JOIN Train t ON s.TrainID = t.TrainID
          JOIN Route r ON s.RouteID = r.RouteID`, (err, schedules) => {
    if (err) return res.send("Error fetching schedules.");

    db.all("SELECT * FROM Train", (err1, trains) => {
      db.all("SELECT * FROM Route", (err2, routes) => {
        if (err1 || err2) return res.send("Error loading train/route data.");
        res.render("admin/schedules", { schedules, trains, routes });
      });
    });
  });
});

// ADD a schedule
router.post('/schedules/add', (req, res) => {
  const { TrainID, RouteID, DepartureTime, ArrivalTime, TotalSeats } = req.body;
  db.run(`INSERT INTO Schedule (TrainID, RouteID, DepartureTime, ArrivalTime, TotalSeats)
          VALUES (?, ?, ?, ?, ?)`,
    [TrainID, RouteID, DepartureTime, ArrivalTime, TotalSeats], (err) => {
      if (err) return res.send("Failed to add schedule.");
      res.redirect('/admin/schedules');
    });
});

// DELETE a schedule
router.post('/schedules/delete/:id', (req, res) => {
  db.run("DELETE FROM Schedule WHERE ScheduleID = ?", [req.params.id], (err) => {
    res.redirect('/admin/schedules');
  });
});

// EDIT a schedule
router.post('/schedules/edit/:id', (req, res) => {
  const { TrainID, RouteID, DepartureTime, ArrivalTime, TotalSeats } = req.body;
  db.run(`UPDATE Schedule SET TrainID = ?, RouteID = ?, DepartureTime = ?, ArrivalTime = ?, TotalSeats = ?
          WHERE ScheduleID = ?`,
    [TrainID, RouteID, DepartureTime, ArrivalTime, TotalSeats, req.params.id], (err) => {
      res.redirect('/admin/schedules');
    });
});

// View all routes
router.get('/routes', (req, res) => {
  db.all("SELECT * FROM Route", (err, routes) => {
    db.all("SELECT * FROM Station", (err2, stations) => {
      if (err || err2) return res.send("Error loading route/station data");
      res.render("admin/routes", { routes, stations });
    });
  });
});

// Add Route
router.post('/routes/add', (req, res) => {
  const { SourceStationID, DestinationStationID, Distance } = req.body;
  db.run(`INSERT INTO Route (SourceStationID, DestinationStationID, Distance) VALUES (?, ?, ?)`,
    [SourceStationID, DestinationStationID, Distance], () => res.redirect('/admin/routes'));
});

// Edit Route
router.post('/routes/edit/:id', (req, res) => {
  const { SourceStationID, DestinationStationID, Distance } = req.body;
  db.run(`UPDATE Route SET SourceStationID = ?, DestinationStationID = ?, Distance = ? WHERE RouteID = ?`,
    [SourceStationID, DestinationStationID, Distance, req.params.id], () => res.redirect('/admin/routes'));
});

// Delete Route
router.post('/routes/delete/:id', (req, res) => {
  db.run("DELETE FROM Route WHERE RouteID = ?", [req.params.id], () => res.redirect('/admin/routes'));
});

// View all bookings
router.get('/bookings', (req, res) => {
  db.all(`SELECT b.*, u.Username, s.DepartureTime
          FROM Booking b
          JOIN User u ON b.UserID = u.UserID
          JOIN Schedule s ON b.ScheduleID = s.ScheduleID`, (err, bookings) => {
    db.all("SELECT * FROM User", (e1, users) => {
      db.all("SELECT * FROM Schedule", (e2, schedules) => {
        if (err || e1 || e2) return res.send("Error loading booking data");
        res.render("admin/bookings", { bookings, users, schedules });
      });
    });
  });
});

// Add Booking
router.post('/bookings/add', (req, res) => {
  const { UserID, ScheduleID, Status, TotalFare } = req.body;
  db.run(`INSERT INTO Booking (UserID, ScheduleID, Status, TotalFare)
          VALUES (?, ?, ?, ?)`, [UserID, ScheduleID, Status, TotalFare], () => {
    res.redirect('/admin/bookings');
  });
});

// Edit Booking
router.post('/bookings/edit/:id', (req, res) => {
  const { UserID, ScheduleID, Status, TotalFare } = req.body;
  db.run(`UPDATE Booking SET UserID = ?, ScheduleID = ?, Status = ?, TotalFare = ?
          WHERE BookingID = ?`, [UserID, ScheduleID, Status, TotalFare, req.params.id], () => {
    res.redirect('/admin/bookings');
  });
});

// Delete Booking
router.post('/bookings/delete/:id', (req, res) => {
  db.run("DELETE FROM Booking WHERE BookingID = ?", [req.params.id], () => {
    res.redirect('/admin/bookings');
  });
});

module.exports = router;
