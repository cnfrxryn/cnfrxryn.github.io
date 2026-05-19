/* ELEMENTS */
const fromCurrencySelect = document.getElementById("fromCurrencySelect");
const toCurrencySelect = document.getElementById("toCurrencySelect");
const fromCurrencyDropdown = document.getElementById("fromCurrencyDropdown");
const toCurrencyDropdown = document.getElementById("toCurrencyDropdown");
const fromCurrencyCode = document.getElementById("fromCurrencyCode");
const fromCurrencyName = document.getElementById("fromCurrencyName");
const toCurrencyCode = document.getElementById("toCurrencyCode");
const toCurrencyName = document.getElementById("toCurrencyName");
const fromFlagIcon = document.getElementById("fromFlagIcon");
const toFlagIcon = document.getElementById("toFlagIcon");
const fromAmountInput = document.getElementById("fromAmountInput");
const toAmountInput = document.getElementById("toAmountInput");
const swapBtn = document.querySelector(".swap-btn");
const refreshBtn = document.getElementById("refreshBtn");
const lastUpdatedText = document.getElementById("lastUpdatedText");
const exchangeRateText = document.getElementById("exchangeRateText");

/* STATE */
let fromCurrency = "USD";
let toCurrency = "EUR";
let exchangeRate = 0;
let lastUpdatedTimestamp = Date.now();

/* GET FLAG URL */
function getFlagUrl(currencyCode) {
  const currencyData = currencies.find((currency) => currency.code === currencyCode);

  if (!currencyData) {
    return "";
  }

  return `https://flagcdn.com/${currencyData.countryCode}.svg`;
}

/* UPDATE LAST UPDATED TEXT */
function updateLastUpdatedTime() {
  const secondsAgo = Math.floor((Date.now() - lastUpdatedTimestamp) / 1000);

  if (secondsAgo < 10) {
    lastUpdatedText.textContent = "Last updated: Just now";
  }

  else if (secondsAgo < 60) {
    lastUpdatedText.textContent = `Last updated: ${secondsAgo} secs ago`;
  }

  else {
    const minutesAgo = Math.floor(secondsAgo / 60);
    lastUpdatedText.textContent = `Last updated: ${minutesAgo} ${minutesAgo === 1 ? "min" : "mins"} ago`;
  }
}

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
        fromFlagIcon.src = getFlagUrl(currency.code);
        fromCurrencyDropdown.classList.remove("active");
      }

      else {
        toCurrency = currency.code;
        toCurrencyCode.textContent = currency.code;
        toCurrencyName.textContent = currency.name;
        toFlagIcon.src = getFlagUrl(currency.code);
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
    refreshBtn.classList.add("loading");
    const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
    const data = await response.json();
    exchangeRate = data.rates[toCurrency];
    exchangeRateText.textContent = `1 ${fromCurrency} = ${exchangeRate.toFixed(4)} ${toCurrency}`;
    convertCurrency();

    lastUpdatedTimestamp = Date.now();
    updateLastUpdatedTime();

    setTimeout(() => {
      refreshBtn.classList.remove("loading");
    }, 500);
  }

  catch (error) {
    console.error("Exchange rate fetch failed:", error);
    setTimeout(() => {
      refreshBtn.classList.remove("loading");
    }, 500);
  }
}

/* CONVERT CURRENCY */
function convertCurrency() {
  const amount = parseFloat(fromAmountInput.value);
  if (isNaN(amount)) {
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

/* MANUAL REFRESH */
refreshBtn.addEventListener("click", () => {
  fetchExchangeRate();
});

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

  const tempFlag = fromFlagIcon.src;
  fromFlagIcon.src = toFlagIcon.src;
  toFlagIcon.src = tempFlag;

  fetchExchangeRate();
});

/* UPDATE TIMER */
setInterval(() => {
  updateLastUpdatedTime();
}, 1000);

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