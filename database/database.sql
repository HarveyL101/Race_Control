-- Up

-- **CREATE STATEMENTS** --

-- Race Locations Table --
CREATE TABLE IF NOT EXISTS locations (
    location_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
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
    race_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    start_time VARCHAR(5) NOT NULL,
    distance FLOAT NOT NULL,
    location_id INT NOT NULL,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);

INSERT INTO races (name, start_time, distance, location_id)
VALUES
    ('5k Fun Run', '09:00:00', 5.0, 1),
    ('10k Charity Run', '10:00:00', 10.0, 2),
    ('Half Marathon', '08:30:00', 21.1, 3),
    ('Marathon', '07:00:00', 42.2, 4);

-- Runners Table -- 
CREATE TABLE IF NOT EXISTS runners (
    runner_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(20) NOT NULL
);

INSERT INTO runners (username, password) 
VALUES 
    ('dev', 'devP'),
    ('RichB', 'manHooRuns5'),
    ('lwhates0', 'cA1''99#2`hTa&'),
    ('cshane1', 'rT2\3S>i=.c|pS'),
    ('lmagowan2', 'rC2(Q0sPZ'),
    ('sthaller3', 'sG4_HjGRkA7H'),
    ('mjefferys4', 'jM3''=ti@'),
    ('kboydle5', 'uJ6@~u''ZjTZQg'),
    ('dguerner6', 'vI1}S%h<q*'),
    ('febenezer7', 'uE1`QYJsJ'),
    ('mclay8', 'nO5<#p}upgw!'),
    ('bhaddick9', 'vJ8!bT#"'),
    ('ewraggsa', 'uN6$NNged3@8>Xbr'),
    ('rchristofolb', 'wD2&o4MmO6O'),
    ('aberrec', 'oE2&?\*B`5='),
    ('mgheeraertd', 'kD7<vH<@/,q4?|fA'),
    ('sduncansone', 'uP6)pZYu');

-- Table For Volunteers/ Staff Details -- 
CREATE TABLE IF NOT EXISTS volunteers (
    volunteer_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(20) NOT NULL
);

INSERT INTO volunteers (username, password) 
VALUES 
  ('dev', 'devP'),
  ('steveB', 'Password1');

-- Table for final results of a race when the number of runners falls to 1
CREATE TABLE IF NOT EXISTS race_results (
    race_id INTEGER PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    FOREIGN KEY (race_id) REFERENCES races(race_id)
);
-- Table for checkpoint results --
CREATE TABLE IF NOT EXISTS lap_results (
    lap_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    race_id INTEGER NOT NULL,
    lap_number INTEGER NOT NULL,
    runner_id INTEGER NOT NULL,
    position INTEGER NOT NULL, 
    time VARCHAR(8) NOT NULL,
    FOREIGN KEY (race_id) REFERENCES races(race_id),
    FOREIGN KEY (runner_id) REFERENCES runners(runner_id)
);
/*
View for displaying the race winner of a race using its ID, can then be manipulated by

SELECT * FROM race_winner WHERE race_id = ?;
*/
CREATE VIEW race_winner AS 
SELECT runner_id, MAX(lap_id) AS lap_count
FROM lap_results
GROUP BY runner_id;

-- Could include a view that shows the runners personal stats by race?