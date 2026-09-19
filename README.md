# Programacion-Web

# 🩺 Sistema de Gestión Médica

Proyecto Integrador Incremental para la materia de 
**Programación Web** en la **Universidad de Panamá** 
(Facultad de Informática, Electrónica y Comunicación - Maestría en Ciencias Computacionales).

Aplicación web transaccional diseñada para la administración y seguimiento de turnos médicos en tiempo real, implementando una arquitectura desacoplada de tres capas con operaciones CRUD persistentes, control de sesiones y despliegue en la nube.

---

## 👥 Datos del Proyecto

* **Institución:** Universidad de Panamá
* **Facultad:** Facultad de Informática, Electrónica y Comunicación
* **Materia:** Programación Web (Módulo 6: Computación en la Nube y Servicios)
* **Docente:** MBA. Carlos V. Bruce Abbott
* **Integrantes:** 
  * José Castrellón
  * Job Forero
* **Fecha:** 19/09/2026

---

## 🌐 Enlaces y Acceso

* **Live Demo (Producción):** [https://gestion-medica-web.onrender.com/](https://gestion-medica-web.onrender.com/)
* **Repositorio de Código:** [https://github.com/castrellon13/gestion-medica-web](https://github.com/castrellon13/gestion-medica-web)
* **Credenciales de Acceso:**
  * **Usuario:** `admin`
  * **Contraseña:** `admin123`

---

## 🏛️ Arquitectura del Sistema

El sistema implementa una arquitectura desacoplada en tres niveles:

1. **Frontend (Capa de Presentación):**
   * Estructuración semántica con **HTML5** (`<main>`, `<aside>`, `<nav>`, `<header>`, `<section>`).
   * Diseño y panel responsivo estilizado con **CSS3 puro**.
   * Manipulación dinámica del DOM, consumo asíncrono de APIs y gestión de eventos mediante **JavaScript (ES6+)** y **jQuery 3.7.1**.
2. **Backend (Capa Lógica y Servicios API):**
   * Entorno de ejecución en **Node.js** con framework **Express**.
   * Sesiones persistentes basadas en cookies mediante `express-session`.
   * Sanitización de datos de entrada contra inyecciones y ataques XSS con `express-validator`.
   * Soporte de orígenes cruzados vía `cors` con soporte para credenciales/cookies.
3. **Persistencia (Capa de Datos en la Nube):**
   * Motor relacional **MySQL** aprovisionado de forma remota en **Clever Cloud**.
   * Comunicación optimizada y consultas parametrizadas mediante el controlador `mysql2`.

---

## ☁️ Infraestructura y Despliegue en la Nube

* **Servidor de Aplicación (Backend & Estáticos):** Desplegado en **Render** como un Web Service de Node.js, configurado para escucha en puerto dinámico (`process.env.PORT`) y despliegue continuo desde la rama `main` de GitHub.
* **Base de Datos Gestionada:** Instancia MySQL alojada en **Clever Cloud**, gestionada a través de phpMyAdmin para la importación del esquema relacional.
* **Seguridad de Configuración:** Inyección segura de variables de entorno (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`) directamente en el panel de control de Render, protegiendo credenciales sensibles fuera del repositorio público.

---

## 📂 Estructura del Repositorio

```text
gestion-medica-web/
├── css/
│   └── style.css            # Estilos del dashboard, modales, tarjetas y formularios
├── js/
│   └── script.js            # Lógica cliente, consumo fetch API, DOM y filtros jQuery
├── .gitignore               # Exclusión de node_modules y archivos locales
├── index.html               # Estructura semántica SPA (Login, Listado, Formulario)
├── package.json             # Dependencias y scripts de ejecución
├── package-lock.json        # Árbol de dependencias bloqueado
├── README.md                # Documentación técnica del proyecto
└── server.js                # Servidor Express, conexión MySQL y API REST


## 🔌 Especificación de la API REST

| Método | Endpoint | Descripción | Parámetros / Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Autenticación de usuarios e inicio de sesión | `{ usuario, password }` |
| `GET` | `/api/citas` | Obtiene el listado completo de citas ordenadas desc. | Ninguno |
| `POST` | `/api/citas` | Crea un nuevo turno médico (sanitizado con express-validator) | `{ nombre_paciente, codigo_seguro, especialidad }` |
| `PUT` | `/api/citas/:id` | Alterna o actualiza el estado de la cita (`activo` / `pasado`) | `{ estado }` |
| `DELETE` | `/api/citas/:id` | Elimina físicamente el registro de la base de datos | Parámetro en URL (`:id`) |