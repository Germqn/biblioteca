-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.42 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para bibliotecabd
CREATE DATABASE IF NOT EXISTS `bibliotecabd` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bibliotecabd`;

-- Volcando estructura para tabla bibliotecabd.autores
CREATE TABLE IF NOT EXISTS `autores` (
  `id_autor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_autor`),
  UNIQUE KEY `autores_nombre_apellido` (`nombre`,`apellido`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla bibliotecabd.autores: ~10 rows (aproximadamente)
DELETE FROM `autores`;
INSERT INTO `autores` (`id_autor`, `nombre`, `apellido`) VALUES
	(14, 'Antoine de', 'Saint-Exupéry'),
	(1, 'Gabriel', ' García Márquez'),
	(18, 'George', 'Orwell'),
	(13, 'H. P.', 'Lovecraft'),
	(9, 'Julio', 'Cortázar'),
	(10, 'Julio', 'Verne'),
	(20, 'Lewis', 'Carroll'),
	(19, 'Miguel de ', 'Cervantes'),
	(7, 'Pablo', 'Neruda'),
	(21, 'Rebecca ', 'Yarros'),
	(2, 'Stephen ', 'King'),
	(12, 'Victor', 'Hugo'),
	(11, 'William ', 'Shakespeare');

-- Volcando estructura para tabla bibliotecabd.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla bibliotecabd.categorias: ~5 rows (aproximadamente)
DELETE FROM `categorias`;
INSERT INTO `categorias` (`id_categoria`, `nombre_categoria`) VALUES
	(1, 'Novela'),
	(3, 'Fantasia'),
	(4, 'Ciencia Ficción '),
	(5, 'Dark Fantasy'),
	(6, 'Poesía ');

-- Volcando estructura para tabla bibliotecabd.libros
CREATE TABLE IF NOT EXISTS `libros` (
  `id_libro` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `id_autor` int DEFAULT NULL,
  `id_categoria` int DEFAULT NULL,
  `anio_publicacion` int DEFAULT NULL,
  `cantidad_disponible` int DEFAULT '0',
  `portada_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_libro`),
  KEY `id_autor` (`id_autor`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `libros_ibfk_21` FOREIGN KEY (`id_autor`) REFERENCES `autores` (`id_autor`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `libros_ibfk_22` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla bibliotecabd.libros: ~7 rows (aproximadamente)
DELETE FROM `libros`;
INSERT INTO `libros` (`id_libro`, `titulo`, `id_autor`, `id_categoria`, `anio_publicacion`, `cantidad_disponible`, `portada_url`) VALUES
	(1, 'Cien años de soledad', 1, 1, 1967, 1, NULL),
	(3, 'El principito', 14, 3, 1943, 5, NULL),
	(4, 'En las montañas de la locura', 13, 5, 1936, 2, NULL),
	(5, '1984', 18, 1, 1949, 3, NULL),
	(6, 'Veinte poemas de amor y una canción desesperada', 7, 6, 1924, 10, NULL),
	(10, 'Don Quijote de la Mancha', 19, 1, 1605, 1, NULL),
	(15, 'El resplandor', 2, 5, 1995, 1, NULL);

-- Volcando estructura para tabla bibliotecabd.prestamos
CREATE TABLE IF NOT EXISTS `prestamos` (
  `id_prestamo` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_libro` int DEFAULT NULL,
  `fecha_prestamo` date NOT NULL,
  `fecha_devolucion` date DEFAULT NULL,
  PRIMARY KEY (`id_prestamo`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_libro` (`id_libro`),
  CONSTRAINT `prestamos_ibfk_19` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `prestamos_ibfk_20` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla bibliotecabd.prestamos: ~0 rows (aproximadamente)
DELETE FROM `prestamos`;

-- Volcando estructura para tabla bibliotecabd.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla bibliotecabd.usuarios: ~0 rows (aproximadamente)
DELETE FROM `usuarios`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
