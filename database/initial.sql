-- Up

-- **CREATE STATEMENTS** --

CREATE TABLE Locations (
    location_id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address VARCHAR(255)
);

CREATE TABLE Races (
    race_id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    location_id INT NOT NULL,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);

CREATE TABLE Runners (
    runner_id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE Volunteers (
    volunteer_id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(20) NOT NULL
);
-- simple db for making sure connection is functional
CREATE TABLE Racers (
    racers_id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(20) NOT NULL,
    surname VARCHAR(20) NOT NULL
);

-- **INSERT STATEMENTS** -- 

INSERT INTO Racers (name, surname) 
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

-- Down

DROP TABLE Runners CASCADE;
DROP TABLE Volunteers CASCADE;
DROP TABLE Locations CASCADE;
DROP TABLE Races CASCADE;