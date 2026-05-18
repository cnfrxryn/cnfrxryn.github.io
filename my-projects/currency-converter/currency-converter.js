/* ELEMENTS */
const fromCurrencySelect = document.getElementById("fromCurrencySelect");
const toCurrencySelect = document.getElementById("toCurrencySelect");
const fromCurrencyDropdown = document.getElementById("fromCurrencyDropdown");
const toCurrencyDropdown = document.getElementById("toCurrencyDropdown");
const fromCurrencyCode = document.getElementById("fromCurrencyCode");
const fromCurrencyName = document.getElementById("fromCurrencyName");
const toCurrencyCode = document.getElementById("toCurrencyCode");
const toCurrencyName = document.getElementById("toCurrencyName");
const fromAmountInput = document.getElementById("fromAmountInput");
const toAmountInput = document.getElementById("toAmountInput");
const swapBtn = document.querySelector(".swap-btn");

/* STATE */
let fromCurrency = "USD";
let toCurrency = "EUR";
let exchangeRate = 0;

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
        fromCurrency = currency.code;
        fromCurrencyCode.textContent = currency.code;
        fromCurrencyName.textContent = currency.name;
        fromCurrencyDropdown.classList.remove("active");
      }

      else {
        toCurrency = currency.code;
        toCurrencyCode.textContent = currency.code;
        toCurrencyName.textContent = currency.name;
        toCurrencyDropdown.classList.remove("active");
      }

      fetchExchangeRate();
    });

    optionsList.appendChild(option);
  });
}

/* FETCH EXCHANGE RATE */
async function fetchExchangeRate() {
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
    const data = await response.json();
    exchangeRate = data.rates[toCurrency];
    convertCurrency();
  }

  catch (error) {
    console.error("Exchange rate fetch failed:", error);
  }
}

/* CONVERT CURRENCY */
function convertCurrency() {
  const amount = parseFloat(fromAmountInput.value);
  if (!amount) {
    toAmountInput.value = "";
    return;
  }

  const convertedAmount = amount * exchangeRate;
  toAmountInput.value = convertedAmount.toFixed(2);
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

/* LIVE CONVERSION */
fromAmountInput.addEventListener("input", convertCurrency);

/* SWAP CURRENCIES */
swapBtn.addEventListener("click", () => {
  const tempCurrency = fromCurrency;
  fromCurrency = toCurrency;
  toCurrency = tempCurrency;

  const tempCode = fromCurrencyCode.textContent;
  fromCurrencyCode.textContent = toCurrencyCode.textContent;
  toCurrencyCode.textContent = tempCode;

  const tempName = fromCurrencyName.textContent;
  fromCurrencyName.textContent = toCurrencyName.textContent;
  toCurrencyName.textContent = tempName;

  fetchExchangeRate();
});

/* INIT */
renderCurrencyDropdown(fromCurrencyDropdown, "from");
renderCurrencyDropdown(toCurrencyDropdown, "to");
fetchExchangeRate();

// /* DATASET GENERATOR (Temporary only; to be re-used) */
// const generateCurrencyDataBtn = document.getElementById("generateCurrencyDataBtn");
// const currencyDataOutput = document.getElementById("currencyDataOutput");
// generateCurrencyDataBtn.addEventListener("click", async () => {
//     try {
//       generateCurrencyDataBtn.textContent = "Generating...";

//       /* FETCH COUNTRIES */
//       const response = await fetch("https://restcountries.com/v3.1/all?fields=currencies,cca2");
//       const countries = await response.json();

//       /* STORE UNIQUE CURRENCIES */
//       const currencyMap = new Map();

//       countries.forEach((country) => {
//         if (!country.currencies) return;
//         Object.entries(country.currencies).forEach(([code, currencyData]) => {
//             if (!currencyMap.has(code)) {
//               currencyMap.set(code, {
//                 code,
//                 name: currencyData.name || "",
//                 symbol: currencyData.symbol || "",
//                 countryCode: (country.cca2 || "").toLowerCase()
//               });
//             }
//           });
//       });

//       /* CONVERT TO ARRAY */
//       const currencyArray = Array.from(currencyMap.values());

//       /* SORT ALPHABETICALLY */
//       currencyArray.sort((a, b) => a.code.localeCompare(b.code));

//       /* GENERATE JS CONTENT */
//       const finalOutput = `const currencies = ${JSON.stringify(currencyArray, null, 2)};`;

//       /* SHOW OUTPUT */
//       currencyDataOutput.value = finalOutput;
//       console.log(currencyArray);

//       generateCurrencyDataBtn.textContent = "Dataset Generated";
//     }

//     catch (error) {
//       console.error(error);
//       currencyDataOutput.value = "Error generating currency data.";
//       generateCurrencyDataBtn.textContent = "Generation Failed";
//     }
//   }
// );