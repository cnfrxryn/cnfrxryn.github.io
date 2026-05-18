/* ELEMENTS */
const fromCurrencySelect = document.getElementById("fromCurrencySelect");
const toCurrencySelect = document.getElementById("toCurrencySelect");
const fromCurrencyDropdown = document.getElementById("fromCurrencyDropdown");
const toCurrencyDropdown = document.getElementById("toCurrencyDropdown");
const fromCurrencyCode = document.getElementById("fromCurrencyCode");
const fromCurrencyName = document.getElementById("fromCurrencyName");
const toCurrencyCode = document.getElementById("toCurrencyCode");
const toCurrencyName = document.getElementById("toCurrencyName");

/* RENDER DROPDOWNS */
function renderCurrencyDropdown(dropdownElement, type, searchValue = "") {
  const optionsList = dropdownElement.querySelector(".currency-options-list");
  optionsList.innerHTML = "";
  const filteredCurrencies = currencies.filter((currency) => {
      const search = searchValue.toLowerCase();
      return (currency.code.toLowerCase().includes(search) || currency.name.toLowerCase().includes(search));
    });

  filteredCurrencies.forEach((currency) => {
    const option = document.createElement("div");
    option.classList.add("currency-option");
    option.innerHTML = `
      <span class="currency-option-code">
        ${currency.code}
      </span>

      <span class="currency-option-name">
        ${currency.name}
      </span>
    `;

    option.addEventListener("click", () => {
      if (type === "from") {
        fromCurrencyCode.textContent = currency.code;
        fromCurrencyName.textContent = currency.name;
        fromCurrencyDropdown.classList.remove("active");
      }

      else {
        toCurrencyCode.textContent = currency.code;
        toCurrencyName.textContent = currency.name;
        toCurrencyDropdown.classList.remove("active");
      }
    });

    optionsList.appendChild(option);
  });
}

/* TOGGLE DROPDOWNS */
fromCurrencySelect.addEventListener("click", () => {
    fromCurrencyDropdown.classList.toggle("active");
    toCurrencyDropdown.classList.remove("active");
});

toCurrencySelect.addEventListener("click", () => {
    toCurrencyDropdown.classList.toggle("active");
    fromCurrencyDropdown.classList.remove("active");
});

/* CLOSE DROPDOWN OUTSIDE CLICK */
document.addEventListener("click", (event) => {
    if (!fromCurrencySelect.contains(event.target) && !fromCurrencyDropdown.contains(event.target)) {
      fromCurrencyDropdown.classList.remove("active");
    }

    if (!toCurrencySelect.contains(event.target) && !toCurrencyDropdown.contains(event.target)) {
      toCurrencyDropdown.classList.remove("active");
    }
});

/* SEARCH */
document.getElementById("fromCurrencySearch").addEventListener("input", (e) => {
    renderCurrencyDropdown(fromCurrencyDropdown, "from", e.target.value);
});

document.getElementById("toCurrencySearch").addEventListener("input", (e) => {
    renderCurrencyDropdown(toCurrencyDropdown, "to", e.target.value);
});

/* INIT */
renderCurrencyDropdown(fromCurrencyDropdown, "from");
renderCurrencyDropdown(toCurrencyDropdown, "to");