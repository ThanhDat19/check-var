const Transaction = require("../models/Transaction");


const TransactionController = {
  
  getAll: (req, res) => {
    Transaction.getAll((err, transactions) => {
      if (err) return res.status(500).json({ error: err });
      
      return res.render("transactions", { transactions });
    });
  },


  search: (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    Transaction.search(query, (err, transactions) => {
      if (err) return res.status(500).json({ error: err });
      return res.status(200).json({
        transactions: transactions || [],
        query,
        title: "Kết Quả Tìm Kiếm",
      });
    });
  },


  create: (req, res) => {
    const newTransaction = {
      Date: req.body.Date,
      Code: req.body.Code,
      Value: req.body.Value,
      Description: req.body.Description,
    };

    Transaction.create(newTransaction, (err, transactionId) => {
      if (err) return res.status(500).json({ error: err });
      return res
        .status(201)
        .json({ message: "Giao dịch đã được tạo", id: transactionId });
    });
  },


  deleteById: (req, res) => {
    const id = req.params.id;
    Transaction.deleteById(id, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result === 0)
        return res.status(404).json({ message: "Giao dịch không tồn tại" });
      return res.status(200).json({ message: "Giao dịch đã được xóa" });
    });
  },
};

module.exports = TransactionController;
