const mysql = require('mysql2');
const fs = require('fs');
const csv = require('csv-parser');

// Hàm để tạo kết nối tới MySQL
function createConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'check_var'
  });
}

// Hàm để đọc CSV và chèn dữ liệu vào MySQL
function importCSVToMySQL(csvFilePath) {
  const connection = createConnection();

  // Mở kết nối
  connection.connect((err) => {
    if (err) {
      console.error('Lỗi kết nối đến MySQL: ', err);
      return;
    }
    console.log('Kết nối thành công!');
  });

  // Đọc file CSV và chèn dữ liệu vào MySQL
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const sql = 'INSERT INTO transactions (Date, Code, Value, Description) VALUES (?, ?, ?, ?)';

      connection.query(sql, [row.Date, row.Code, row.Value, row.Description], (err, result) => {
        if (err) {
          console.error('Lỗi khi chèn dữ liệu: ', err);
        } else {
          console.log('Chèn thành công:', result.insertId);
        }
      });
    })
    .on('end', () => {
      console.log('Hoàn thành việc đọc file CSV.');
      connection.end();
    });
}

// Xuất hàm dưới dạng module
module.exports = { importCSVToMySQL };
