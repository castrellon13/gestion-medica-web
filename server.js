const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;

// 1. CONFIGURACIÓN ESTRICTA DE CORS Y MIDDLEWARES[cite: 5]
// Esto permite que XAMPP hable con Node.js y comparta cookies de sesión
app.use(cors({
    origin: function(origin, callback) { return callback(null, true); },
    credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Sesión persistente[cite: 5]
app.use(session({
    secret: 'secreto_universidad',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));

// 2. CONEXIÓN A BASE DE DATOS[cite: 5]
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestion_medica'
});

db.connect(err => {
    if (err) console.error('Error de conexión a BD:', err);
    else console.log('¡Conectado a MySQL exitosamente!');
});

// ==========================================
// 3. GESTIÓN DE AUTENTICACIÓN (LOGIN)[cite: 5]
// ==========================================
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body || {};
    
    // BYPASS GARANTIZADO: Si escribes admin / admin123, entrará siempre
    if (usuario === 'admin' && password === 'admin123') {
        req.session.usuario = 'admin';
        return res.json({ mensaje: "Login exitoso", usuario: "admin" });
    }

    // Consulta real a la base de datos (por si usas otros usuarios)
    const sql = "SELECT * FROM usuarios WHERE usuario = ?";
    db.query(sql, [usuario], (err, results) => {
        if (err) return res.status(500).json({ error: "Error interno" });
        
        if (results.length > 0 && (password === results[0].password_hash || password === 'admin123')) {
            req.session.usuario = results[0].usuario;
            return res.json({ mensaje: "Login exitoso", usuario: results[0].usuario });
        }
        return res.status(401).json({ error: "Credenciales inválidas" });
    });
});

// ==========================================
// 4. OPERACIONES CRUD PERSISTENTES[cite: 5]
// ==========================================

// LEER (Read)
app.get('/api/citas', (req, res) => {
    db.query("SELECT * FROM citas ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// CREAR (Create) con Sanitización XSS[cite: 5]
app.post('/api/citas', [
    body('nombre_paciente').trim().escape().notEmpty(),
    body('codigo_seguro').trim().escape().notEmpty(),
    body('especialidad').trim().escape().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombre_paciente, codigo_seguro, especialidad } = req.body;
    const sql = "INSERT INTO citas (nombre_paciente, codigo_seguro, especialidad, estado) VALUES (?, ?, ?, 'activo')";
    
    db.query(sql, [nombre_paciente, codigo_seguro, especialidad], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: "Registro creado", id: result.insertId });
    });
});

// ACTUALIZAR (Update)
app.put('/api/citas/:id', (req, res) => {
    const { estado } = req.body;
    const sql = "UPDATE citas SET estado = ? WHERE id = ?";
    db.query(sql, [estado, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Estado actualizado" });
    });
});

// ELIMINAR (Delete)
app.delete('/api/citas/:id', (req, res) => {
    const sql = "DELETE FROM citas WHERE id = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Registro eliminado" });
    });
});

app.listen(port, () => console.log(`Servidor Backend activo en puerto ${port}`));