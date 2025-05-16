-- Up

-- **CREATE STATEMENTS** --

-- Race Locations Table --
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY NOT NULL,
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
    id INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    start_time VARCHAR(5) NOT NULL,
    distance FLOAT NOT NULL,
    location_id INT,

    FOREIGN KEY (location_id) REFERENCES Locations(id)
);

INSERT INTO races (name, start_time, distance, id)
VALUES
    ('5k Fun Run', '09:00:00', 5.0, 1),
    ('10k Charity Run', '10:00:00', 10.0, 2),
    ('Half Marathon', '08:30:00', 21.1, 3),
    ('Marathon', '07:00:00', 42.2, 4);

-- Runners Table -- 
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    is_admin INTEGER NOT NULL -- 0 and 1 will be used due to the lack of a native BOOLEAN data type in sqlite
);

-- Table of users --
INSERT INTO users (username, password, is_admin) 
VALUES 
    ('dev', 'devP', 1),
    ('RichB', 'manHooRuns5', 0),
    ('lwhates0', 'cA199#2`hTa&', 0),
    ('cshane1', 'rT2\3S>i=.c|pS', 0),
    ('lmagowan2', 'rC2(Q0sPZ', 0),
    ('sthaller3', 'sG4_HjGRkA7H', 0),
    ('mjefferys4', 'jM3=ti@', 0),
    ('kboydle5', 'uJ6@~uZjTZQg', 0),
    ('dguerner6', 'vI1}S%h<q*', 0),
    ('febenezer7', 'uE1`QYJsJ', 0),
    ('mclay8', 'nO5<#p}upgw!', 0),
    ('bhaddick9', 'vJ8!bT#"', 0),
    ('ewraggsa', 'uN6$NNged3@8>Xbr', 0),
    ('rchristofolb', 'wD2&o4MmO6O', 0),
    ('aberrec', 'oE2&?\*B`5=', 0),
    ('mgheeraertd', 'kD7<vH<@/,q4?|fA', 0),
    ('steveB', 'Password1', 0),
    ('sduncansone', 'uP6#pZYu', 0);

-- Table for final results of a race when the number of runners falls to 1
CREATE TABLE IF NOT EXISTS race_results (
    id INTEGER PRIMARY KEY NOT NULL,
    race_id INTEGER NOT NULL,
    runner_id INTEGER NOT NULL,
    username VARCHAR(30) NOT NULL,

    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (runner_id) REFERENCES users(id)
);

-- Table for checkpoint results --
CREATE TABLE IF NOT EXISTS lap_results (
    id INTEGER PRIMARY KEY NOT NULL,
    race_id INTEGER NOT NULL,
    lap_number INTEGER NOT NULL,
    runner_id INTEGER NOT NULL,
    position INTEGER NOT NULL, 
    time VARCHAR(8) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (runner_id) REFERENCES users(id),
    UNIQUE (race_id, lap_number, runner_id)
);

CREATE TABLE IF NOT EXISTS runner_status (
    race_id INTEGER NOT NULL,
    runner_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('safe', 'active', 'DNF')) NOT NULL DEFAULT 'active',

    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (runner_id) REFERENCES users(id) 
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INT,
    CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP,
    EXPIRES_AT DATETIME
);



-- VIEWS (WIP) -- 
/*
View for displaying the race winner of a race using its ID, can then be manipulated by

-- Shows all the races a runner has won
-- Example query: SELECT * FROM race_winner WHERE race_id = ?;
/*
CREATE VIEW race_winner AS 
SELECT 
    runner_id, 
    MAX(id) AS lap_count
FROM lap_results
GROUP BY runner_id;

-- View to display leaderboard (WIP, focussing on core functionality atm)
/* 
CREATE VIEW leaderboard_view AS 
SELECT
    position,
    runners.username,
    time,
FROM lap_results
JOIN runners ON runners.username
*/
-- Could include a view that shows the runners personal stats by race?