const mysql = require('mysql2/promise');
require('dotenv/config');

const pool = mysql.createPool({
    host: 'sql6.freesqldatabase.com',
    user: 'sql6692423',
    password: 'DUukETYzic',
    database: 'sql6692423',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    getConnection: function () {
        return pool.getConnection();
    }
};
