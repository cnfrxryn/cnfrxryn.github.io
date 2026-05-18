const currencies = [
  {
    "code": "AED",
    "name": "United Arab Emirates dirham",
    "symbol": "د.إ",
    "countryCode": "ae"
  },
  {
    "code": "AFN",
    "name": "Afghan afghani",
    "symbol": "؋",
    "countryCode": "af"
  },
  {
    "code": "ALL",
    "name": "Albanian lek",
    "symbol": "L",
    "countryCode": "al"
  },
  {
    "code": "AMD",
    "name": "Armenian dram",
    "symbol": "֏",
    "countryCode": "am"
  },
  {
    "code": "ANG",
    "name": "Netherlands Antillean guilder",
    "symbol": "ƒ",
    "countryCode": "cw"
  },
  {
    "code": "AOA",
    "name": "Angolan kwanza",
    "symbol": "Kz",
    "countryCode": "ao"
  },
  {
    "code": "ARS",
    "name": "Argentine peso",
    "symbol": "$",
    "countryCode": "ar"
  },
  {
    "code": "AUD",
    "name": "Australian dollar",
    "symbol": "$",
    "countryCode": "ki"
  },
  {
    "code": "AWG",
    "name": "Aruban florin",
    "symbol": "ƒ",
    "countryCode": "aw"
  },
  {
    "code": "AZN",
    "name": "Azerbaijani manat",
    "symbol": "₼",
    "countryCode": "az"
  },
  {
    "code": "BAM",
    "name": "Bosnia and Herzegovina convertible mark",
    "symbol": "KM",
    "countryCode": "ba"
  },
  {
    "code": "BBD",
    "name": "Barbadian dollar",
    "symbol": "$",
    "countryCode": "bb"
  },
  {
    "code": "BDT",
    "name": "Bangladeshi taka",
    "symbol": "৳",
    "countryCode": "bd"
  },
  {
    "code": "BGN",
    "name": "Bulgarian lev",
    "symbol": "лв",
    "countryCode": "bg"
  },
  {
    "code": "BHD",
    "name": "Bahraini dinar",
    "symbol": ".د.ب",
    "countryCode": "bh"
  },
  {
    "code": "BIF",
    "name": "Burundian franc",
    "symbol": "Fr",
    "countryCode": "bi"
  },
  {
    "code": "BMD",
    "name": "Bermudian dollar",
    "symbol": "$",
    "countryCode": "bm"
  },
  {
    "code": "BND",
    "name": "Brunei dollar",
    "symbol": "$",
    "countryCode": "bn"
  },
  {
    "code": "BOB",
    "name": "Bolivian boliviano",
    "symbol": "Bs.",
    "countryCode": "bo"
  },
  {
    "code": "BRL",
    "name": "Brazilian real",
    "symbol": "R$",
    "countryCode": "br"
  },
  {
    "code": "BSD",
    "name": "Bahamian dollar",
    "symbol": "$",
    "countryCode": "bs"
  },
  {
    "code": "BTN",
    "name": "Bhutanese ngultrum",
    "symbol": "Nu.",
    "countryCode": "bt"
  },
  {
    "code": "BWP",
    "name": "Botswana pula",
    "symbol": "P",
    "countryCode": "bw"
  },
  {
    "code": "BYN",
    "name": "Belarusian ruble",
    "symbol": "Br",
    "countryCode": "by"
  },
  {
    "code": "BZD",
    "name": "Belize dollar",
    "symbol": "$",
    "countryCode": "bz"
  },
  {
    "code": "CAD",
    "name": "Canadian dollar",
    "symbol": "$",
    "countryCode": "ca"
  },
  {
    "code": "CDF",
    "name": "Congolese franc",
    "symbol": "FC",
    "countryCode": "cd"
  },
  {
    "code": "CHF",
    "name": "Swiss franc",
    "symbol": "Fr.",
    "countryCode": "ch"
  },
  {
    "code": "CKD",
    "name": "Cook Islands dollar",
    "symbol": "$",
    "countryCode": "ck"
  },
  {
    "code": "CLP",
    "name": "Chilean peso",
    "symbol": "$",
    "countryCode": "cl"
  },
  {
    "code": "CNY",
    "name": "Chinese yuan",
    "symbol": "¥",
    "countryCode": "cn"
  },
  {
    "code": "COP",
    "name": "Colombian peso",
    "symbol": "$",
    "countryCode": "co"
  },
  {
    "code": "CRC",
    "name": "Costa Rican colón",
    "symbol": "₡",
    "countryCode": "cr"
  },
  {
    "code": "CUC",
    "name": "Cuban convertible peso",
    "symbol": "$",
    "countryCode": "cu"
  },
  {
    "code": "CUP",
    "name": "Cuban peso",
    "symbol": "$",
    "countryCode": "cu"
  },
  {
    "code": "CVE",
    "name": "Cape Verdean escudo",
    "symbol": "Esc",
    "countryCode": "cv"
  },
  {
    "code": "CZK",
    "name": "Czech koruna",
    "symbol": "Kč",
    "countryCode": "cz"
  },
  {
    "code": "DJF",
    "name": "Djiboutian franc",
    "symbol": "Fr",
    "countryCode": "dj"
  },
  {
    "code": "DKK",
    "name": "krone",
    "symbol": "kr.",
    "countryCode": "gl"
  },
  {
    "code": "DOP",
    "name": "Dominican peso",
    "symbol": "$",
    "countryCode": "do"
  },
  {
    "code": "DZD",
    "name": "Algerian dinar",
    "symbol": "د.ج",
    "countryCode": "dz"
  },
  {
    "code": "EGP",
    "name": "Egyptian pound",
    "symbol": "E£",
    "countryCode": "ps"
  },
  {
    "code": "ERN",
    "name": "Eritrean nakfa",
    "symbol": "Nfk",
    "countryCode": "er"
  },
  {
    "code": "ETB",
    "name": "Ethiopian birr",
    "symbol": "Br",
    "countryCode": "et"
  },
  {
    "code": "EUR",
    "name": "euro",
    "symbol": "€",
    "countryCode": "cy"
  },
  {
    "code": "FJD",
    "name": "Fijian dollar",
    "symbol": "$",
    "countryCode": "fj"
  },
  {
    "code": "FKP",
    "name": "Falkland Islands pound",
    "symbol": "£",
    "countryCode": "fk"
  },
  {
    "code": "FOK",
    "name": "Faroese króna",
    "symbol": "kr",
    "countryCode": "fo"
  }
];