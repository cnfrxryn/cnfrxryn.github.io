/* =========================
   LOCAL STORAGE
========================= */

let transactions =
  JSON.parse(localStorage.getItem("transactions")) || [];

/* =========================
   PAGINATION
========================= */

let currentPage = 1;
const rowsPerPage = 10;

/* =========================
   MONTH STATE
========================= */

let currentDate = new Date();

/* =========================
   FILTERS
========================= */

let filters = {
  category: "",
  type: "",
  status: ""
};

let searchQuery = "";

/* =========================
   INIT
========================= */

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

/* =========================
   MONTH NAVIGATION
========================= */

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

/* =========================
   RENDER TRANSACTIONS
========================= */

function renderTransactions() {

  const tbody =
    document.getElementById("transactionsTableBody");

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

}

/* =========================
   SUMMARY CARDS
========================= */

function updateSummaryCards() {

  document.getElementById("totalIncome").textContent =
    "₱0.00";

  document.getElementById("totalExpenses").textContent =
    "₱0.00";

  document.getElementById("remainingBudget").textContent =
    "₱0.00";

  document.getElementById("upcomingPayments").textContent =
    "₱0.00";

}

/* =========================
   UPCOMING PAYMENTS
========================= */

function filterUpcomingPayments() {

  console.log("Upcoming payments clicked");

}