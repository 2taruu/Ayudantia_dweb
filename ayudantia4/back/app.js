// llegar y correr en la terminal: 
// npm i express cookie-parser express-session cors jsonwebtoken bcrypt mongoose dotenv
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

// ========= Middlewares =========
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], // ajusta si usas otro origen
  credentials: true
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto',
  resave: false,
  saveUninitialized: true
}));

// Servir front (html, css, js) desde /front
app.use(express.static(path.join(__dirname, '../front')));

// ========= MongoDB (Mongoose) =========
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Falta el campo MONGODB_URI en .env');
  process.exit(1);
}
mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
  tls: true,
}).then(() => {
  console.log('MongoDB OK');
}).catch(err => {
  console.error('MongoDB ERROR:', err);
});

// ========= Modelos =========
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rut:  { type: String, required: true, unique: true }, // normalizado
  email:{ type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  created_at: { type: Date, default: Date.now }
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

// ========= Utilidades =========
// Normaliza RUT: quita puntos/espacios, deja guión antes del dígito verificador
// En caso de no utilizar rut, simplemente no llamar a la funcion normalizeRut
function normalizeRut(rutRaw) {
  const s = String(rutRaw || '').toUpperCase().replace(/[.\s]/g, '');
  if (s.includes('-')) return s;
  const body = s.slice(0, -1);
  const dv = s.slice(-1);
  return `${body}-${dv}`;
}

// Valida DV del RUT (módulo 11). Acepta K como 10.
// En caso de no utilizar rut, simplemente no llamar a la funcion validateRut

function validateRut(rutRaw) {
  const rut = normalizeRut(rutRaw);
  const m = rut.match(/^(\d+)-([\dK])$/i);
  if (!m) return false;
  const body = m[1];
  const dv = m[2];
  let sum = 0, mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const res = 11 - (sum % 11);
  const dvCalc = (res === 11) ? '0' : (res === 10 ? 'K' : String(res));
  return dvCalc === dv.toUpperCase();
}

// lee el .env, en caso de no encontrar JWT_SECRET utiliza 'mi-secreto'
const JWT_SECRET = process.env.JWT_SECRET || 'mi-secreto';
// duracion de la sesion de jwt
const JWT_EXPIRES_IN = '1h';
// generacion de token para la sesion a partir de un usuario
function generarToken(user) {
  // En Mongo, _id es ObjectId. Exponemos como string.
  return jwt.sign(
    { sub: String(user._id), rut: user.rut, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}
// verificacion del token
function verificarToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ ok: false, message: 'No autenticado' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.session.emailSesion = decoded.email;
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
  }
}

// ========= Rutas básicas de front =========
// get para renderizar login
app.get('/login', (_req, res) => {
  res.sendFile(path.join(__dirname, '../front', 'login.html'));
});
// get para renderizar register
app.get('/register', (_req, res) => {
  res.sendFile(path.join(__dirname, '../front', 'register.html')); // opcional si lo usas
});
// aplica que la url "/" redirige a "/login"
app.get('/', (_req, res) => res.redirect('/login'));

// ========= Auth: Register & Login por RUT =========
// POST /register  { name, rut, email, password, role }
app.post('/register', async (req, res) => {
  try {
    const { name, rut, email, password, role } = req.body || {};
    if (!name || !rut || !email || !password || !role) {
      return res.status(400).json({ ok: false, message: 'Faltan campos' });
    }
    if (!validateRut(rut)) {
      return res.status(400).json({ ok: false, message: 'RUT inválido' });
    }
    const rutNorm = normalizeRut(rut);

    // ¿rut o email ya existen?
    const exists = await User.exists({ $or: [{ rut: rutNorm }, { email }] });
    if (exists) {
      return res.status(409).json({ ok: false, message: 'RUT o Email ya registrado' });
    }

    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await User.create({
      name, rut: rutNorm, email, password_hash, role
    });

    const token = generarToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000
      // secure: true // en producción con HTTPS
    });
    return res.json({
      ok: true,
      message: 'Registro OK',
      user: {
        id: String(user._id),
        name: user.name, rut: user.rut, email: user.email, role: user.role, created_at: user.created_at
      }
    });
  } catch (err) {
    console.error('Error /register:', err);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// POST /login  { rut, password }
app.post('/login', async (req, res) => {
  try {
    const { rut, password } = req.body || {};
    if (!rut || !password) {
      return res.status(400).json({ ok: false, message: 'Faltan datos' });
    }
    const rutNorm = normalizeRut(rut);

    const user = await User.findOne({ rut: rutNorm }).lean();
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
    }

    const okPass = await bcrypt.compare(password, user.password_hash);
    if (!okPass) {
      return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
    }

    const token = generarToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000
    });

    req.session.emailSesion = user.email;
    return res.json({
      ok: true,
      message: 'Login OK',
      user: { id: String(user._id), name: user.name, rut: user.rut, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Error /login:', err);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// GET /me  (perfil)
app.get('/me', verificarToken, async (req, res) => {
  try {
    const u = await User.findById(req.user.sub).lean();
    if (!u) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    return res.json({
      ok: true,
      user: {
        id: String(u._id), name: u.name, rut: u.rut, email: u.email, role: u.role, created_at: u.created_at
      }
    });
  } catch (err) {
    console.error('Error /me:', err);
    return res.status(500).json({ ok: false, message: 'Error interno' });
  }
});

// POST /logout
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  req.session.emailSesion = null;
  return res.json({ ok: true, message: 'Sesión cerrada' });
});

app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
