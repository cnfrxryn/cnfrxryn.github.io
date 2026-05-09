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
let currentSort = null;
let currentView = "transactions";

document.querySelectorAll(".sortable-header").forEach(header => {
  header.addEventListener("click", () => {
    const field = header.dataset.sort;

    /* FIRST SORT */
    if (!currentSort) {
      currentSort = {
        field,
        direction: "asc"
      };
    }

    /* SAME FIELD */
    else if (currentSort.field === field) {
      currentSort.direction =
        currentSort.direction === "asc"
          ? "desc"
          : "asc";
    }

    /* NEW FIELD */
    else {
      currentSort = {
        field,
        direction: "asc"
      };
    }

    /* ACTIVE HEADER */
    document.querySelectorAll(".sortable-header").forEach(th => th.classList.remove("active-sort"));
    header.classList.add("active-sort");
    renderTransactions();
  });
});

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
  "Allowance",
  "Others"
];

let selectedType = "Variable Expense";
let editingIndex = null;
let deletingIndex = null;

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

  /* TABS */
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t =>
        t.classList.remove("active")
      );

      tab.classList.add("active");

      currentView = tab.textContent.trim() === "Subscriptions"
        ? "subscriptions"
        : "transactions";

      currentPage = 1;

      updateFilterDropdowns();
      renderTransactions();
    });
  });

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

  /* FILTERS */
  document.getElementById("filterCategory")
    .addEventListener("change", (e) => {

      filters.category = e.target.value;
      currentPage = 1;

      updateFilterDropdowns();
      renderTransactions();
    });

  document.getElementById("filterType")
    .addEventListener("change", (e) => {

      filters.type = e.target.value;
      currentPage = 1;

      updateFilterDropdowns();
      renderTransactions();
    });

  document.getElementById("filterStatus")
    .addEventListener("change", (e) => {

      filters.status = e.target.value;
      currentPage = 1;

      updateFilterDropdowns();
      renderTransactions();
    });

  updateFilterDropdowns();
});

/* FILTER DROPDOWNS */
function updateFilterDropdowns() {
  const categoryDropdown = document.getElementById("filterCategory");
  const typeDropdown = document.getElementById("filterType");
  const statusDropdown = document.getElementById("filterStatus");

  let filteredData = [...transactions];

  /* SUBSCRIPTIONS VIEW */
  if (currentView === "subscriptions") {
    filteredData = filteredData.filter(transaction => transaction.type === "Subscription");
    filters.type = "Subscription";

    typeDropdown.disabled = true;
  }

  else {
    typeDropdown.disabled = false;
  }

  /* DEPENDENT FILTERS */
  if (filters.category) {
    filteredData = filteredData.filter(transaction => transaction.category === filters.category);
  }

  if (filters.type) {
    filteredData = filteredData.filter(transaction => transaction.type === filters.type);
  }

  if (filters.status) {
    filteredData = filteredData.filter(transaction => transaction.status === filters.status);
  }

  /* UNIQUE VALUES */
  const categories = 
    [...new Set(filteredData.map(t => t.category))]
      .filter(Boolean);

  const types =
    [...new Set(filteredData.map(t => t.type))]
      .filter(Boolean);

  const statuses =
    [...new Set(filteredData.map(t => t.status))]
      .filter(Boolean);

  /* CATEGORY */
  categoryDropdown.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach(category => {
    categoryDropdown.innerHTML += `
      <option value="${category}"
        ${filters.category === category ? "selected" : ""}>
        ${category}
      </option>
    `;
  });

  /* TYPE */
  typeDropdown.innerHTML = `<option value="">All Types</option>`;
  types.forEach(type => {
    typeDropdown.innerHTML += `
      <option value="${type}"
        ${filters.type === type ? "selected" : ""}>
        ${type}
      </option>
    `;
  });

  /* STATUS */
  statusDropdown.innerHTML = `<option value="">All Status</option>`;
  statuses.forEach(status => {
    statusDropdown.innerHTML += `
      <option value="${status}"
        ${filters.status === status ? "selected" : ""}>
        ${status}
      </option>
    `;
  });
}

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
    updateSummaryCards();
  });

