const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

  /*EN VERCEL.JSON
  ,
    "routes": [
      {
        "src": "/(.*)",
        "dest": "index.js"
      }
    ]
  */

module.exports = pool;
