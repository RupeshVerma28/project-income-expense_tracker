// Select DOM elements
const balance = document.getElementById('balance');
const incomeAmount = document.getElementById('income-amount');
const expenseAmount = document.getElementById('expense-amount');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const downloadPdfButton = document.getElementById('download-pdf');

// Initial values
let transactions = [];

// Function to update the balance, income, and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const totalBalance = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const totalIncome = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);
  const totalExpense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  balance.innerText = `₹${totalBalance}`;
  incomeAmount.innerText = `₹${totalIncome}`;
  expenseAmount.innerText = `₹${Math.abs(totalExpense)}`;
}

// Function to add a new transaction to the list
function addTransactionToDOM(transaction) {
  const sign = transaction.amount > 0 ? '+' : '-';
  const li = document.createElement('li');
  li.classList.add('transaction', transaction.amount > 0 ? 'income' : 'expense');
  li.innerHTML = `
    ${transaction.description} <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  transactionList.appendChild(li);
}

// Function to remove a transaction
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateUI();
}

// Function to update the UI with the new transaction
function updateUI() {
  transactionList.innerHTML = '';
  transactions.forEach(addTransactionToDOM);
  updateValues();
}

// Add transaction form submit
form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '') {
    alert('Please add a description and amount');
    return;
  }

  const transaction = {
    id: Date.now(),
    description: descriptionInput.value,
    amount: +amountInput.value
  };

  transactions.push(transaction);
  updateUI();

  descriptionInput.value = '';
  amountInput.value = '';
});

// Function to generate and download the PDF
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Income and Expense Report', 20, 20);

  // Balance
  doc.setFontSize(12);
  doc.text(`Balance: ${balance.innerText}`, 20, 40);

  // Income and Expense Summary
  doc.text(`Total Income: ${incomeAmount.innerText}`, 20, 50);
  doc.text(`Total Expense: ${expenseAmount.innerText}`, 20, 60);

  // Transaction History
  doc.setFontSize(14);
  doc.text('Transaction History:', 20, 80);
  
  let y = 90;
  transactions.forEach(transaction => {
    const sign = transaction.amount > 0 ? '+' : '-';
    doc.text(`${transaction.description}: ${sign}₹${Math.abs(transaction.amount)}`, 20, y);
    y += 10;
  });

  // Download PDF
  doc.save('income-expense-report.pdf');
}

// Add event listener for the download button
downloadPdfButton.addEventListener('click', generatePDF);
