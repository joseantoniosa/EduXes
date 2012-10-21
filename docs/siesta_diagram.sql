SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS `siestta` ;
CREATE SCHEMA IF NOT EXISTS `siestta` DEFAULT CHARACTER SET latin1 ;
SHOW WARNINGS;
USE `siestta` ;

-- -----------------------------------------------------
-- Table `siestta`.`actividades`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`actividades` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`actividades` (
  `actividad` VARCHAR(20) NOT NULL ,
  `agrupamiento` VARCHAR(10) NOT NULL ,
  `ponderacion` DECIMAL(4,2) NOT NULL ,
  `periodo` VARCHAR(2) NOT NULL ,
  PRIMARY KEY (`actividad`, `agrupamiento`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`agenda`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`agenda` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`agenda` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `docente` VARCHAR(6) NOT NULL ,
  `franja` VARCHAR(2) NOT NULL ,
  `dia` TINYINT(1) NOT NULL ,
  `fecha` DATE NOT NULL ,
  `cita` LONGTEXT NOT NULL ,
  `tipo` CHAR(1) NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`agrupamientos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`agrupamientos` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`agrupamientos` (
  `agrupamiento` VARCHAR(10) NOT NULL DEFAULT '' ,
  `departamento` VARCHAR(30) NOT NULL DEFAULT '' ,
  `materia` VARCHAR(50) NOT NULL DEFAULT '' ,
  `docente` VARCHAR(6) NOT NULL DEFAULT '' ,
  `curso` CHAR(1) NOT NULL DEFAULT '' ,
  `nivel` VARCHAR(6) NOT NULL DEFAULT '' ,
  PRIMARY KEY (`agrupamiento`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`alumnado`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`alumnado` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`alumnado` (
  `codigo` VARCHAR(6) NOT NULL DEFAULT '' ,
  `nombre` VARCHAR(40) NOT NULL DEFAULT '' ,
  `apellidos` VARCHAR(60) NOT NULL DEFAULT '' ,
  `f_nac` DATE NOT NULL DEFAULT '0000-00-00' ,
  `grupo` VARCHAR(8) NOT NULL DEFAULT '' ,
  `modalidad` VARCHAR(8) NOT NULL DEFAULT '' ,
  `repite` SET('0','1') NOT NULL DEFAULT '' ,
  `tutor1` VARCHAR(100) NOT NULL DEFAULT '' ,
  `tutor2` VARCHAR(100) NOT NULL DEFAULT '' ,
  `direccion1` VARCHAR(160) NOT NULL DEFAULT '' ,
  `direccion2` VARCHAR(160) NOT NULL DEFAULT '' ,
  `telef1` VARCHAR(9) NOT NULL DEFAULT '' ,
  `telef2` VARCHAR(9) NOT NULL DEFAULT '' ,
  `nacionalidad` VARCHAR(20) NOT NULL DEFAULT '' ,
  `mail` VARCHAR(50) NOT NULL DEFAULT '' ,
  `weblog` VARCHAR(50) NOT NULL DEFAULT '' ,
  PRIMARY KEY (`codigo`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`asistencia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`asistencia` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`asistencia` (
  `codigo` VARCHAR(6) NOT NULL ,
  `agrupamiento` VARCHAR(10) NOT NULL ,
  `fecha` DATE NOT NULL ,
  `hini` VARCHAR(5) NOT NULL ,
  `dato` CHAR(1) NOT NULL ,
  PRIMARY KEY (`codigo`, `agrupamiento`, `fecha`, `hini`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`cartas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`cartas` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`cartas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `docente` VARCHAR(6) NOT NULL ,
  `texto` LONGTEXT NOT NULL ,
  `destinatario` VARCHAR(10) NOT NULL ,
  `fecha` DATE NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`docentes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`docentes` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`docentes` (
  `docente` VARCHAR(6) NOT NULL DEFAULT '' ,
  `clave` VARCHAR(30) NULL DEFAULT NULL ,
  `nombre` VARCHAR(40) NULL DEFAULT NULL ,
  `apellidos` VARCHAR(60) NULL DEFAULT NULL ,
  `email` VARCHAR(50) NULL DEFAULT NULL ,
  `web` VARCHAR(50) NULL DEFAULT NULL ,
  `especialidad` VARCHAR(30) NULL DEFAULT NULL ,
  `telef1` VARCHAR(9) NOT NULL DEFAULT '' ,
  `telef2` VARCHAR(9) NOT NULL DEFAULT '' ,
  `rol` CHAR(1) NOT NULL DEFAULT '' ,
  PRIMARY KEY (`docente`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`entrevistas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`entrevistas` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`entrevistas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `docente` VARCHAR(6) NOT NULL ,
  `texto` LONGTEXT NOT NULL ,
  `codigo` VARCHAR(6) NOT NULL ,
  `fecha` DATE NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`evaluacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`evaluacion` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`evaluacion` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `codigo` VARCHAR(6) NOT NULL ,
  `agrupamiento` VARCHAR(10) NOT NULL ,
  `fecha` DATE NOT NULL ,
  `materia` VARCHAR(50) NOT NULL ,
  `observaciones` LONGTEXT NOT NULL ,
  `nota` DECIMAL(4,2) NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`familias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`familias` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`familias` (
  `codigo` VARCHAR(6) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL DEFAULT '' ,
  `clave` VARCHAR(4) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL DEFAULT '' ,
  PRIMARY KEY (`codigo`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`franjas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`franjas` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`franjas` (
  `docente` VARCHAR(6) NOT NULL ,
  `franja` VARCHAR(2) NOT NULL ,
  `hini` VARCHAR(5) NOT NULL ,
  `hfin` VARCHAR(5) NOT NULL ,
  PRIMARY KEY (`docente`, `franja`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`grupos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`grupos` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`grupos` (
  `cod_grupo` VARCHAR(8) NOT NULL DEFAULT '' ,
  `tut1_grupo` VARCHAR(6) NOT NULL DEFAULT '-' ,
  `tut2_grupo` VARCHAR(6) NOT NULL DEFAULT '-' ,
  `niv_grupo` VARCHAR(6) NOT NULL DEFAULT '-' ,
  `cur_grupo` CHAR(1) NOT NULL DEFAULT '-' ,
  PRIMARY KEY (`cod_grupo`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`horario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`horario` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`horario` (
  `docente` VARCHAR(6) NOT NULL ,
  `franja` VARCHAR(2) NOT NULL ,
  `dia` TINYINT(1) NOT NULL ,
  `sesion` VARCHAR(15) NOT NULL ,
  PRIMARY KEY (`docente`, `franja`, `dia`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`items`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`items` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `informe` INT(11) NOT NULL ,
  `item` LONGTEXT NOT NULL ,
  `valor` SET('s','n','v') NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`matricula`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`matricula` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`matricula` (
  `codigo` VARCHAR(6) NOT NULL ,
  `agrupamiento` VARCHAR(10) NOT NULL ,
  PRIMARY KEY (`codigo`, `agrupamiento`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`mensajes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`mensajes` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`mensajes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `remitente` VARCHAR(8) NOT NULL ,
  `destinatario` VARCHAR(8) NOT NULL ,
  `asunto` VARCHAR(250) NOT NULL ,
  `mensaje` LONGTEXT NOT NULL ,
  `lectura` SET('0','1') NOT NULL ,
  `borrador` SET('0','1') NOT NULL ,
  `fecha` DATETIME NOT NULL ,
  `tipo` SET('d','f','td','tf') NOT NULL ,
  `ocultorec` SET('0','1') NOT NULL ,
  `ocultoenv` SET('0','1') NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`notas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`notas` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`notas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `codigo` VARCHAR(6) NOT NULL ,
  `agrupamiento` VARCHAR(10) NOT NULL ,
  `fecha` DATE NOT NULL ,
  `actividad` VARCHAR(20) NOT NULL ,
  `nota` DECIMAL(4,2) NOT NULL ,
  `descripcion` LONGTEXT NOT NULL ,
  `comentario` LONGTEXT NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`observaciones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`observaciones` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`observaciones` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `codigo` VARCHAR(6) NOT NULL ,
  `agrupamiento` VARCHAR(10) NOT NULL ,
  `observacion` LONGTEXT NOT NULL ,
  `fecha` DATE NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`periodos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`periodos` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`periodos` (
  `periodo` VARCHAR(2) NOT NULL ,
  `nombre` VARCHAR(30) NOT NULL ,
  `inicio` DATE NOT NULL ,
  `fin` DATE NOT NULL ,
  PRIMARY KEY (`periodo`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`recuperaciones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`recuperaciones` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`recuperaciones` (
  `periodo` VARCHAR(2) NOT NULL ,
  `agrupamiento` VARCHAR(10) NOT NULL ,
  `codigo` VARCHAR(6) NOT NULL ,
  `nota` DECIMAL(4,2) NOT NULL ,
  PRIMARY KEY (`periodo`, `agrupamiento`, `codigo`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`tareas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`tareas` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`tareas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `codigo` VARCHAR(6) NOT NULL ,
  `agrupamiento` VARCHAR(10) NOT NULL ,
  `tarea` LONGTEXT NOT NULL ,
  `fecha_reg` DATE NOT NULL ,
  `fecha_ent` DATE NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`todosmensajes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`todosmensajes` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`todosmensajes` (
  `id` INT(11) NOT NULL DEFAULT '0' ,
  `destinatario` VARCHAR(6) NOT NULL ,
  PRIMARY KEY (`id`, `destinatario`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `siestta`.`tutoria`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siestta`.`tutoria` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `siestta`.`tutoria` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `codigo` VARCHAR(6) NOT NULL ,
  `agrupamiento` VARCHAR(10) NOT NULL ,
  `fecha` DATE NOT NULL ,
  `texto` LONGTEXT NOT NULL ,
  `destin` VARCHAR(6) NOT NULL ,
  `estado_recibido` SET('0','1') NOT NULL ,
  `estado_envio` SET('0','1') NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
