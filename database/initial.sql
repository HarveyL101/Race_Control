-- Up

-- **CREATE STATEMENTS** --
DROP TABLE IF EXISTS locations;
CREATE TABLE locations (
    location_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address VARCHAR(255)
);

DROP TABLE IF EXISTS races;
CREATE TABLE races (
    race_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    location_id INT NOT NULL,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);

DROP TABLE IF EXISTS runners;
CREATE TABLE runners (
    runner_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(20) NOT NULL
);

DROP TABLE IF EXISTS volunteers;

CREATE TABLE volunteers (
    volunteer_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(20) NOT NULL
);

-- simple db for making sure connection is functional
DROP TABLE IF EXISTS racers;
CREATE TABLE racers (
    racers_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(20) NOT NULL,
    surname VARCHAR(20) NOT NULL
);

-- **INSERT STATEMENTS** -- 
INSERT INTO runners (username, password) 
VALUES 
    ('adminR', 'adminPassword');

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

