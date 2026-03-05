const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();


// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { email, password,rol } = req.body;
    //console.log(email+" "+password+" "+rol);
    const existing = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query(
      'INSERT INTO users (email, password,rol) VALUES ($1, $2, $3)',
      [email, hashedPassword,rol]
    );

    res.status(201).json({ message: 'Usuario creado' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error servidor' });
  }
});


// LOGIN
/*
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email "+email+"password "+password)
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error servidor' });
  }
});
*/
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email "+ email+" password " + password)
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    console.log(result.rows)
    if (result.rows.length === 0) {
        console.log("Error")
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // 🔥 Access Token (corto)
    const accessToken = jwt.sign(
      { id: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    // 🔥 Refresh Token (largo)
    const refreshToken = jwt.sign(
      { id: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ accessToken, refreshToken });

  } catch (error) {
    res.status(500).json({ message: 'Error servidor' });
  }
});

//REFRESH
/*
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    res.status(403).json({ message: "Refresh inválido" });
  }
});
*/
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "No autorizado" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Refresh inválido" });
    }

    const newAccessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  });
});

module.exports = router;