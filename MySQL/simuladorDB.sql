-- SQL clasico para MySQL, sin comentarios ejecutables de mysqldump.
-- Todas las instrucciones que afectan la sesion aparecen como sentencias SET normales.
-- Origen: MySQL dump 10.13, Distrib 9.1.0 para Win64 (x86_64).
--
-- BASE ORIGINAL DE USUARIOS Y FUNCIONAMIENTO GENERAL
-- Contiene usuarios, roles, logros, clases, simulaciones, actividad y configuracion.
-- Las especies se encuentran exclusivamente en `simulador_especies`.
-- Generado desde la base verificada el 22 de julio de 2026.
--
-- Host: localhost    Database: simulador
-- ------------------------------------------------------
-- Server version	9.6.0

SET NAMES utf8mb4;

-- Permite recrear las tablas aunque una relacion apunte a otra tabla
-- que aparezca mas adelante en este archivo.
SET FOREIGN_KEY_CHECKS = 0;

--
-- Current Database: `simulador`
--

CREATE DATABASE IF NOT EXISTS `simulador` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT ENCRYPTION='N';

USE `simulador`;

CREATE USER IF NOT EXISTS `Simulaciones`@`localhost` IDENTIFIED BY 'bitesthedust';
GRANT ALL PRIVILEGES ON `simulador`.* TO `Simulaciones`@`localhost`;
GRANT SELECT ON `simulador_especies`.* TO `Simulaciones`@`localhost`;

--
-- Table structure for table `achievement_categories`
--

DROP TABLE IF EXISTS `achievement_categories`;
CREATE TABLE `achievement_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 0xF09F8C8A,
  `sort_order` smallint NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `achievement_categories`
--

INSERT INTO `achievement_categories` VALUES (1,'learning','Aprendizaje','Metas relacionadas con el contenido educativo.','📚',10,1),(2,'simulation','Simulación','Metas obtenidas experimentando con los ecosistemas.','🐠',20,1),(3,'exploration','Exploración','Reconocimientos por descubrir toda la plataforma.','🧭',30,1),(4,'consistency','Constancia','Recompensas por regresar y mantener el hábito.','🪸',40,1),(5,'special','Especiales','Retos destacados y reconocimientos de conservación.','🏆',50,1);

--
-- Table structure for table `achievement_rules`
--

DROP TABLE IF EXISTS `achievement_rules`;
CREATE TABLE `achievement_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `achievement_id` int NOT NULL,
  `metric_key` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comparison_operator` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gte',
  `target_value` decimal(12,2) NOT NULL,
  `options_json` longtext COLLATE utf8mb4_unicode_ci,
  `sort_order` smallint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_achievement_rule` (`achievement_id`,`metric_key`,`sort_order`),
  KEY `idx_rule_metric` (`metric_key`),
  CONSTRAINT `fk_rule_achievement` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `achievement_rules`
--

INSERT INTO `achievement_rules` VALUES (1,1,'login_days_total','gte',1.00,NULL,10),(2,2,'simulation_completed_count','gte',1.00,NULL,10),(3,3,'required_simulations_completed','gte',3.00,'{\"simulation_ids\":[1,2,3]}',10),(4,4,'simulation_seconds','gte',3600.00,NULL,10),(5,5,'simulation_completed_count','gte',10.00,NULL,10),(6,6,'simulation_completed_count','gte',25.00,NULL,10),(7,7,'simulation_completed_count','gte',50.00,NULL,10),(8,8,'educational_sections_visited','gte',5.00,NULL,10),(9,9,'profile_completeness_percent','gte',100.00,NULL,10),(10,10,'consecutive_login_days','gte',7.00,NULL,10),(11,11,'required_simulations_completed','gte',3.00,'{\"simulation_ids\":[1,2,3]}',10),(12,11,'educational_sections_visited','gte',5.00,NULL,20),(13,12,'simulation_type_completed_count','gte',3.00,'{\"simulation_id\":3}',10),(14,12,'section_visited','gte',1.00,'{\"section_key\":\"resources\"}',20);

--
-- Table structure for table `achievement_system_meta`
--

