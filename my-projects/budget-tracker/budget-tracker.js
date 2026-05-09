let transactions = JSON.parse(localStorage.getItem("transactions")) || []; /* LOCAL STORAGE */
let currentPage = 1;
const rowsPerPage = 10;
let currentDate = new Date(); /* MONTH STATE */
let filters = {
  category: "",
  type: "",
  status: ""
};
let searchQuery = "";
let currentSort = {
  field: "createdAt",
  direction: "desc"
};

/* TRANSACTION TYPES */
const categoriesByType = {
  "Fixed Expense": [
    "Housing",
    "Insurance",
    "Tuition",
    "Internet",
    "Mobile Plan",
    "Others"
  ],

  "Variable Expense": [
    "Transportation",
    "Car",
    "Utilities",
    "Credit Cards",
    "Shopping",
    "Travel",
    "Food",
    "Groceries",
    "Health",
    "Entertainment",
    "Others"
  ],

  "Subscription": [
    "Entertainment",
    "Software",
    "Others"
  ],

  "Loan": [
    "Loan",
    "Others"
  ]
};

const incomeCategories = [
  "Salary",
  "Freelance",
  "Gift",
  "Bonus",
  "Refund",
  "Allowance"
];

let selectedType = "Variable Expense";

function getTypeClass(type) {
  switch (type) {
    case "Income":
      return "type-income";
    case "Fixed Expense":
      return "type-fixed";
    case "Variable Expense":
      return "type-variable";
    case "Subscription":
      return "type-subscription";
    case "Loan":
      return "type-loan";
    default:
      return "";
  }
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {

  updateCurrentMonth();
  renderTransactions();
  updateSummaryCards();

  /* SEARCH */

  document
    .getElementById("searchInput")
    .addEventListener("input", (e) => {
      searchQuery = e.target.value
        .trim()
        .toLowerCase();

      currentPage = 1;
      renderTransactions();
    });
});

/* MONTH NAVIGATION */
function updateCurrentMonth() {
  const monthYear =
    currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });

  document.getElementById("currentMonth").textContent =
    monthYear;

}

document 
  .getElementById("prevMonth")
  .addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCurrentMonth();
  });

document
  .getElementById("nextMonth")
  .addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCurrentMonth();
  });

