/* =========================
   CURRENCY DATA
========================= */

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "GBP", name: "British Pound" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "KRW", name: "South Korean Won" },
  { code: "CNY", name: "Chinese Yuan" }
];

/* =========================
   ELEMENTS
========================= */

const fromCurrencySelect =
  document.getElementById("fromCurrencySelect");

const toCurrencySelect =
  document.getElementById("toCurrencySelect");

const fromCurrencyDropdown =
  document.getElementById("fromCurrencyDropdown");

const toCurrencyDropdown =
  document.getElementById("toCurrencyDropdown");

/* =========================
   RENDER DROPDOWNS
========================= */

function renderCurrencyDropdown(
  dropdownElement
) {

  dropdownElement.innerHTML = "";

  currencies.forEach((currency) => {

    const option =
      document.createElement("div");

    option.classList.add("currency-option");

    option.innerHTML = `
      <span class="currency-option-code">
        ${currency.code}
      </span>

      <span class="currency-option-name">
        ${currency.name}
      </span>
    `;

    dropdownElement.appendChild(option);

  });

}

/* =========================
   TOGGLE DROPDOWNS
========================= */

fromCurrencySelect.addEventListener(
  "click",
  () => {

    fromCurrencyDropdown.classList.toggle(
      "active"
    );

    toCurrencyDropdown.classList.remove(
      "active"
    );

  }
);

toCurrencySelect.addEventListener(
  "click",
  () => {

    toCurrencyDropdown.classList.toggle(
      "active"
    );

    fromCurrencyDropdown.classList.remove(
      "active"
    );

  }
);

/* =========================
   CLOSE DROPDOWN OUTSIDE CLICK
========================= */

document.addEventListener(
  "click",
  (event) => {

    if (
      !fromCurrencySelect.contains(event.target)
      &&
      !fromCurrencyDropdown.contains(event.target)
    ) {

      fromCurrencyDropdown.classList.remove(
        "active"
      );

    }

    if (
      !toCurrencySelect.contains(event.target)
      &&
      !toCurrencyDropdown.contains(event.target)
    ) {

      toCurrencyDropdown.classList.remove(
        "active"
      );

    }

  }
);

/* =========================
   INIT
========================= */

renderCurrencyDropdown(
  fromCurrencyDropdown
);

renderCurrencyDropdown(
  toCurrencyDropdown
);