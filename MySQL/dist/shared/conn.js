import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'kimey',
    password: process.env.DB_PASSWORD || 'kimey',
    database: process.env.DB_NAME || 'poc_MySQL',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});
//# sourceMappingURL=conn.js.map