/* RENDER TRANSACTIONS */
function renderTransactions() {
  const tbody = document.getElementById("transactionsTableBody");
  tbody.innerHTML = "";

  let filteredTransactions = [...transactions];

  /* SEARCH */
  if (searchQuery) {
    filteredTransactions =
      filteredTransactions.filter(transaction => {
        return (
          transaction.description
            ?.toLowerCase()
            .includes(searchQuery)

          ||

          transaction.category
            ?.toLowerCase()
            .includes(searchQuery)
        );
      });
  }

  /* EMPTY */
  if (filteredTransactions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          No transactions yet.
        </td>
      </tr>
    `;

    updatePagination(0);
    return;
  }

  /* PAGINATION */
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex,endIndex);

  /* RENDER ROWS */
  paginatedTransactions.forEach(transaction => {
    tbody.innerHTML += `
      <tr>
        <td>
          <span class="type-pill ${getTypeClass(transaction.type)}">
            ${transaction.type}
          </span>
        </td>

        <td>${transaction.category}</td>

        <td>${transaction.description}</td>

        <td>₱ ${Number(transaction.amount).toLocaleString()}</td>

        <td>${transaction.dueDate}</td>

        <td>
          ${
            transaction.status === "N/A"
            ? `<span class="status-na">N/A</span>`
            : `<span class="status-pill status-${transaction.status.toLowerCase().replace(/\s/g, "-")}">${transaction.status}</span>`
          }
        </td>

        <td></td>

        <td>
          <button class="actions-btn">•••</button>
        </td>
      </tr>
    `;
  });

  updatePagination(filteredTransactions.length);
}

function updatePagination(totalEntries) {
  const pagination = document.getElementById("pagination");
  const paginationInfo = document.querySelector(".pagination-info");
  pagination.innerHTML = "";
  const totalPages = Math.ceil(totalEntries / rowsPerPage);

  /* INFO */
  const startEntry =
    totalEntries === 0
      ? 0
      : (currentPage - 1) * rowsPerPage + 1;

  const endEntry = Math.min(currentPage * rowsPerPage,totalEntries);
  paginationInfo.textContent = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  /* PREVIOUS */
  const prevButton = document.createElement("span");
  prevButton.className = `page ${currentPage === 1 ? "disabled" : ""}`;
  prevButton.innerHTML = "&lt;";

  if (currentPage > 1) {
    prevButton.addEventListener("click", () => {
      currentPage--;
      renderTransactions();
    });
  }

  pagination.appendChild(prevButton);

  /* PAGE NUMBERS */
  for (let i = 1; i <= totalPages; i++) {
    const page = document.createElement("span");
    page.className = `page ${i === currentPage ? "active" : ""}`;
    page.textContent = i;
    page.addEventListener("click", () => {
      currentPage = i;
      renderTransactions();
    });

    pagination.appendChild(page);
  }

  /* NEXT */
  const nextButton = document.createElement("span");
  nextButton.className = `page ${currentPage === totalPages ? "disabled" : ""}`;
  nextButton.innerHTML = "&gt;";

  if (currentPage < totalPages) {
    nextButton.addEventListener("click", () => {
      currentPage++;
      renderTransactions();
    });
  }
  pagination.appendChild(nextButton);
}

/* SUMMARY CARDS */
function updateSummaryCards() {
  document.getElementById("totalIncome").textContent = "₱0.00";
  document.getElementById("totalExpenses").textContent = "₱0.00";
  document.getElementById("remainingBudget").textContent = "₱0.00";
  document.getElementById("upcomingPayments").textContent = "₱0.00";
}

/* UPCOMING PAYMENTS */
function filterUpcomingPayments() {
  console.log("Upcoming payments clicked");
}

/* MODAL */
function openTransactionModal() {
  document.getElementById("transactionModal").classList.add("active");

  /* RESET TYPE */
  selectedType = "Variable Expense";
  typeButtons.forEach(btn => btn.classList.remove("active"));

  document.querySelector('[data-type="Variable Expense"]').classList.add("active");

  /* CLEAR FIELDS */
  document.getElementById("transactionDescription").value = "";
  document.getElementById("transactionAmount").value = "";
  document.getElementById("transactionDueDate").value = "";
  document.getElementById("repeatStarting").value = "";
  document.getElementById("repeatUntil").value = "";
  document.getElementById("recurringCheckbox").checked = false;

  document.getElementById("recurringOptions").classList.remove("active");
  updateTransactionModal();
}

function closeTransactionModal() {
  document
    .getElementById("transactionModal")
    .classList.remove("active");

  document
    .getElementById("recurringCheckbox")
    .checked = false;

  document
    .getElementById("recurringOptions")
    .classList.remove("active");
}

/* TYPE SWITCHING */
const typeButtons = document.querySelectorAll(".type-select-btn");
typeButtons.forEach(button => {
  button.addEventListener("click", () => {
    typeButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");
    selectedType = button.dataset.type;

    updateTransactionModal();
  });
});

/* UPDATE MODAL */
function updateTransactionModal() {
  const categorySelect = document.getElementById("transactionCategory");
  const dueDateGroup = document.getElementById("dueDateGroup");
  const recurringWrapper = document.getElementById("recurringWrapper");
  categorySelect.innerHTML = "";

  /* INCOME */
  if (selectedType === "Income") {
    dueDateGroup.style.display = "none";
    recurringWrapper.style.display = "none";
    incomeCategories.forEach(category => {
      categorySelect.innerHTML += `
        <option value="${category}">
          ${category}
        </option>
      `;
    });
  }

  /* EXPENSES */
  else {
    dueDateGroup.style.display = "flex";
    recurringWrapper.style.display = "block";
    categoriesByType[selectedType]
      .forEach(category => {
        categorySelect.innerHTML += `
          <option value="${category}">
            ${category}
          </option>
        `;
      });
  }
}

/* RECURRING TOGGLE */
document
  .getElementById("recurringCheckbox")
  .addEventListener("change", (e) => {
    document
      .getElementById("recurringOptions")
      .classList.toggle(
        "active",
        e.target.checked
      );
  });

/* SAVE TRANSACTION */
function saveTransaction() {
  const category = document.getElementById("transactionCategory").value;
  const description = document.getElementById("transactionDescription").value;
  const amount = document.getElementById("transactionAmount").value;
  const dueDate = document.getElementById("transactionDueDate").value;
  const recurring = document.getElementById("recurringCheckbox").checked;
  const transaction = {
    type: selectedType,
    category,
    description,
    amount,
    dueDate,
    recurring,
    status: "Unpaid",
    createdAt: Date.now()
  };

  /* INCOME */
  if (selectedType === "Income") {
    transaction.status = "N/A";
    transaction.dueDate = "N/A";
  }

  transactions.push(transaction);

  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );

  renderTransactions();
  closeTransactionModal();
}