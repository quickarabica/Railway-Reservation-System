CREATE TABLE IF NOT EXISTS User (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(15),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Station (
    StationID INTEGER PRIMARY KEY AUTOINCREMENT,
    StationName VARCHAR(100) NOT NULL,
    StationCode VARCHAR(10) UNIQUE NOT NULL,
    City VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Train (
    TrainID INTEGER PRIMARY KEY AUTOINCREMENT,
    TrainNumber VARCHAR(20) UNIQUE NOT NULL,
    TrainName VARCHAR(100) NOT NULL,
    TrainType VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Route (
    RouteID INTEGER PRIMARY KEY AUTOINCREMENT,
    SourceStationID INTEGER NOT NULL,
    DestinationStationID INTEGER NOT NULL,
    Distance DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (SourceStationID) REFERENCES Station(StationID),
    FOREIGN KEY (DestinationStationID) REFERENCES Station(StationID)
);

CREATE TABLE IF NOT EXISTS Schedule (
    ScheduleID INTEGER PRIMARY KEY AUTOINCREMENT,
    TrainID INTEGER NOT NULL,
    RouteID INTEGER NOT NULL,
    DepartureTime DATETIME NOT NULL,
    ArrivalTime DATETIME NOT NULL,
    TotalSeats INTEGER NOT NULL CHECK (TotalSeats >= 0),
    FOREIGN KEY (TrainID) REFERENCES Train(TrainID),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID)
);

CREATE TABLE IF NOT EXISTS Booking (
    BookingID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER NOT NULL,
    ScheduleID INTEGER NOT NULL,
    BookingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) DEFAULT 'Pending',
    TotalFare DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (ScheduleID) REFERENCES Schedule(ScheduleID)
);

-- Sample data
INSERT INTO Station (StationName, StationCode, City) VALUES 
('Howrah Junction', 'HWH', 'Kolkata'),
('Sealdah', 'SDAH', 'Kolkata'),
('New Delhi', 'NDLS', 'Delhi'),
('Kanpur Central', 'CNB', 'Kanpur'),
('Mumbai CST', 'CSTM', 'Mumbai'),
('Chennai Central', 'MAS', 'Chennai'),
('Bangalore City', 'SBC', 'Bangalore'),
('Hyderabad Deccan', 'HYB', 'Hyderabad');

INSERT INTO Train (TrainNumber, TrainName, TrainType) VALUES 
('12301', 'Rajdhani Express', 'Express'),
('12841', 'Coromandel Express', 'Express'),
('12627', 'Karnataka Express', 'Express'),
('12101', 'Jnaneswari Super Deluxe', 'Superfast'),
('12723', 'Telangana Express', 'Superfast');


INSERT INTO Route (SourceStationID, DestinationStationID, Distance) VALUES 
(1, 3, 1450.0),  -- Howrah to New Delhi
(3, 5, 1380.0),  -- New Delhi to Mumbai
(6, 7, 360.0),   -- Chennai to Bangalore
(1, 4, 1000.0),  -- Howrah to Kanpur
(8, 3, 1660.0);  -- Hyderabad to New Delhi


INSERT INTO Schedule (TrainID, RouteID, DepartureTime, ArrivalTime, TotalSeats) VALUES 
(1, 1, '2025-04-06 17:00:00', '2025-04-07 10:00:00', 500),  -- Rajdhani Express
(2, 4, '2025-04-06 14:00:00', '2025-04-07 06:00:00', 450),  -- Coromandel Express
(3, 3, '2025-04-05 07:00:00', '2025-04-05 14:30:00', 400),  -- Karnataka Express
(4, 2, '2025-04-06 20:00:00', '2025-04-07 16:00:00', 550),  -- Jnaneswari Super Deluxe
(5, 5, '2025-04-07 06:00:00', '2025-04-08 04:00:00', 480);  -- Telangana Express
