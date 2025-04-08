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
('Hyderabad Deccan', 'HYB', 'Hyderabad'),
('Patna Junction', 'PNBE', 'Patna'),
('Lucknow Charbagh', 'LKO', 'Lucknow'),
('Varanasi Junction', 'BSB', 'Varanasi'),
('Ahmedabad Junction', 'ADI', 'Ahmedabad'),
('Bhopal Junction', 'BPL', 'Bhopal'),
('Pune Junction', 'PUNE', 'Pune'),
('Nagpur Junction', 'NGP', 'Nagpur'),
('Vijayawada Junction', 'BZA', 'Vijayawada'),
('Visakhapatnam', 'VSKP', 'Visakhapatnam'),
('Thiruvananthapuram Central', 'TVC', 'Thiruvananthapuram'),
('Jaipur Junction', 'JP', 'Jaipur'),
('Guwahati', 'GHY', 'Guwahati'),
('Amritsar Junction', 'ASR', 'Amritsar'),
('Surat', 'ST', 'Surat'),
('Jammu Tawi', 'JAT', 'Jammu'),
('Coimbatore Junction', 'CBE', 'Coimbatore'),
('Raipur Junction', 'R', 'Raipur'),
('Ranchi Junction', 'RNC', 'Ranchi'),
('Gwalior', 'GWL', 'Gwalior'),
('Jodhpur Junction', 'JU', 'Jodhpur'),
('Madurai Junction', 'MDU', 'Madurai'),
('Hubli Junction', 'UBL', 'Hubballi');


INSERT INTO Train (TrainNumber, TrainName, TrainType) VALUES 
('12301', 'Rajdhani Express', 'Express'),
('12841', 'Coromandel Express', 'Express'),
('12627', 'Karnataka Express', 'Express'),
('12101', 'Jnaneswari Super Deluxe', 'Superfast'),
('12723', 'Telangana Express', 'Superfast'),
('12245', 'Howrah Duronto Express', 'Superfast'),
('12430', 'New Delhi Rajdhani Express', 'Express'),
('12951', 'Mumbai Rajdhani Express', 'Superfast'),
('12615', 'Grand Trunk Express', 'Express'),
('12305', 'Kolkata Rajdhani', 'Superfast'),
('12903', 'Golden Temple Mail', 'Express'),
('12621', 'Tamil Nadu Express', 'Superfast'),
('12611', 'Chennai Express', 'Superfast'),
('12953', 'August Kranti Rajdhani', 'Superfast'),
('12296', 'Sanghamitra Express', 'Express'),
('12833', 'Ahmedabad Express', 'Superfast'),
('12791', 'Secunderabad Patna Express', 'Express'),
('12909', 'Bandra Garib Rath', 'Superfast'),
('12229', 'Lucknow Mail', 'Express'),
('22823', 'Puri Shatabdi Express', 'Superfast'),
('12565', 'Bihar Sampark Kranti', 'Superfast'),
('12487', 'Seemanchal Express', 'Superfast'),
('12477', 'Swaraj Express', 'Superfast'),
('12643', 'Thirukkural Express', 'Superfast'),
('12695', 'Bangalore Rajdhani Express', 'Superfast');



INSERT INTO Route (SourceStationID, DestinationStationID, Distance) VALUES 
(1, 3, 1450.0),   -- Howrah to New Delhi
(3, 5, 1380.0),   -- New Delhi to Mumbai
(6, 7, 360.0),    -- Chennai to Bangalore
(1, 4, 1000.0),   -- Howrah to Kanpur
(8, 3, 1660.0),   -- Hyderabad to New Delhi
(2, 5, 1920.0),   -- Sealdah to Mumbai
(3, 14, 1330.0),  -- New Delhi to Bhopal
(3, 10, 500.0),   -- New Delhi to Lucknow
(5, 12, 530.0),   -- Mumbai to Ahmedabad
(12, 13, 780.0),  -- Ahmedabad to Bhopal
(14, 15, 780.0),  -- Bhopal to Nagpur
(6, 18, 770.0),   -- Chennai to Thiruvananthapuram
(3, 19, 270.0),   -- New Delhi to Jaipur
(20, 3, 1890.0),  -- Guwahati to New Delhi
(3, 22, 580.0),   -- New Delhi to Jammu Tawi
(6, 24, 500.0),   -- Chennai to Coimbatore
(24, 29, 340.0),  -- Coimbatore to Madurai
(29, 6, 460.0),   -- Madurai to Chennai
(5, 13, 800.0),   -- Mumbai to Bhopal
(14, 3, 730.0),   -- Bhopal to New Delhi
(25, 3, 1210.0),  -- Raipur to New Delhi
(26, 1, 400.0),   -- Ranchi to Howrah
(27, 3, 320.0),   -- Gwalior to New Delhi
(28, 19, 560.0),  -- Jodhpur to Jaipur
(17, 6, 820.0);   -- Visakhapatnam to Chennai