document
  .getElementById("nextMonth")
  .addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCurrentMonth();
    updateSummaryCards();
  });

/* RENDER TRANSACTIONS */
function renderTransactions() {
  const tbody = document.getElementById("transactionsTableBody");
  tbody.innerHTML = "";

  const tableHeadRow = document.querySelector("thead tr");
  if (currentView === "subscriptions") {
    tableHeadRow.innerHTML = `
      <th>CATEGORY</th>
      <th>DESCRIPTION</th>
      <th>AMOUNT</th>
      <th>DUE</th>
      <th>STATUS</th>
      <th>BILLING CYCLE</th>
      <th>NEXT DUE</th>
      <th>ACTIONS</th>
    `;
  }

  else {
    tableHeadRow.innerHTML = `
      <th class="sortable-header" data-sort="type">
        TYPE
        <span class="sort-icon">↕</span>
      </th>

      <th class="sortable-header" data-sort="category">
        CATEGORY
        <span class="sort-icon">↕</span>
      </th>

      <th>DESCRIPTION</th>

      <th class="sortable-header" data-sort="amount">
        AMOUNT
        <span class="sort-icon">↕</span>
      </th>

      <th class="sortable-header" data-sort="dueDate">
        DUE
        <span class="sort-icon">↕</span>
      </th>

      <th class="sortable-header" data-sort="status">
        STATUS
        <span class="sort-icon">↕</span>
      </th>

      <th class="notes-column"></th>

      <th>ACTIONS</th>
    `;
  }

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

  /* VIEW */
  if (currentView === "subscriptions") {
    filteredTransactions = filteredTransactions.filter(transaction => transaction.type === "Subscription");
  }

  /* CATEGORY */
  if (filters.category) {
    filteredTransactions = filteredTransactions.filter(transaction => transaction.category === filters.category);
  }

  /* TYPE */
  if (filters.type) {
    filteredTransactions = filteredTransactions.filter(transaction => transaction.type === filters.type);
  }

  /* STATUS */
  if (filters.status) {
    filteredTransactions = filteredTransactions.filter(transaction => transaction.status === filters.status);
  }

  /* SORTING */
  if (currentSort) {
    filteredTransactions.sort((a, b) => {
      let valueA = a[currentSort.field];
      let valueB = b[currentSort.field];

      /* AMOUNT */
      if (currentSort.field === "amount") {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      /* DUE DATE */
      if (currentSort.field === "dueDate") {
        valueA =
          valueA === "N/A"
            ? 0
            : new Date(valueA).getTime();

        valueB =
          valueB === "N/A"
            ? 0
            : new Date(valueB).getTime();
      }

      /* TEXT */
      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
      }

      if (typeof valueB === "string") {
        valueB = valueB.toLowerCase();
      }

      /* ASC */
      if (currentSort.direction === "asc") {
        if (valueA > valueB) return 1;
        if (valueA < valueB) return -1;

        return 0;
      }

      /* DESC */
      else {
        if (valueA < valueB) return 1;
        if (valueA > valueB) return -1;

        return 0;
      }
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
    /* SUBSCRIPTIONS VIEW */
    if (currentView === "subscriptions") {
      tbody.innerHTML += `
        <tr>
          <td>${transaction.category}</td>
          <td>${transaction.description}</td>
          <td>
            ₱ ${Number(transaction.amount).toLocaleString()}
          </td>

          <td>${transaction.dueDate}</td>

          <td>
            ${
              transaction.status === "Paid"
                ? `<span class="status-pill status-paid">Paid</span>`
                : `<span class="status-pill status-unpaid">Not Paid</span>`
            }
          </td>

          <td>${transaction.recurring ? "Monthly" : "One-Time"}</td>
          <td>${transaction.dueDate}</td>

          <td class="actions-cell">
            <button class="actions-btn" onclick="toggleActionsMenu(this)">•••</button>

            <div class="actions-dropdown">

              <button type="button" onclick="editTransaction(${transactions.indexOf(transaction)})">Edit</button>
              <button type="button" onclick="deleteTransaction(${transactions.indexOf(transaction)})">Delete</button>
              <button type="button" onclick="togglePaidStatus(${transactions.indexOf(transaction)})">
                ${
                  transaction.status === "Paid"
                    ? "Mark as Unpaid"
                    : "Mark as Paid"
                }
              </button>
            </div>
          </td>
        </tr>
      `;
    }

    /* NORMAL VIEW */
    else {
      tbody.innerHTML += `
        <tr>
          <td>
            <span class="type-pill ${getTypeClass(transaction.type)}">
              ${transaction.type}
            </span>
          </td>

          <td>${transaction.category}</td>
          <td>${transaction.description}</td>

          <td>
            ₱ ${Number(transaction.amount).toLocaleString()}
          </td>

          <td>${transaction.dueDate}</td>
          <td>
            ${
              transaction.status === "N/A"
              ? `<span class="status-na">N/A</span>`
              : `<span class="status-pill status-${transaction.status.toLowerCase().replace(/\s/g, "-")}">${transaction.status}</span>`
            }
          </td>

          <td></td>

          <td class="actions-cell">
            <button class="actions-btn"
              onclick="toggleActionsMenu(this)">
              •••
            </button>

            <div class="actions-dropdown">
              <button type="button" onclick="editTransaction(${transactions.indexOf(transaction)})">Edit</button>
              <button type="button" onclick="deleteTransaction(${transactions.indexOf(transaction)})">Delete</button>
              ${
                transaction.status !== "N/A"
                ? `
                  <button type="button"
                    onclick="togglePaidStatus(${transactions.indexOf(transaction)})">

                    ${
                      transaction.status === "Paid"
                        ? "Mark as Unpaid"
                        : "Mark as Paid"
                    }

                  </button>
                `
                : ""
              }
            </div>
          </td>
        </tr>
      `;
    }
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
  let totalIncome = 0;
  let totalExpenses = 0;
  let upcomingPayments = 0;
  let upcomingCount = 0;

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);

  transactions.forEach(transaction => {
    /* INCOME */
    if (transaction.type === "Income") {
      totalIncome += Number(transaction.amount);
    }

    /* EXPENSES */
    else {
      totalExpenses += Number(transaction.amount);
    }

    /* UPCOMING PAYMENTS */
    if (transaction.status !== "Paid" && transaction.dueDate !== "N/A") {
      const dueDate = new Date(transaction.dueDate);
      const isCurrentMonth = dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
      const isUpcoming = dueDate >= today && dueDate <= fiveDaysLater;

      if (isCurrentMonth && isUpcoming) {
        upcomingPayments += Number(transaction.amount);
        upcomingCount++;
      }
    }
  });

  const remainingBudget = totalIncome - totalExpenses;

  /* UPDATE UI */
  document.getElementById("totalIncome").textContent = 
    `₱ ${totalIncome.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  document.getElementById("totalExpenses").textContent =
    `₱ ${totalExpenses.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  document.getElementById("remainingBudget").textContent =
    `₱ ${remainingBudget.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

    const remainingBudgetElement = document.getElementById("remainingBudget");
    if (remainingBudget < 0) {
      remainingBudgetElement.classList.add("negative-budget");
    }
    
    else {
      remainingBudgetElement.classList.remove("negative-budget");
    }

  document.getElementById("upcomingPayments").textContent =
    `₱ ${upcomingPayments.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  document.getElementById("upcomingPaymentsText").textContent =
    `${upcomingCount} due within 5 days`;
}

/* UPCOMING PAYMENTS */
function filterUpcomingPayments() {
  console.log("Upcoming payments clicked");
}

/* ACTIONS MENU */
function toggleActionsMenu(button) {
  const dropdown = button.nextElementSibling;

  /* CLOSE ALL */
  document.querySelectorAll(".actions-dropdown").forEach(menu => {
      if (menu !== dropdown) {
        menu.classList.remove("active");
      }
    });

  dropdown.classList.toggle("active");
}

function editTransaction(index) {
  editingIndex = index;
  const transaction = transactions[index];

  openTransactionModal();

  /* TITLE */
  document.querySelector(".modal-header h2").textContent = "Edit Transaction";

  /* TYPE */
  selectedType = transaction.type;
  typeButtons.forEach(btn => {
    btn.classList.remove("active");
    if (
      btn.dataset.type === transaction.type
    ) {
      btn.classList.add("active");
    }
  });

  updateTransactionModal();

  /* VALUES */
  document.getElementById("transactionCategory").value = transaction.category;
  document.getElementById("transactionDescription").value = transaction.description;
  document.getElementById("transactionAmount").value = transaction.amount;

  if (transaction.dueDate !== "N/A") {
    document.getElementById("transactionDueDate").value = transaction.dueDate;
  }
}

function deleteTransaction(index) {
  deletingIndex = index;
  document.getElementById("deleteModal").classList.add("active");
}

function closeDeleteModal() {
  deletingIndex = null;
  document.getElementById("deleteModal").classList.remove("active");
}

function confirmDeleteTransaction() {
  if (deletingIndex === null) return;
  transactions.splice(deletingIndex, 1);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTransactions();
  updateSummaryCards();
  closeDeleteModal();
}

function togglePaidStatus(index) {
  if (transactions[index].status === "Paid") {
    transactions[index].status = "Unpaid";
  }

  else {
    transactions[index].status = "Paid";
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  updateSummaryCards();
}

/* CLOSE ON OUTSIDE CLICK */
document.addEventListener("click", (e) => {
  if (!e.target.closest(".actions-cell")) {
    document.querySelectorAll(".actions-dropdown").forEach(menu => menu.classList.remove("active"));
  }
});

/* MODAL */
function openTransactionModal() {
  document.getElementById("transactionModal").classList.add("active");
  if (editingIndex === null) {
    document.querySelector(".modal-header h2").textContent = "Add New Transaction";
  }

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
  document.getElementById("transactionModal").classList.remove("active");
  document.getElementById("recurringCheckbox").checked = false;
  document.getElementById("recurringOptions").classList.remove("active");
  clearValidationErrors();
  editingIndex = null;
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
document.getElementById("recurringCheckbox").addEventListener("change", (e) => {
  document
    .getElementById("recurringOptions")
    .classList.toggle(
      "active",
      e.target.checked
    );
});

function clearValidationErrors() {

  document
    .querySelectorAll(".error-text")
    .forEach(error => error.remove());

  document
    .querySelectorAll(".input-error")
    .forEach(input =>
      input.classList.remove("input-error")
    );

}

function showValidationError(inputId, message) {
  const input = document.getElementById(inputId);
  input.classList.add("input-error");
  const error = document.createElement("div");

  error.className = "error-text";
  error.textContent = message;
  input.parentElement.appendChild(error);
}

/* SAVE TRANSACTION */
function saveTransaction() {
  clearValidationErrors();
  const category = document.getElementById("transactionCategory").value;
  const description = document.getElementById("transactionDescription").value.trim();
  const amount = document.getElementById("transactionAmount").value.trim();
  const dueDate = document.getElementById("transactionDueDate").value;
  const recurring = document.getElementById("recurringCheckbox").checked;
  let hasError = false;

  /* REQUIRED */
  if (!description) {
    showValidationError("transactionDescription", "Please enter a description.");
    hasError = true;
  }

  if (!amount) {
    showValidationError("transactionAmount", "Please enter an amount.");
    hasError = true;
  }

  /* VALID NUMBER */
  if (amount && isNaN(amount)) {
    showValidationError("transactionAmount", "Please enter a valid amount.");
    hasError = true;
  }

  /* DUE DATE */
  if (selectedType !== "Income" && !dueDate) {
    showValidationError("transactionDueDate", "Please select a due date.");
    hasError = true;
  }

  /* RECURRING */
  if (recurring) {
    const repeatStarting = document.getElementById("repeatStarting").value;
    const repeatUntil = document.getElementById("repeatUntil").value;

    if (!repeatStarting) {
      showValidationError("repeatStarting", "Please select a start date.");
      hasError = true;
    }

    if (!repeatUntil) {
      showValidationError("repeatUntil","Please select an end date.");
      hasError = true;
    }
  }

  if (hasError) return;

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

  if (editingIndex !== null) {
    transactions[editingIndex] = {
      ...transactions[editingIndex],
      ...transaction
    };
  }

  else {
    transactions.unshift(transaction);
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTransactions();
  updateSummaryCards();
  closeTransactionModal();
}