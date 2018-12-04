const mysql = require('mysql2')

const dbconfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_DATABASE || 'gamedb',
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbconfig)

console.log(`Connected to database: ${dbconfig.database} with user ${dbconfig.user}.`)
module.exports = pool