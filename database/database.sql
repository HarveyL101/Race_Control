-- Up

-- **CREATE STATEMENTS** --

-- Race Locations Table --
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    postcode VARCHAR(7)
);

INSERT INTO locations (name, city, postcode) 
VALUES 
  ('Abington Park', 'Northampton', 'NN3 3HX'),
  ('Upton Park', 'Northampton', 'NN5 4EQ'),
  ('Southsea Common', 'Portsmouth', 'PO5 3LR'),
  ('Hyde Park', 'London', 'W2 2UH');


-- Races Table --
CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    start_time VARCHAR(8) NOT NULL,
    distance FLOAT NOT NULL,
    interval VARCHAR(8) NOT NULL,
    location_id INT NOT NULL,

    FOREIGN KEY (location_id) REFERENCES locations(id)
);

INSERT INTO races (name, date, start_time, distance, interval, location_id)
VALUES
    ('City Marathon', '2025-06-15', '08:00:00', 4.0, '00:40:00', 1),
    ('Spring Sprint', '2025-04-10', '09:30:00', 5.0, '00:40:00', 2),
    ('River Run', '2025-07-20', '07:00:00', 6.0, '00:40:00', 1),
    ('Beachside Race', '2025-08-05', '06:45:00', 4.0, '00:40:00', 3),
    ('Downtown Dash', '2025-09-12', '08:15:00', 5.0, '00:40:00', 2),
    ('Harbor Hustle', '2025-10-03', '07:30:00', 6.0, '00:40:00', 3),
    ('Forest 5K', '2025-03-22', '08:00:00', 5.0, '00:40:00', 1),
    ('Twilight Trot', '2025-11-15', '17:45:00', 4.0, '00:40:00', 2),
    ('Sunrise Sprint', '2025-05-01', '06:00:00', 3.5, '00:40:00', 4),
    ('Capital Run', '2025-07-04', '09:00:00', 7.0, '00:40:00', 4),
    ('Seaside Stride', '2025-08-19', '08:30:00', 4.0, '00:40:00', 3),
    ('Park Pace', '2025-06-11', '09:15:00', 5.0, '00:40:00', 1),
    ('Hilltop Hustle', '2025-09-29', '07:00:00', 6.2, '00:40:00', 2),
    ('Autumn Dash', '2025-10-18', '08:45:00', 8.0, '00:40:00', 1),
    ('Midtown Mile', '2025-04-25', '10:00:00', 3.0, '00:40:00', 2),
    ('Greenway Gallop', '2025-05-30', '07:30:00', 7.5, '00:40:00', 1),
    ('Lakeside Loop', '2025-07-12', '08:00:00', 9.0, '00:40:00', 3),
    ('City Circuit', '2025-06-22', '08:00:00', 4.0, '00:40:00', 4),
    ('Riverside Rush', '2025-08-10', '06:45:00', 6.5, '00:40:00', 3),
    ('Night Run', '2025-11-01', '20:30:00', 5.0, '00:40:00', 2),
    ('Urban Ultra', '2025-12-05', '07:00:00', 7.5, '00:40:00', 4),
    ('Winter Race', '2025-12-15', '09:00:00', 4.0, '00:40:00', 1),
    ('Metro Marathon', '2025-03-10', '07:30:00', 4.5, '00:40:00', 4),
    ('Civic Center Sprint', '2025-04-02', '08:00:00', 5.0, '00:40:00', 2),
    ('Civic Center Blitz', '2025-04-02', '08:00:00', 5.0, '00:00:10', 2),
    ('Frostbite Run', '2025-01-14', '08:30:00', 6.0, '00:40:00', 1);

-- Runners Table -- 
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    is_admin INTEGER NOT NULL -- 0 and 1 will be used due to the lack of a native BOOLEAN data type in sqlite
);

-- Table of users --
INSERT INTO users (username, password, is_admin) 
VALUES 
    ('admin', 'admin', 1),
    ('RichBTiscuits', 'GoAt_1', 0),
    ('Datt_Mennis12', 'GoAt_2', 0),
    ('Kirst_Stew', 'GoAt_3', 0);

-- Table for final results of a race when the number of runners falls to 1
CREATE TABLE IF NOT EXISTS race_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    race_id INTEGER NOT NULL,
    runner_id INTEGER NOT NULL,
    username VARCHAR(30) NOT NULL,

    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (runner_id) REFERENCES users(id)
);

-- Table for checkpoint results --
CREATE TABLE IF NOT EXISTS lap_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    race_id INTEGER NOT NULL,
    lap_number INTEGER NOT NULL,
    runner_id INTEGER NOT NULL,
    time VARCHAR(8) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (runner_id) REFERENCES users(id),
    UNIQUE (race_id, lap_number, runner_id)
);


INSERT INTO lap_results (race_id, lap_number, runner_id, time)
VALUES 
-- User 2: RichBTiscuits
  (1, 1, 2, '00:20:00'),
  (1, 2, 2, '00:21:00'),
  (1, 3, 2, '00:22:15'),
  (1, 4, 2, '00:23:30'),
  (1, 5, 2, '00:25:00'),
  (1, 6, 2, '00:28:45'),
  (1, 7, 2, '00:31:30'),
  (1, 8, 2, '00:38:15'),
-- User 3: Datt_Mennis12
  (1, 1, 3, '00:20:15'),
  (1, 2, 3, '00:21:05'),
  (1, 3, 3, '00:22:30'),
  (1, 4, 3, '00:24:00'),
  (1, 5, 3, '00:25:20'),
  (1, 6, 3, '00:27:10'),
  (1, 7, 3, '00:28:50'),
  (1, 8, 3, '00:33:35'),
  (1, 9, 3, '00:37:10'),
  (1, 10, 3, '00:39:40'),
-- User 4: Kirst_Stew
  (1, 1, 4, '00:19:55'),
  (1, 2, 4, '00:21:10'),
  (1, 3, 4, '00:22:45'),
  (1, 4, 4, '00:24:05'),
  (1, 5, 4, '00:25:50'),
  (1, 6, 4, '00:27:30'),
  (1, 7, 4, '00:29:20'),
  (1, 8, 4, '00:31:15'),
  (1, 9, 4, '00:33:45'),
  (1, 10, 4, '00:36:10'),
  (1, 11, 4, '00:38:55');







-- VIEWS -- 

CREATE VIEW race_details AS 
SELECT 
    r.name AS race_name,
    l.name AS location_name,
    l.city AS city,
    race.distance AS lap_distance
FROM 
    races r
JOIN locations l ON r.location_id = l.id
ORDER BY race_name ASC;