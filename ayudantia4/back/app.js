// Backend mínimo SOLO PARA LOGIN (extraído de tu código)
// Requisitos: npm i express cookie-parser express-session mongoose jsonwebtoken cors
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// --- Middlewares base ---
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Habilita CORS para el front (ajusta origin si usas otra URL/puerto)
app.use(cors({
  origin: 'http://localhost:5500', // por ejemplo si sirves el front con Live Server
  credentials: true
}));

// servir archivos estáticos del front (css/js/imágenes si los hubiera)
app.use(express.static(path.join(__dirname, '../front')));

app.use(session({
  secret: 'mi_secreto', // cambia en producción
  resave: false,
  saveUninitialized: true
}));

// --- Conexión a MongoDB (usa tu cadena real) ---
mongoose.connect('mongodb+srv://taru:123@dwebayudantia.a9gpiys.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB OK'))
  .catch(err=> console.error('MongoDB ERROR', err));

// --- Esquema y modelo User (igual que tuyo, pero solo lo necesario) ---
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }, // (plaintext como tu ejemplo original)
  saldo:    { type: Number, default: 0 }
});
const User = mongoose.model('User', userSchema);
app.get('/login', (_req, res) => {
    res.sendFile(path.join(__dirname, '../front', 'login.html'));
  });
// --- Helpers JWT (mismo patrón que compartiste) ---
function generarToken(usuario) {
  const payload = {
    userId: usuario.id,
    sessionId: usuario.sessionId, // opcional si no lo usas
    email: usuario.email
  };
  return jwt.sign(payload, 'secreto', { expiresIn: '1h' });
}

function verificarToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    console.log('No posee cookie de autenticación');
    return res.status(401).json({ ok: false, message: 'No autenticado' });
  }
  jwt.verify(token, 'secreto', (err, decoded) => {
    if (err) {
      console.log('Cookie de autenticación inválida');
      return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
    }
    req.user = decoded;
    req.session.emailSesion = decoded.email;
    next();
  });
}

// --- Rutas SOLO de login/logout y verificación ---
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Faltan datos' });
    }

    // Tu código original hacía match directo por password (sin hash)
    const user = await User.findOne({ email, password }).lean();
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
    }

    const token = generarToken(user);

    // cookie httpOnly (más seguro). Si necesitas leerla en front, quita httpOnly (menos seguro).
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000 // 1h
      // secure: true // actívalo si usas HTTPS
    });

    req.session.emailSesion = email;
    console.log('Inicio de sesión exitoso');

    return res.json({
      ok: true,
      message: 'Login OK',
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error('Error en /login:', err);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  req.session.emailSesion = null;
  return res.json({ ok: true, message: 'Sesión cerrada' });
});

// Endpoint para que el front valide sesión y obtenga perfil
app.get('/me', verificarToken, async (req, res) => {
  try {
    const u = await User.findById(req.user.userId).lean();
    if (!u) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    return res.json({ ok: true, user: { id: u._id, email: u.email, name: u.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Error interno' });
  }
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
