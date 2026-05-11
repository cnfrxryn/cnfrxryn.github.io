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
let showUpcomingOnly = false;

function initializeSorting() {
  document.querySelectorAll(".sortable-header")
    .forEach(header => {
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
        document.querySelectorAll(".sortable-header")
          .forEach(th =>
            th.classList.remove("active-sort")
          );
        header.classList.add("active-sort");

        renderTransactions();
      });
    });
}

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
  initializeSorting();
  updateSummaryCards();
  renderCharts();

  /* CHART MONTH DEFAULT */
  const currentMonthValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  document.getElementById("categoryChartMonth").value = currentMonthValue;
  document.getElementById("trendChartMonth").value = currentMonthValue;

  /* CHART MONTH PICKERS */
  document.getElementById("categoryChartMonth").addEventListener("change", (e) => {
    categoryChartDate = new Date(`${e.target.value}-01`);
    renderCategoryChart();
  });
  
  document.getElementById("trendChartMonth").addEventListener("change", (e) => {
    trendChartDate = new Date(`${e.target.value}-01`);
    renderTrendChart();
  });

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
      
      /* RESET FILTERS */
      filters = {
        category: "",
        type: "",
        status: ""
      };

      showUpcomingOnly = false;

      document.getElementById("filterCategory").value = "";
      document.getElementById("filterType").value = "";
      document.getElementById("filterStatus").value = "";

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

  let baseData = [...transactions];

  /* SUBSCRIPTIONS VIEW */
  if (currentView === "subscriptions") {
    baseData = baseData.filter(transaction => transaction.type === "Subscription");
    filters.type = "Subscription";
    typeDropdown.disabled = true;
  }

  else {
    typeDropdown.disabled = false;
  }

  /* UNIQUE VALUES */
  const categories =
    [...new Set(baseData.map(t => t.category))]
      .filter(Boolean);
  const types =
    [...new Set(baseData.map(t => t.type))]
      .filter(Boolean);

  const statuses =
    [...new Set(baseData.map(t => t.status))]
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

  document.getElementById("currentMonthPicker").value = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
}

document.getElementById("currentMonthPicker").addEventListener("change", (e) => {
  currentDate = new Date(`${e.target.value}-01`);
  /* SYNC CHART MONTHS */
  categoryChartDate = new Date(`${e.target.value}-01`);
  trendChartDate = new Date(`${e.target.value}-01`);

  document.getElementById("categoryChartMonth").value = e.target.value;
  document.getElementById("trendChartMonth").value = e.target.value;

  updateCurrentMonth();
  updateSummaryCards();
  renderCharts();
  renderTransactions();
});

