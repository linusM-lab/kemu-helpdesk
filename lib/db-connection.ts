import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || '41.89.31.99',
  user: process.env.DB_USER || 'kemu_heldesk',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'kemu_helpdesk',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Execute a query
async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Get a single row
async function getOne(sql: string, params: any[] = []) {
  try {
    const results = await query(sql, params) as any[];
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    throw error;
  }
}

// Insert a row and return the inserted ID
async function insert(sql: string, params: any[] = []) {
  try {
    const [result] = await pool.execute(sql, params) as any;
    return result.insertId;
  } catch (error) {
    console.error('Insert error:', error);
    throw error;
  }
}

// Update rows
async function update(sql: string, params: any[] = []) {
  try {
    const [result] = await pool.execute(sql, params) as any;
    return result.affectedRows;
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
}

// Delete rows
async function remove(sql: string, params: any[] = []) {
  try {
    const [result] = await pool.execute(sql, params) as any;
    return result.affectedRows;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

export {
  pool,
  testConnection,
  query,
  getOne,
  insert,
  update,
  remove
};