DROP TABLE IF EXISTS `achievement_system_meta`;
CREATE TABLE `achievement_system_meta` (
  `meta_key` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`meta_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `achievement_system_meta`
--

INSERT INTO `achievement_system_meta` VALUES ('schema_version','2','2026-07-14 10:00:45');

--
-- Table structure for table `achievements`
--

DROP TABLE IF EXISTS `achievements`;
CREATE TABLE `achievements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `code` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Bronze',
  `xp_reward` int NOT NULL DEFAULT '0',
  `is_hidden` tinyint(1) NOT NULL DEFAULT '0',
  `season_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `available_from` datetime DEFAULT NULL,
  `available_until` datetime DEFAULT NULL,
  `sort_order` smallint NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_achievement_availability` (`is_active`,`available_from`,`available_until`),
  KEY `idx_achievement_category_sort` (`category_id`,`sort_order`),
  CONSTRAINT `fk_achievement_category` FOREIGN KEY (`category_id`) REFERENCES `achievement_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` VALUES (1,4,'first_login','Primera inmersión','Inicia sesión por primera vez en BlueEcoSim.','🐚','Bronze',10,0,NULL,NULL,NULL,10,1,'2026-07-14 10:00:45','2026-07-14 10:00:45'),(2,2,'first_simulation','Primera simulación','Completa tu primera experiencia de simulación.','🐠','Bronze',20,0,NULL,NULL,NULL,10,1,'2026-07-14 10:00:45','2026-07-14 10:00:45'),(3,2,'all_simulations','Trilogía oceánica','Completa los tres escenarios de simulación disponibles.','🌊','Silver',60,0,NULL,NULL,NULL,20,1,'2026-07-14 10:00:45','2026-07-14 10:00:45'),(4,2,'simulation_hour','Una hora bajo el mar','Acumula una hora de uso activo en las simulaciones.','⏱️','Silver',75,0,NULL,NULL,NULL,30,1,'2026-07-14 10:00:45','2026-07-14 10:00:45'),(5,2,'simulations_10','Investigador de arrecifes','Completa 10 sesiones de simulación.','🥉','Bronze',50,0,NULL,NULL,NULL,40,1,'2026-07-14 10:00:45','2026-07-14 10:00:45'),(6,2,'simulations_25','Analista marino','Completa 25 sesiones de simulación.','🥈','Silver',100,0,NULL,NULL,NULL,50,1,'2026-07-14 10:00:45','2026-07-14 10:00:45'),(7,2,'simulations_50','Maestro de simulaciones','Completa 50 sesiones de simulación.','🥇','Gold',200,0,NULL,NULL,NULL,60,1,'2026-07-14 10:00:45','2026-07-14 10:00:45'),(8,3,'educational_explorer','Cartógrafo del conocimiento','Visita todas las secciones educativas principales.','🧭','Silver',60,0,NULL,NULL,NULL,10,1,'2026-07-14 10:00:45','2026-07-14 10:00:45'),(9,3,'profile_complete','Identidad marina','Completa la información esencial de tu perfil.','🪪','Bronze',25,0,NULL,NULL,NULL,20,1,'2026-07-14 10:00:45','2026-07-14 10:00:45'),(10,4,'week_streak','Marea constante','Regresa a BlueEcoSim durante 7 días consecutivos.','🪸','Gold',150,0,NULL,NULL,NULL,20,1,'2026-07-14 10:00:45','2026-07-14 10:00:45'),(11,1,'ecosystem_expert','Experto en ecosistemas','Domina los tres escenarios y explora todo el contenido educativo.','🔬','Gold',200,0,NULL,NULL,NULL,10,1,'2026-07-14 10:00:45','2026-07-14 10:00:45'),(12,5,'marine_advocate','Defensor de la conservación marina','Completa tres estudios de contaminación y consulta los recursos de conservación.','🐢','Platinum',250,0,NULL,NULL,NULL,10,1,'2026-07-14 10:00:45','2026-07-14 10:00:45');

--
-- Table structure for table `asignaciones`
--

DROP TABLE IF EXISTS `asignaciones`;
CREATE TABLE `asignaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_docente` int NOT NULL,
  `id_estudiante` int NOT NULL,
  `id_simulacion` int NOT NULL,
  `fecha_asignacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente','en_progreso','completada') DEFAULT 'pendiente',
  `id_espacio` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_docente` (`id_docente`),
  KEY `id_estudiante` (`id_estudiante`),
  KEY `id_simulacion` (`id_simulacion`),
  CONSTRAINT `asignaciones_ibfk_1` FOREIGN KEY (`id_docente`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asignaciones_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asignaciones_ibfk_3` FOREIGN KEY (`id_simulacion`) REFERENCES `simulaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `asignaciones`
--


--
-- Table structure for table `config`
--

DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
  `clave` varchar(100) NOT NULL,
  `valor` text NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `config`
--

INSERT INTO `config` VALUES ('favicon_url','/Simulador-Acu-tico-main/public/media/Web/logo.png','URL del favicon'),('limite_estudiantes_espacio','30','Número máximo de estudiantes por espacio'),('logo_url','/Simulador-Acu-tico-main/public/media/Web/logo.png','URL del logo'),('modo_mantenimiento','0','Modo mantenimiento (1=Activo, 0=Inactivo)'),('registro_abierto','1','Permitir registro de nuevos usuarios (1=Si, 0=No)'),('tiempo_simulacion_maximo','0','Tiempo máximo en segundos (0 = sin límite)');

--
-- Table structure for table `espacio_estudiantes`
--

DROP TABLE IF EXISTS `espacio_estudiantes`;
CREATE TABLE `espacio_estudiantes` (
  `id_espacio` int NOT NULL,
  `id_estudiante` int NOT NULL,
  `fecha_union` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente','aceptado','rechazado') NOT NULL DEFAULT 'aceptado',
  PRIMARY KEY (`id_espacio`,`id_estudiante`),
  KEY `id_estudiante` (`id_estudiante`),
  CONSTRAINT `espacio_estudiantes_ibfk_1` FOREIGN KEY (`id_espacio`) REFERENCES `espacios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `espacio_estudiantes_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `espacio_estudiantes`
--


--
-- Table structure for table `espacios`
--

DROP TABLE IF EXISTS `espacios`;
CREATE TABLE `espacios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `id_docente` int NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `portada` varchar(255) DEFAULT 'default.jpg',
  PRIMARY KEY (`id`),
  KEY `id_docente` (`id_docente`),
  CONSTRAINT `espacios_ibfk_1` FOREIGN KEY (`id_docente`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `espacios`
--


--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `usuario_nombre` varchar(100) DEFAULT NULL,
  `accion` varchar(255) NOT NULL,
  `detalles` text,
  `ip` varchar(45) DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` VALUES (1,2,'Blue_EcoSim2026','Cambió rol del usuario ID 2 a 4','','::1','2026-07-14 10:01:08'),(2,2,'Blue_EcoSim2026','Cambió rol del usuario ID 2 a 2','','::1','2026-07-14 10:01:11');

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint DEFAULT '0',
  `destacado` tinyint DEFAULT '0',
  `archivado` tinyint DEFAULT '0',
  `eliminado` tinyint DEFAULT '0',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo` varchar(30) NOT NULL DEFAULT 'general',
  `id_espacio` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_espacio` (`id_espacio`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`id_espacio`) REFERENCES `espacios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notificaciones`
--


--
-- Table structure for table `observaciones_simulacion`
--

DROP TABLE IF EXISTS `observaciones_simulacion`;
CREATE TABLE `observaciones_simulacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_asignacion` int NOT NULL,
  `id_estudiante` int NOT NULL,
  `observacion` text NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_observaciones_asignacion` (`id_asignacion`),
  KEY `idx_observaciones_estudiante` (`id_estudiante`),
  CONSTRAINT `observaciones_simulacion_ibfk_1` FOREIGN KEY (`id_asignacion`) REFERENCES `asignaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `observaciones_simulacion_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `observaciones_simulacion`
--


--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` VALUES (1,'Estudiante'),(2,'Docente'),(3,'Personal'),(4,'Admin');

--
-- Table structure for table `sesiones_activas`
--

DROP TABLE IF EXISTS `sesiones_activas`;
CREATE TABLE `sesiones_activas` (
  `id` varchar(128) NOT NULL,
  `usuario_id` int NOT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `ultimo_acceso` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `sesiones_activas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sesiones_activas`
--


--
-- Table structure for table `simulaciones`
--

DROP TABLE IF EXISTS `simulaciones`;
CREATE TABLE `simulaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `ruta` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `simulaciones`
--

INSERT INTO `simulaciones` VALUES (1,'Ecosistema básico','Arrecife de coral con especies comunes','simulador.php?id=1'),(2,'Cadena alimenticia','Relación depredador-presa en el océano','simulador.php?id=2'),(3,'Contaminación marina','Efectos de residuos en el ecosistema','simulador.php?id=3');

--
-- Table structure for table `simulation_activity_sessions`
--

DROP TABLE IF EXISTS `simulation_activity_sessions`;
CREATE TABLE `simulation_activity_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `session_token` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `simulation_id` int NOT NULL,
  `assignment_id` int DEFAULT NULL,
  `started_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `duration_seconds` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token` (`session_token`),
  KEY `fk_activity_session_simulation` (`simulation_id`),
  KEY `fk_activity_session_assignment` (`assignment_id`),
  KEY `idx_activity_user_completed` (`user_id`,`completed_at`),
  KEY `idx_activity_user_simulation` (`user_id`,`simulation_id`,`completed_at`),
  CONSTRAINT `fk_activity_session_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `asignaciones` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_activity_session_simulation` FOREIGN KEY (`simulation_id`) REFERENCES `simulaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_activity_session_user` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `simulation_activity_sessions`
--

INSERT INTO `simulation_activity_sessions` VALUES (1,'b44dc250a0da1b3711f869884b21aad46c1e81706e2fe5139718eb444304ff67',2,1,NULL,'2026-07-20 07:40:21','2026-07-20 07:41:12',51,0,NULL),(2,'4ff564fdffda33712293d0392400565b092d9837407bd4c0ac66d1023ac1a32f',2,1,NULL,'2026-07-20 07:41:12','2026-07-20 07:43:47',155,0,NULL),(3,'f9a1236cdc80ae4f235336f61e536fa5c7790935688657c927db0adb22df2f7a',2,1,NULL,'2026-07-20 07:43:47','2026-07-20 07:43:50',3,0,NULL),(4,'e07fd113990b19f005acffcc5f9072e5fb219510a4ad1245d496f15488a7b5ad',2,1,NULL,'2026-07-20 07:54:54','2026-07-20 07:55:25',31,0,NULL),(5,'95bc41f6d75d0e79c62205e2cca18ef68ad1934247a9177af32051ea3189ec46',2,3,NULL,'2026-07-20 07:58:12','2026-07-20 07:58:31',19,0,NULL),(6,'ac2725ac62b00f080773da002dae5efc67f88ab75d7b378368c1690b0434de85',2,3,NULL,'2026-07-20 08:00:15','2026-07-20 08:04:20',239,0,NULL),(7,'a1572412be163ffe87db62836b11c0fd38331e1a7603ab8d4feb9a4bff58cdbe',2,2,NULL,'2026-07-20 08:59:45','2026-07-20 08:59:52',7,0,NULL),(8,'3245d509e44382183ae5afb9cff2d59addbe96312367048135379b4733c83a78',2,2,NULL,'2026-07-20 08:59:53','2026-07-20 09:04:48',295,0,NULL),(9,'c3faa89d0f9a2dbd5b65dbc02c71cd29ac3595f773c358600fcdc8e3ad4aa597',2,2,NULL,'2026-07-20 09:04:49','2026-07-20 09:05:23',34,0,NULL),(10,'83723ec84567bb3e434d9c090d6bc41d485515383c9291209684106193461a39',2,2,NULL,'2026-07-20 09:05:24','2026-07-20 09:11:39',375,0,NULL),(11,'701280643a1b4997c566a694204584ef89311271dcfff6ce93cdf3801201dc86',2,2,NULL,'2026-07-20 09:12:18','2026-07-20 09:13:44',86,0,NULL),(12,'32a3cbe2774b75c5fccc7b98c07a73e600fa6b228c8e2f00571746b85d16f046',2,3,NULL,'2026-07-20 09:15:03','2026-07-20 09:15:12',9,0,NULL),(13,'946fc96b1cccc918e31b76d12af9f7e84916d3ddb429f3eb97859c4ed83030cb',2,2,NULL,'2026-07-20 09:15:15','2026-07-20 09:17:25',130,0,NULL),(14,'de3320dc36ec2b4de0d27ff9c30052decddb2d72c64726c1a19256fc31b292a3',2,2,NULL,'2026-07-20 09:17:26','2026-07-20 09:17:55',29,0,NULL),(15,'ec822795ed9618c658cac674828d6d00e9ba020eed5e200945f960288bee235c',2,2,NULL,'2026-07-20 09:20:18','2026-07-20 09:21:00',42,0,NULL),(16,'f63794c3dc92f412b56ad63cbb7658f8f7cea746e7615dec3a117b452f7f9501',2,3,NULL,'2026-07-20 09:21:04','2026-07-20 09:21:22',18,0,NULL),(17,'374080afe4ad3a1a336e75b0cdce1bc103aca570aad4650bac6ea884cf247edf',2,1,NULL,'2026-07-20 09:21:27','2026-07-20 09:21:44',17,0,NULL),(18,'fd293b278be54cf0a4552c3592d7aa9d9e55fefdaf5eb29420b0b9d70cb92cad',2,2,NULL,'2026-07-20 09:21:53','2026-07-20 09:35:30',817,0,NULL),(19,'1d13b659435d5c263ee9b70ed76f22b0412d9824fcbf6e8549c24cc2021dc8b0',2,2,NULL,'2026-07-20 09:35:30','2026-07-20 09:36:20',50,0,NULL),(20,'f8cf20a973cb17ab8d1e745ee7c7045119b2c9964aa60caa197a0c7f57302ebd',2,3,NULL,'2026-07-20 09:36:32','2026-07-20 09:36:37',5,0,NULL),(21,'4d5fc2c8dc2cac20eb765e3246972e55f68d7847219596d34bc6048a28aeaab5',2,1,NULL,'2026-07-20 09:36:41','2026-07-20 09:57:25',1244,0,NULL),(22,'537b171eac81efc13d7df22e8edfdac6b7c796cc203f14df855455efafe98392',2,2,NULL,'2026-07-20 09:57:33','2026-07-20 10:08:39',666,0,NULL),(23,'bcdb3b80f52f8ba7019ae35492f441ee537ac67a278e81c144318356485ce2dc',2,2,NULL,'2026-07-20 10:08:39','2026-07-20 20:47:51',1804,0,NULL),(24,'6da89d6783dd48bd24ab76b8534ed91984a759e813798155154a8556b744acd5',2,2,NULL,'2026-07-20 20:47:51','2026-07-20 20:49:11',80,0,NULL),(25,'033f785c1275744ebef9a7af8cac101b44e7ea6b8eaadf5592e3bf89aa3ee2f1',2,2,NULL,'2026-07-20 21:00:10','2026-07-20 21:01:47',97,0,NULL),(26,'9bec355df0aa27ba68e90bf25a301ac102b79b309589443d817b4849afa5d4bb',2,2,NULL,'2026-07-21 07:26:43','2026-07-21 07:27:34',51,0,NULL),(27,'38415af9153f0982b6614549db3b18c6715e80848be18b9658043961964500e8',2,2,NULL,'2026-07-21 07:29:49','2026-07-21 07:52:22',394,0,NULL),(28,'d70565c3afc87735e7b178c0e78ebf8d240908d7a6108f59745ca029e52ae365',2,2,NULL,'2026-07-21 08:02:11','2026-07-21 08:13:50',682,0,NULL),(29,'dbb3fce9d418edd5210f20d4d6401602fcdbdd004cfaa1322455e087aab4d35e',2,2,NULL,'2026-07-21 08:25:40','2026-07-21 08:29:58',258,0,NULL),(30,'396966c25b2cdfb16a3d516c3ea2d72ba2222f2d1d60c0291cb161d7ef72a78c',2,2,NULL,'2026-07-21 08:52:19','2026-07-21 08:57:11',292,0,NULL),(31,'ad095fe4e04a0a067c19d1855051f3901e6b0258dbc08187407d1e81eb5c2a0b',2,2,NULL,'2026-07-21 08:59:31','2026-07-21 09:07:26',236,0,NULL),(32,'2205d91b7a1ea040bbf5684a206be8eec0171cb1202554649b9a5a6121b449df',2,2,NULL,'2026-07-21 09:18:35','2026-07-21 09:20:09',94,0,NULL),(33,'26c023d55f78253a830e0ab1798de014c0f352e4dabb985f78e1db5dd973631b',2,2,NULL,'2026-07-21 09:20:59','2026-07-21 09:21:32',33,0,NULL),(34,'8bd0505b631d7530d8d412b46d152024405e774a39fbc941fa7b495252e7f600',2,2,NULL,'2026-07-21 09:24:30','2026-07-21 09:32:39',488,0,NULL),(35,'9c790b2ab41283d8341a40e33da3cdc84a3747a7c8b9e32f59621afe0334a08c',2,2,NULL,'2026-07-21 09:33:15','2026-07-21 09:33:47',32,0,NULL),(36,'e6f69f14a27442250c8966a230dad80ac9fc7a74d799557e7a77673f844b5529',2,2,NULL,'2026-07-21 09:48:12','2026-07-21 09:48:24',12,0,NULL),(37,'62c070c6c35b7d81611364514658ac30762943bb4f336bc0cf3e179e605e326b',2,2,NULL,'2026-07-21 09:48:30','2026-07-21 09:48:36',6,0,NULL),(38,'0e45f5efacd9cb15448a29a48b042bc41221de2b723caa9011c7162ed841d0db',2,2,NULL,'2026-07-21 09:56:36','2026-07-21 09:57:10',34,0,NULL),(39,'06b38bce5f522db9b719259d02763d3c02bc41eb8f32a4535e27e9475073c1b8',2,2,NULL,'2026-07-21 09:57:10','2026-07-21 09:57:24',14,0,NULL),(40,'1a96aa2ee026d9d808cb2ef82d81a28a4677ef2c1939ffbde00eb47591821829',2,2,NULL,'2026-07-21 09:57:24','2026-07-21 09:57:35',11,0,NULL),(41,'67bd701acc2f348c04332ebb9f2994e8ef3259a9daa9831e9ad53d2851813709',2,2,NULL,'2026-07-21 09:57:35','2026-07-21 09:57:43',8,0,NULL),(42,'2660437f92f50259df21ab93171987a3bdc408f1760affa44af0e09ee94d1a45',2,3,NULL,'2026-07-21 09:57:46','2026-07-21 09:58:00',13,0,NULL),(43,'2d3074a92358160f3188b66f566dc1386924bba30d16006a23e6dc0e7b6b6a64',2,1,NULL,'2026-07-21 09:58:04','2026-07-21 09:58:15',11,0,NULL),(44,'7efcbcdf8e75fa031cb4ff5691f4ca3c0b6c4f16ccb8aa1fcec056dbe0186010',2,2,NULL,'2026-07-21 09:58:23','2026-07-21 09:58:32',9,0,NULL),(45,'a1fd7c901de166716962671e92eebb54cd95bef3c9bec4a0d0efd59770287f43',2,2,NULL,'2026-07-21 09:58:54','2026-07-21 10:12:37',823,1,'2026-07-21 10:12:37'),(46,'a4effc9dd28155050a48d4faf9504ffa171edc95609a1d0d9112aed1d43d0cc7',2,2,NULL,'2026-07-21 10:14:41','2026-07-21 10:15:46',65,0,NULL),(47,'44eb4e9a2b46d0687cf468505c77548f036116ce72a29184fa2def1803d1a63a',2,2,NULL,'2026-07-21 10:15:47','2026-07-21 10:18:10',131,0,NULL);

--
-- Table structure for table `user_achievements`
--

DROP TABLE IF EXISTS `user_achievements`;
CREATE TABLE `user_achievements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `achievement_id` int NOT NULL,
  `progress_value` decimal(12,2) NOT NULL DEFAULT '0.00',
  `progress_target` decimal(12,2) NOT NULL DEFAULT '1.00',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'locked',
  `unlocked_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_achievement` (`user_id`,`achievement_id`),
  KEY `fk_user_achievement_definition` (`achievement_id`),
  KEY `idx_user_achievement_status` (`user_id`,`status`,`unlocked_at`),
  CONSTRAINT `fk_user_achievement_definition` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_achievement_user` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_achievements`
--

INSERT INTO `user_achievements` VALUES (1,2,1,1.00,1.00,'unlocked','2026-07-14 10:00:55','2026-07-14 10:00:55','2026-07-14 10:00:55'),(2,2,2,1.00,1.00,'unlocked','2026-07-21 10:12:37','2026-07-14 10:00:55','2026-07-21 10:12:37'),(3,2,3,1.00,3.00,'locked',NULL,'2026-07-14 10:00:55','2026-07-21 10:12:37'),(4,2,4,3600.00,3600.00,'unlocked','2026-07-20 09:56:59','2026-07-14 10:00:55','2026-07-20 09:56:59'),(5,2,5,1.00,10.00,'locked',NULL,'2026-07-14 10:00:55','2026-07-21 10:12:37'),(6,2,6,1.00,25.00,'locked',NULL,'2026-07-14 10:00:55','2026-07-21 10:12:37'),(7,2,7,1.00,50.00,'locked',NULL,'2026-07-14 10:00:55','2026-07-21 10:12:37'),(8,2,8,4.00,5.00,'locked',NULL,'2026-07-14 10:00:55','2026-07-20 20:55:09'),(9,2,9,100.00,100.00,'unlocked','2026-07-14 10:00:55','2026-07-14 10:00:55','2026-07-14 10:00:55'),(10,2,10,3.00,7.00,'locked',NULL,'2026-07-14 10:00:55','2026-07-22 09:04:36'),(11,2,11,56.67,100.00,'locked',NULL,'2026-07-14 10:00:55','2026-07-21 10:12:37'),(12,2,12,50.00,100.00,'locked',NULL,'2026-07-14 10:00:55','2026-07-20 07:59:37');

--
-- Table structure for table `user_education_visits`
--

DROP TABLE IF EXISTS `user_education_visits`;
CREATE TABLE `user_education_visits` (
  `user_id` int NOT NULL,
  `section_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_visited_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visited_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `visit_count` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_id`,`section_key`),
  KEY `idx_education_visit_user` (`user_id`,`first_visited_at`),
  CONSTRAINT `fk_education_visit_user` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_education_visits`
--

INSERT INTO `user_education_visits` VALUES (2,'home','2026-07-14 10:00:55','2026-07-22 09:04:36',22),(2,'resources','2026-07-20 07:59:37','2026-07-21 07:53:13',6),(2,'simulations','2026-07-14 10:01:20','2026-07-21 10:14:36',57),(2,'species','2026-07-20 20:55:09','2026-07-22 10:02:38',17);

--
-- Table structure for table `user_login_days`
--

DROP TABLE IF EXISTS `user_login_days`;
CREATE TABLE `user_login_days` (
  `user_id` int NOT NULL,
  `login_date` date NOT NULL,
  `first_login_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`login_date`),
  CONSTRAINT `fk_login_day_user` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_login_days`
--

INSERT INTO `user_login_days` VALUES (2,'2026-07-14','2026-07-14 10:00:55'),(2,'2026-07-20','2026-07-20 07:40:09'),(2,'2026-07-21','2026-07-21 07:26:34'),(2,'2026-07-22','2026-07-22 09:04:36');

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `google_id` varchar(180) DEFAULT NULL,
  `rol_id` int DEFAULT '1',
  `estado` enum('pendiente','activo','bloqueado') NOT NULL DEFAULT 'pendiente',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `ultima_actividad` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` VALUES (2,'blueecosim67@gmail.com','Blue_EcoSim2026','$2y$10$77CQm.aKbGZIesA73BIjZeQzVdtwqQx.Yos89ob0iRowvrQmUiAxK',NULL,2,'activo','2026-07-14 10:00:18',NULL);

--
-- Table structure for table `verificaciones`
--

DROP TABLE IF EXISTS `verificaciones`;
CREATE TABLE `verificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `token` varchar(64) NOT NULL,
  `expira` datetime NOT NULL,
  `creado` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `verificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `verificaciones`
--


-- Reactiva la validacion de relaciones al finalizar la importacion.
SET FOREIGN_KEY_CHECKS = 1;

-- Exportacion original completada el 22 de julio de 2026 a las 10:02:48.