INSERT INTO Schedule (TrainID, RouteID, DepartureTime, ArrivalTime, TotalSeats) VALUES 
(1, 1, '2025-04-06 17:00:00', '2025-04-07 10:00:00', 500),  -- Rajdhani Express
(2, 4, '2025-04-06 14:00:00', '2025-04-07 06:00:00', 450),  -- Coromandel Express
(3, 3, '2025-04-05 07:00:00', '2025-04-05 14:30:00', 400),  -- Karnataka Express
(4, 2, '2025-04-06 20:00:00', '2025-04-07 16:00:00', 550),  -- Jnaneswari Super Deluxe
(5, 5, '2025-04-07 06:00:00', '2025-04-08 04:00:00', 480),  -- Telangana Express
(6, 6, '2025-04-08 06:45:00', '2025-04-09 01:00:00', 480),  -- Howrah Duronto Express
(7, 7, '2025-04-08 09:00:00', '2025-04-08 19:30:00', 520),  -- New Delhi Rajdhani Express
(8, 8, '2025-04-09 05:30:00', '2025-04-09 13:30:00', 500),  -- Mumbai Rajdhani Express
(9, 9, '2025-04-10 06:15:00', '2025-04-10 18:30:00', 470),  -- Grand Trunk Express
(10, 10, '2025-04-11 07:00:00', '2025-04-11 19:45:00', 450),-- Kolkata Rajdhani
(11, 11, '2025-04-11 08:30:00', '2025-04-12 00:30:00', 430),-- Golden Temple Mail
(12, 12, '2025-04-11 13:00:00', '2025-04-12 06:45:00', 490),-- Tamil Nadu Express
(13, 13, '2025-04-12 09:00:00', '2025-04-13 02:00:00', 520),-- Chennai Express
(14, 14, '2025-04-12 18:00:00', '2025-04-13 08:00:00', 460),-- August Kranti Rajdhani
(15, 15, '2025-04-13 06:00:00', '2025-04-13 23:00:00', 470),-- Sanghamitra Express
(16, 16, '2025-04-13 10:00:00', '2025-04-14 03:30:00', 400),-- Ahmedabad Express
(17, 17, '2025-04-13 13:00:00', '2025-04-14 13:30:00', 410),-- Secunderabad Patna Express
(18, 18, '2025-04-14 05:30:00', '2025-04-14 14:00:00', 500),-- Bandra Garib Rath
(19, 19, '2025-04-14 07:00:00', '2025-04-14 16:00:00', 480),-- Lucknow Mail
(20, 20, '2025-04-14 08:30:00', '2025-04-14 18:00:00', 430),-- Puri Shatabdi Express
(21, 21, '2025-04-14 10:00:00', '2025-04-14 21:30:00', 470),-- Bihar Sampark Kranti
(22, 22, '2025-04-14 17:00:00', '2025-04-15 07:00:00', 490),-- Seemanchal Express
(23, 23, '2025-04-15 06:30:00', '2025-04-15 18:30:00', 460),-- Swaraj Express
(24, 24, '2025-04-15 09:45:00', '2025-04-15 22:15:00', 450),-- Thirukkural Express
(25, 25, '2025-04-15 20:00:00', '2025-04-16 09:00:00', 520);-- Bangalore Rajdhani Express
