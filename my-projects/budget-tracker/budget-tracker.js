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

/* TRANSACTION TYPES */
const outCategories = [
  "Housing",
  "Transportation",
  "Car",
  "Utilities",
  "Cards",
  "Loan",
  "Shopping",
  "Travel",
  "Food",
  "Groceries",
  "Health",
  "Entertainment",
  "Others"
];

const incomeCategories = [
  "Salary",
  "Freelance",
  "Gift",
  "Bonus",
  "Refund",
  "Allowance"
];

let selectedType = "Income";

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
            .includes(searchQuery) ||

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

    return;
  }

  filteredTransactions.forEach(transaction => {
    tbody.innerHTML += `
        <tr>
        <td>
            <span class="type-pill type-${transaction.type.toLowerCase().replace(/\s/g, "-")}">
            ${transaction.type}
            </span>
        </td>
        <td>${transaction.category}</td>
        <td>${transaction.description}</td>
        <td>₱${Number(transaction.amount).toLocaleString()}</td>
        <td>${transaction.dueDate}</td>
        <td>
            <span class="status-pill status-${transaction.status.toLowerCase().replace(/\s/g, "-")}">
            ${transaction.status}
            </span>
        </td>
        <td></td>

        <td>
            <button class="actions-btn">•••</button>
        </td>

        </tr>
    `;
    });
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
  document
    .getElementById("transactionModal")
    .classList.add("active");
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

    outCategories.forEach(category => {
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
    status: "Unpaid"
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