document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  const syncedMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  categoryChartDate = new Date(`${syncedMonth}-01`);
  trendChartDate = new Date(`${syncedMonth}-01`);
  document.getElementById("categoryChartMonth").value = syncedMonth;
  document.getElementById("trendChartMonth").value = syncedMonth;

  updateCurrentMonth();
  updateSummaryCards();
  renderCharts();
  renderTransactions();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  const syncedMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  categoryChartDate = new Date(`${syncedMonth}-01`);
  trendChartDate = new Date(`${syncedMonth}-01`);
  document.getElementById("categoryChartMonth").value = syncedMonth;
  document.getElementById("trendChartMonth").value = syncedMonth;

  updateCurrentMonth();
  updateSummaryCards();
  renderCharts();
  renderTransactions();
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

  initializeSorting();

  let filteredTransactions = expandRecurringTransactions(transactions);

  /* GLOBAL MONTH FILTER */
  filteredTransactions = filteredTransactions.filter(transaction => {
    let referenceDate;
    
    /* INCOME */
    if (transaction.type === "Income") {
      if (!transaction.dueDate || transaction.dueDate === "N/A") {
        return false;
      }
      referenceDate = new Date(transaction.dueDate);
    }
    
    /* EXPENSES */
    else {
      if (!transaction.dueDate || transaction.dueDate === "N/A") {
        return false;
      }
      
      referenceDate = new Date(transaction.dueDate);
    }
    
    return (referenceDate.getMonth() === currentDate.getMonth() && referenceDate.getFullYear() === currentDate.getFullYear());
  });

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

  /* UPCOMING PAYMENTS */
  if (showUpcomingOnly) {
    const today = new Date();

    filteredTransactions = filteredTransactions.filter(transaction => {
      if (transaction.status === "Paid" || transaction.dueDate === "N/A") {
        return false;
      }

      const dueDate = new Date(transaction.dueDate);
      const diffDays = Math.ceil((dueDate - today) /(1000 * 60 * 60 * 24));

      return diffDays <= 5;
    });
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

  updateClearFiltersButton();

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

          <td>
            ${
              transaction.repeatEvery === "Year"
                ? "Annually"
                : "Monthly"
            }
          </td>
          <td>
            ${getNextDueDate(transaction)}
          </td>

          <td class="actions-cell">
            <button class="actions-btn" onclick="toggleActionsMenu(this)">•••</button>

            <div class="actions-dropdown">

              <button type="button" onclick="editTransaction(${transaction.originalIndex ?? transactions.indexOf(transaction)},'${transaction.dueDate}',${JSON.stringify(transaction).replace(/"/g, '&quot;')})">Edit</button>
              <button type="button" onclick="deleteTransaction(${transaction.originalIndex ?? transactions.indexOf(transaction)},'${transaction.dueDate}')">Delete</button>
              <button type="button" onclick="togglePaidStatus(${transaction.originalIndex ?? transactions.indexOf(transaction)},'${transaction.dueDate}')">
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
              <button type="button" onclick="editTransaction(${transaction.originalIndex ?? transactions.indexOf(transaction)},'${transaction.dueDate}',${JSON.stringify(transaction).replace(/"/g, '&quot;')})">Edit</button>
              <button type="button" onclick="deleteTransaction(${transaction.originalIndex ?? transactions.indexOf(transaction)},'${transaction.dueDate}')">Delete</button>
              ${
                transaction.status !== "N/A"
                ? `
                  <button type="button" onclick="togglePaidStatus(${transaction.originalIndex ?? transactions.indexOf(transaction)},'${transaction.dueDate}')">
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

/* NEXT DUE DATE */
function getNextDueDate(transaction) {
  if (!transaction.dueDate) {
    return "N/A";
  }

  const dueDate = new Date(transaction.dueDate);

  /* YEARLY */
  if (transaction.repeatEvery === "Year") {
    dueDate.setFullYear(dueDate.getFullYear() + 1);
  }

  /* MONTHLY */
  else {
    dueDate.setMonth(dueDate.getMonth() + 1);
  }

  return dueDate.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric"
    }
  );
}

let categoryChartInstance = null;
let trendChartInstance = null;
let categoryChartDate = new Date();
let trendChartDate = new Date();

const centerTextPlugin = {
  id: "centerTextPlugin",
  afterDraw(chart) {
    if (chart.config.type !== "doughnut") {
      return;
    }

    const {
      ctx,
      chartArea: {
        width,
        height
      }
    } = chart;

    const total = chart.data.datasets[0].data.reduce((sum, value) => sum + value, 0);

    ctx.save();
    ctx.font = "700 22px Arial";
    ctx.fillStyle = "#222";
    ctx.textAlign = "center";
    ctx.fillText(
      `₱ ${total.toLocaleString()}`,
      width / 2,
      height / 2
    );
    ctx.font = "14px Arial";
    ctx.fillStyle = "#777";
    ctx.fillText(
      "Total",
      width / 2,
      (height / 2) + 28
    );
    ctx.restore();
  }
};

Chart.register(centerTextPlugin);
/* CHARTS */
function renderCharts() {
  renderCategoryChart();
  renderTrendChart();
}

function renderCategoryChart() {
  const categoryMonth = categoryChartDate.getMonth();
  const categoryYear = categoryChartDate.getFullYear();
  
  const categoryFilteredData = expandRecurringTransactions(transactions).filter(transaction => {
    if (transaction.dueDate === "N/A") {
      return false;
    }

    const dueDate = new Date(transaction.dueDate);

    return (
      dueDate.getMonth() === categoryMonth &&
      dueDate.getFullYear() === categoryYear
    );
  });

  const hasCategoryData = categoryFilteredData.length > 0;
  document.getElementById("categoryChart").style.display = hasCategoryData
    ? "block"
    : "none";

  document.getElementById("categoryChartEmpty").style.display = hasCategoryData ? "none" : "flex";

  /* TYPE TOTALS */
  const typeTotals = {};
  categoryFilteredData.forEach(transaction => {
    if (transaction.type === "Income") {
      return;
    }
    
    if (!typeTotals[transaction.type]) {
      typeTotals[transaction.type] = 0;
    }
    
    typeTotals[transaction.type] += Number(transaction.amount);
  });

  /* DESTROY OLD */
  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  if (hasCategoryData) {
  /* CATEGORY CHART */
    categoryChartInstance = new Chart(document.getElementById("categoryChart"), {
      type: "doughnut",
      data: {
        labels: Object.keys(typeTotals).map(type => {
          const total = Object.values(typeTotals).reduce((sum, value) => sum + value, 0);
          const amount = typeTotals[type];
          const percentage = ((amount / total) * 100).toFixed(0);
          return `${type}  ${percentage}%  ₱ ${amount.toLocaleString()}`;
        }),
        datasets: [{
          data: Object.values(typeTotals)
        }]
      },
      
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              padding: 24,
              boxWidth: 10,
              boxHeight: 10,
              font: {
                size: 13,
                weight: "600"
              }
            }
          }
        },
        cutout: "68%"
      }
    });
  }
}
  
function renderTrendChart() {
  const trendMonth = trendChartDate.getMonth();
  const trendYear = trendChartDate.getFullYear();

  const trendFilteredData = expandRecurringTransactions(transactions).filter(transaction => {
    if (transaction.dueDate === "N/A") {
      return false;
    }

    const dueDate = new Date(transaction.dueDate);

    return (
      dueDate.getMonth() === trendMonth &&
      dueDate.getFullYear() === trendYear
    );
  });

  const hasTrendData = trendFilteredData.length > 0;

  document.getElementById("trendChart").style.display =
    hasTrendData
      ? "block"
      : "none";

  document.getElementById("trendChartEmpty").style.display =
    hasTrendData
      ? "none"
      : "flex";

  if (trendChartInstance) {
    trendChartInstance.destroy();
  }
  
  /* WEEKLY TOTALS */
  const weeklyTotals = {
    "Week 1": 0,
    "Week 2": 0,
    "Week 3": 0,
    "Week 4": 0,
    "Week 5": 0
  };

  trendFilteredData.forEach(transaction => {
    if (transaction.type === "Income") {
      return;
    }
    
    const dueDate = new Date(transaction.dueDate);
    const day = dueDate.getDate();
    let week;

    if (day <= 7) {
      week = "Week 1";
    }

    else if (day <= 14) {
      week = "Week 2";
    }

    else if (day <= 21) {
      week = "Week 3";
    }

    else if (day <= 28) {
      week = "Week 4";
    }

    else {
      week = "Week 5";
    }

    weeklyTotals[week] += Number(transaction.amount);
  });

  if (hasTrendData) {
    /* TREND CHART */
    trendChartInstance = new Chart(document.getElementById("trendChart"), {
      type: "line",
      data: {
        labels: Object.keys(weeklyTotals),
        datasets: [{
          label: "Expenses",
          data: Object.values(weeklyTotals),
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
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

  expandRecurringTransactions(transactions).forEach(transaction => {
    /* MONTH FILTER */
    let referenceDate;

    /* INCOME */
    if (transaction.type === "Income") {
      if (!transaction.dueDate || transaction.dueDate === "N/A") {
        return;
      }
      referenceDate = new Date(transaction.dueDate);
    }
    
    /* EXPENSES */
    else {
      if (transaction.dueDate === "N/A") {
        return;
      }
      
      referenceDate = new Date(transaction.dueDate);
    }
    
    const matchesMonth = referenceDate.getMonth() === currentMonth && referenceDate.getFullYear() === currentYear;

    if (!matchesMonth) {
      return;
    }

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

function updateClearFiltersButton() {
  const clearBtn = document.getElementById("clearFiltersBtn");
  const hasFilters =
    showUpcomingOnly ||
    filters.category ||
    filters.type ||
    filters.status ||
    searchQuery;

  clearBtn.style.display = hasFilters
    ? "block"
    : "none";
}

/* UPCOMING PAYMENTS */
function filterUpcomingPayments() {
  /* SWITCH TAB */
  currentView = "transactions";

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
    
    if (tab.textContent.trim() === "All Transactions") {
      tab.classList.add("active");
    }
  });

  /* RESET */
  filters = {
    category: "",
    type: "",
    status: ""
  };

  document.getElementById("filterCategory").value = "";
  document.getElementById("filterType").value = "";
  document.getElementById("filterStatus").value = "";

  /* ENABLE UPCOMING MODE */
  showUpcomingOnly = true;
  currentPage = 1;

  updateFilterDropdowns();
  updateClearFiltersButton();
  renderTransactions();
}

function clearAllFilters() {
  showUpcomingOnly = false;
  filters = {
    category: "",
    type: "",
    status: ""
  };

  searchQuery = "";

  document.getElementById("searchInput").value = "";
  document.getElementById("filterCategory").value = "";
  document.getElementById("filterType").value = "";
  document.getElementById("filterStatus").value = "";

  updateFilterDropdowns();
  updateClearFiltersButton();
  renderTransactions();
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

function editTransaction(index, occurrenceDate = null, transactionData = null) {
  editingIndex = index;
  window.editingOccurrenceDate = occurrenceDate;
  const transaction = transactionData || transactions[index];

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

  /* RECURRING */
  document.getElementById("recurringCheckbox").checked =
    transaction.recurring || false;

  if (transaction.recurring) {
    document.getElementById("recurringOptions").classList.add("active");
    document.getElementById("repeatEvery").value = transaction.repeatEvery || "Month";
    document.getElementById("repeatStarting").value = transaction.repeatStarting || "";
    document.getElementById("repeatUntil").value = transaction.repeatUntil || "";
  }
}

function deleteTransaction(index, occurrenceDate = null) {
  deletingIndex = {index,occurrenceDate};
  document.getElementById("deleteModal").classList.add("active");
}

function closeDeleteModal() {
  deletingIndex = null;
  document.getElementById("deleteModal").classList.remove("active");
}

function confirmDeleteTransaction() {
  if (deletingIndex === null) {
    return;
  }

  const {index,occurrenceDate} = deletingIndex;
  const transaction = transactions[index];

  /* NON-RECURRING */
  if (!transaction.recurring || !occurrenceDate) {
    transactions.splice(index, 1);
  }

  /* RECURRING */
  else {
    if (!transaction.deletedOccurrences) {
      transaction.deletedOccurrences = [];
    }

    if (!transaction.deletedOccurrences.includes(occurrenceDate)) {
      transaction.deletedOccurrences.push(occurrenceDate);
    }
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTransactions();
  updateSummaryCards();
  renderCharts();
  closeDeleteModal();
}

function togglePaidStatus(index, occurrenceDate = null) {
  const transaction = transactions[index];

  /* NORMAL NON-RECURRING */
  if (!transaction.recurring || !occurrenceDate) {
    transaction.status = transaction.status === "Paid"
      ? "Unpaid"
      : "Paid";
  }

  /* RECURRING */
  else {
    if (!transaction.paidOccurrences) {
      transaction.paidOccurrences = [];
    }

    const existingIndex = transaction.paidOccurrences.indexOf(occurrenceDate);

    /* REMOVE */
    if (existingIndex > -1) {
      transaction.paidOccurrences.splice(existingIndex, 1);
    }

    /* ADD */
    else {
      transaction.paidOccurrences.push(occurrenceDate);
    }
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTransactions();
  updateSummaryCards();
  renderCharts();
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
  if (editingIndex === null) {
    selectedType = "Variable Expense";

    typeButtons.forEach(btn => btn.classList.remove("active"));
    document.querySelector('[data-type="Variable Expense"]').classList.add("active");
  }

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
  window.editingOccurrenceDate = null;
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
  const dateFieldLabel = document.getElementById("dateFieldLabel");
  categorySelect.innerHTML = "";

  /* INCOME */
  if (selectedType === "Income") {
    dueDateGroup.style.display = "flex";
    recurringWrapper.style.display = "none";
    dateFieldLabel.textContent = "Received On";
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
    dateFieldLabel.textContent = "Due Date";
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
  const repeatEvery = document.getElementById("repeatEvery").value;
  const repeatStarting = document.getElementById("repeatStarting").value;
  const repeatUntil = document.getElementById("repeatUntil").value;
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

  /* DATE */
  if (!dueDate) {
    showValidationError("transactionDueDate",selectedType === "Income"
        ? "Please select a received date."
        : "Please select a due date."
    );

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

  const existingTransaction = editingIndex !== null
    ? transactions[editingIndex]
    : null;

  const transaction = {
    type: selectedType,
    category,
    description,
    amount,
    dueDate,
    recurring,
    status: selectedType === "Income"
            ? "N/A"
            : (existingTransaction?.status || "Unpaid"),
    createdAt: existingTransaction?.createdAt || Date.now(),
    repeatEvery,
    repeatStarting,
    repeatUntil,
    paidOccurrences: existingTransaction?.paidOccurrences || [],
    customOccurrences: existingTransaction?.customOccurrences || {},
    deletedOccurrences: existingTransaction?.deletedOccurrences || [],
  };

  /* INCOME */
  if (selectedType === "Income") {
    transaction.status = "N/A";
  }

  if (editingIndex !== null) {
    /* OCCURRENCE ONLY */
    if (transactions[editingIndex].recurring && window.editingOccurrenceDate) {
      if (!transactions[editingIndex].customOccurrences) {
        transactions[editingIndex].customOccurrences = {};
      }

      transactions[editingIndex]
        .customOccurrences[window.editingOccurrenceDate] = {
          type: transaction.type,
          category: transaction.category,
          description: transaction.description,
          amount: transaction.amount,
          dueDate: window.editingOccurrenceDate,
          recurring: false,
          status: transaction.status
      };
    }

    /* NORMAL */
    else {
      transactions[editingIndex] = {
        ...transactions[editingIndex],
        ...transaction
      };
    }
  }

  else {
    transactions.unshift(transaction);
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTransactions();
  updateSummaryCards();
  renderCharts();
  closeTransactionModal();
}

function expandRecurringTransactions(transactionList) {
  const expanded = [];
  transactionList.forEach((transaction, index) => {
    expanded.push({
      ...transaction,
      originalIndex: index
    });

    /* BACKWARD COMPATIBILITY */
    if (!transaction.paidOccurrences) {
      transaction.paidOccurrences = [];
    }

    if (!transaction.customOccurrences) {
      transaction.customOccurrences = {};
    }

    if (!transaction.deletedOccurrences) {
      transaction.deletedOccurrences = [];
    }

    /* NOT RECURRING */
    if (!transaction.recurring) {
      return;
    }

    if (!transaction.repeatStarting || !transaction.repeatUntil) {
      return;
    }

    const startDate = new Date(transaction.repeatStarting);
    const endDate = new Date(transaction.repeatUntil);

    let currentRecurringDate = new Date(startDate);

    /* START NEXT CYCLE */
    if (transaction.repeatEvery === "Month") {
      currentRecurringDate.setMonth(currentRecurringDate.getMonth() + 1);
    }

    else {
      currentRecurringDate.setFullYear(currentRecurringDate.getFullYear() + 1);
    }

    while (currentRecurringDate <= endDate) {
      const recurringDateString = currentRecurringDate
        .toISOString()
        .split("T")[0];

      if (transaction.deletedOccurrences?.includes(recurringDateString)) {
        if (transaction.repeatEvery === "Month") {
          currentRecurringDate.setMonth(currentRecurringDate.getMonth() + 1);
        }

        else {
          currentRecurringDate.setFullYear(currentRecurringDate.getFullYear() + 1);
        }

        continue;
      }

      /* SKIP ORIGINAL */
      if (recurringDateString !== transaction.dueDate) {
        expanded.push({
          ...transaction,
          ...(transaction.customOccurrences?.[recurringDateString] || {}),

          originalIndex: index,
          dueDate: recurringDateString,
          status: transaction.paidOccurrences?.includes(recurringDateString)
            ? "Paid"
            : "Unpaid",
          recurringGenerated: true
        });
      }

      /* MONTHLY */
      if (transaction.repeatEvery === "Month") {
        currentRecurringDate.setMonth(
          currentRecurringDate.getMonth() + 1
        );
      }

      /* YEARLY */
      else {
        currentRecurringDate.setFullYear(
          currentRecurringDate.getFullYear() + 1
        );
      }
    }
  });

  return expanded;
}