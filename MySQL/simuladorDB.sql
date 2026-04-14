CREATE DATABASE simulador;
USE simulador;
CREATE USER 'Simulaciones'@'localhost' IDENTIFIED BY 'bitesthedust';
GRANT ALL PRIVILEGES ON simulador.* TO 'Simulaciones'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(50) NOT NULL
);

INSERT INTO roles (rol) VALUES 
('Estudiante'),
('Docente'),
('Personal'),
('Admin');

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    rol_id INT DEFAULT 1,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);