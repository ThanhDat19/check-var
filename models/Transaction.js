const mysql = require('mysql2');

// Kết nối tới MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'check_var'
});

// Mở kết nối
connection.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối tới MySQL: ', err);
    return;
  }
  console.log('Đã kết nối tới MySQL!');
});


const Transaction = {
  
  getAll: (callback) => {
    const sql = 'SELECT * FROM transactions';
    connection.query(sql, (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results);
    });
  },

  // Tìm kiếm theo `Code`, `Value`, và `Description`
  search: (query, callback) => {
   
    const sql = `
      SELECT * FROM transactions
      WHERE Code LIKE ? OR Value LIKE ? OR Description LIKE ?
    `;
    const searchTerm = `%${query}%`; 
    connection.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) return callback(err, null);
      return callback(null, results);
    });
  },

  
  create: (newTransaction, callback) => {
    const sql = 'INSERT INTO transactions (Date, Code, Value, Description) VALUES (?, ?, ?, ?)';
    connection.query(sql, [newTransaction.Date, newTransaction.Code, newTransaction.Value, newTransaction.Description], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result.insertId);
    });
  },

  
  deleteById: (id, callback) => {
    const sql = 'DELETE FROM transactions WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result.affectedRows);
    });
  }
};

module.exports = Transaction;
