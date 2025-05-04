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
    ('5k Fun Run', '09:00', 5.0, 1),
    ('10k Charity Run', '10:00', 10.0, 2),
    ('Half Marathon', '08:30', 21.1, 3),
    ('Marathon', '07:00', 42.2, 4);

-- Runners Table -- 
CREATE TABLE IF NOT EXISTS runners (
    runner_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(20) NOT NULL
);

INSERT INTO runners (username, password) 
VALUES 
    ('adminR', 'adminPassword');

-- Table For Volunteers/ Staff Details -- 
CREATE TABLE IF NOT EXISTS volunteers (
    volunteer_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(20) NOT NULL
);

INSERT INTO volunteers (username, password) 
VALUES 
  ('adminV', 'adminPassword');

-- simple db for making sure connection is functional
CREATE TABLE IF NOT EXISTS racers (
    racers_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(20) NOT NULL,
    surname VARCHAR(20) NOT NULL
);

INSERT INTO racers (name, surname) 
VALUES 
    ('John', 'Clements'),
    ('Rebecca', 'Gothard'),
    ('Barnebas', 'Overshott'),
    ('Anett', 'Stormouth'),
    ('Nicol', 'Breslane'),
    ('Joellen', 'Cleghorn'),
    ('Zsazsa', 'Hanby'),
    ('Cristabel', 'Linnell'),
    ('Lothario', 'Domoni'),
    ('Palmer', 'Meineck'),
    ('Dniren', 'Braham'),
    ('Collete', 'Shickle'),
    ('Ashely', 'Huikerby'),
    ('Britte', 'Lamball'),
    ('Letitia', 'Meek'),
    ('Pamela', 'Meatcher'),
    ('Elaina', 'Alfonso'),
    ('Jecho', 'Kenwin'),
    ('Carmelita', 'Dunford'),
    ('Fanni', 'Borrington'),
    ('Jocelyne', 'Davitashvili'),
    ('Corette', 'Vanelli'),
    ('Stacie', 'Worsalls'),
    ('Brunhilde', 'Cocke'),
    ('Luz', 'Jenson'),
    ('Rosabella', 'Leeke'),
    ('Rory', 'Harget'),
    ('Danita', 'McGregor'),
    ('Durward', 'McCowen'),
    ('Cassi', 'Hanby'),
    ('Booth', 'Rounding');


CREATE TABLE IF NOT EXISTS race_results (
    race_id INTEGER,
    runner_id INTEGER,
    position INTEGER,
    time TEXT,
    FOREIGN KEY (race_id) REFERENCES races(race_id),
    FOREIGN KEY (runner_id) REFERENCES runners(runner_id)
);
-- **INSERT STATEMENTS** -- 