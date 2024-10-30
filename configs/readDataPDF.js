const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// CSV Configuration
const csvWriter = createCsvWriter({
    path: path.join(__dirname, 'transactions.csv'),
    header: [
        { id: 'Date', title: 'Date' },
        { id: 'Code', title: 'Code' },
        { id: 'Value', title: 'Value' },
        { id: 'Description', title: 'Description' }
    ]
});

async function readDataPDF() {
    try {
        let dataBuffer = fs.readFileSync(path.join(__dirname, 'thong-tin-ung-ho-qua-TSK-VCB-0011001932418-tu-01.09-den10.09.2024.pdf'));
        
        const data = await pdf(dataBuffer); 
        const rawText = data.text;
        const lines = rawText.split('\n');
        let transactions = [];
        let transaction = {};

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Checking for dates like 01/09/2024
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmedLine)) {
                // If we have a transaction in progress, add it to the transactions array
                if (transaction.Date) {
                    transactions.push(transaction);
                }
                // Start new transaction
                transaction = {
                    Date: trimmedLine,
                    Code: '',
                    Value: '',
                    Description: ''
                };
            } else if (transaction.Date) {
                if (!transaction.Code) {
                    transaction.DocNo = trimmedLine; 
                } else if (!transaction.Value && !isNaN(parseFloat(trimmedLine))) {
                    transaction.Value = trimmedLine; 
                } else {
                    transaction.Description += trimmedLine + ' '; 
                }
            }
        }

        // Insert the last transaction if it exists
        if (transaction.Date) {
            transactions.push(transaction);
        }

        // Write transactions to CSV
        await csvWriter.writeRecords(transactions);
        console.log('Transactions successfully saved to transactions.csv');
    } catch (error) {
        console.error(`Error reading PDF: ${error}`);
    }
}

// Call the function to parse PDF and save transactions to CSV
readDataPDF();

module.exports = { readDataPDF };
