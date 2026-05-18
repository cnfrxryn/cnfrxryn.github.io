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
  },
  {
    "code": "GBP",
    "name": "British pound",
    "symbol": "£",
    "countryCode": "gb"
  },
  {
    "code": "GEL",
    "name": "lari",
    "symbol": "₾",
    "countryCode": "ge"
  },
  {
    "code": "GGP",
    "name": "Guernsey pound",
    "symbol": "£",
    "countryCode": "gg"
  },
  {
    "code": "GHS",
    "name": "Ghanaian cedi",
    "symbol": "₵",
    "countryCode": "gh"
  },
  {
    "code": "GIP",
    "name": "Gibraltar pound",
    "symbol": "£",
    "countryCode": "gi"
  },
  {
    "code": "GMD",
    "name": "dalasi",
    "symbol": "D",
    "countryCode": "gm"
  },
  {
    "code": "GNF",
    "name": "Guinean franc",
    "symbol": "Fr",
    "countryCode": "gn"
  },
  {
    "code": "GTQ",
    "name": "Guatemalan quetzal",
    "symbol": "Q",
    "countryCode": "gt"
  },
  {
    "code": "GYD",
    "name": "Guyanese dollar",
    "symbol": "$",
    "countryCode": "gy"
  },
  {
    "code": "HKD",
    "name": "Hong Kong dollar",
    "symbol": "$",
    "countryCode": "hk"
  },
  {
    "code": "HNL",
    "name": "Honduran lempira",
    "symbol": "L",
    "countryCode": "hn"
  },
  {
    "code": "HTG",
    "name": "Haitian gourde",
    "symbol": "G",
    "countryCode": "ht"
  },
  {
    "code": "HUF",
    "name": "Hungarian forint",
    "symbol": "Ft",
    "countryCode": "hu"
  },
  {
    "code": "IDR",
    "name": "Indonesian rupiah",
    "symbol": "Rp",
    "countryCode": "id"
  },
  {
    "code": "ILS",
    "name": "Israeli new shekel",
    "symbol": "₪",
    "countryCode": "ps"
  },
  {
    "code": "IMP",
    "name": "Manx pound",
    "symbol": "£",
    "countryCode": "im"
  },
  {
    "code": "INR",
    "name": "Indian rupee",
    "symbol": "₹",
    "countryCode": "bt"
  },
  {
    "code": "IQD",
    "name": "Iraqi dinar",
    "symbol": "ع.د",
    "countryCode": "iq"
  },
  {
    "code": "IRR",
    "name": "Iranian rial",
    "symbol": "﷼",
    "countryCode": "ir"
  },
  {
    "code": "ISK",
    "name": "Icelandic króna",
    "symbol": "kr",
    "countryCode": "is"
  },
  {
    "code": "JEP",
    "name": "Jersey pound",
    "symbol": "£",
    "countryCode": "je"
  },
  {
    "code": "JMD",
    "name": "Jamaican dollar",
    "symbol": "$",
    "countryCode": "jm"
  },
  {
    "code": "JOD",
    "name": "Jordanian dinar",
    "symbol": "JD",
    "countryCode": "ps"
  },
  {
    "code": "JPY",
    "name": "Japanese yen",
    "symbol": "¥",
    "countryCode": "jp"
  },
  {
    "code": "KES",
    "name": "Kenyan shilling",
    "symbol": "Sh",
    "countryCode": "ke"
  },
  {
    "code": "KGS",
    "name": "Kyrgyzstani som",
    "symbol": "с",
    "countryCode": "kg"
  },
  {
    "code": "KHR",
    "name": "Cambodian riel",
    "symbol": "៛",
    "countryCode": "kh"
  },
  {
    "code": "KID",
    "name": "Kiribati dollar",
    "symbol": "$",
    "countryCode": "ki"
  },
  {
    "code": "KMF",
    "name": "Comorian franc",
    "symbol": "Fr",
    "countryCode": "km"
  },
  {
    "code": "KPW",
    "name": "North Korean won",
    "symbol": "₩",
    "countryCode": "kp"
  },
  {
    "code": "KRW",
    "name": "South Korean won",
    "symbol": "₩",
    "countryCode": "kr"
  },
  {
    "code": "KWD",
    "name": "Kuwaiti dinar",
    "symbol": "د.ك",
    "countryCode": "kw"
  },
  {
    "code": "KYD",
    "name": "Cayman Islands dollar",
    "symbol": "$",
    "countryCode": "ky"
  },
  {
    "code": "KZT",
    "name": "Kazakhstani tenge",
    "symbol": "₸",
    "countryCode": "kz"
  },
  {
    "code": "LAK",
    "name": "Lao kip",
    "symbol": "₭",
    "countryCode": "la"
  },
  {
    "code": "LBP",
    "name": "Lebanese pound",
    "symbol": "ل.ل",
    "countryCode": "lb"
  },
  {
    "code": "LKR",
    "name": "Sri Lankan rupee",
    "symbol": "Rs  රු",
    "countryCode": "lk"
  },
  {
    "code": "LRD",
    "name": "Liberian dollar",
    "symbol": "$",
    "countryCode": "lr"
  },
  {
    "code": "LSL",
    "name": "Lesotho loti",
    "symbol": "L",
    "countryCode": "ls"
  },
  {
    "code": "LYD",
    "name": "Libyan dinar",
    "symbol": "ل.د",
    "countryCode": "ly"
  },
  {
    "code": "MAD",
    "name": "Moroccan dirham",
    "symbol": "د.م.",
    "countryCode": "ma"
  },
  {
    "code": "MDL",
    "name": "Moldovan leu",
    "symbol": "L",
    "countryCode": "md"
  },
  {
    "code": "MGA",
    "name": "Malagasy ariary",
    "symbol": "Ar",
    "countryCode": "mg"
  },
  {
    "code": "MKD",
    "name": "denar",
    "symbol": "den",
    "countryCode": "mk"
  },
  {
    "code": "MMK",
    "name": "Burmese kyat",
    "symbol": "Ks",
    "countryCode": "mm"
  },
  {
    "code": "MNT",
    "name": "Mongolian tögrög",
    "symbol": "₮",
    "countryCode": "mn"
  },
  {
    "code": "MOP",
    "name": "Macanese pataca",
    "symbol": "P",
    "countryCode": "mo"
  },
  {
    "code": "MRU",
    "name": "Mauritanian ouguiya",
    "symbol": "UM",
    "countryCode": "mr"
  },
  {
    "code": "MUR",
    "name": "Mauritian rupee",
    "symbol": "₨",
    "countryCode": "mu"
  },
  {
    "code": "MVR",
    "name": "Maldivian rufiyaa",
    "symbol": ".ރ",
    "countryCode": "mv"
  },
  {
    "code": "MWK",
    "name": "Malawian kwacha",
    "symbol": "MK",
    "countryCode": "mw"
  },
  {
    "code": "MXN",
    "name": "Mexican peso",
    "symbol": "$",
    "countryCode": "mx"
  },
  {
    "code": "MYR",
    "name": "Malaysian ringgit",
    "symbol": "RM",
    "countryCode": "my"
  },
  {
    "code": "MZN",
    "name": "Mozambican metical",
    "symbol": "MT",
    "countryCode": "mz"
  },
  {
    "code": "NAD",
    "name": "Namibian dollar",
    "symbol": "$",
    "countryCode": "na"
  },
  {
    "code": "NGN",
    "name": "Nigerian naira",
    "symbol": "₦",
    "countryCode": "ng"
  },
  {
    "code": "NIO",
    "name": "Nicaraguan córdoba",
    "symbol": "C$",
    "countryCode": "ni"
  },
  {
    "code": "NOK",
    "name": "krone",
    "symbol": "kr",
    "countryCode": "sj"
  },
  {
    "code": "NPR",
    "name": "Nepalese rupee",
    "symbol": "₨",
    "countryCode": "np"
  },
  {
    "code": "NZD",
    "name": "New Zealand dollar",
    "symbol": "$",
    "countryCode": "pn"
  },
  {
    "code": "OMR",
    "name": "Omani rial",
    "symbol": "ر.ع.",
    "countryCode": "om"
  },
  {
    "code": "PAB",
    "name": "Panamanian balboa",
    "symbol": "B/.",
    "countryCode": "pa"
  },
  {
    "code": "PEN",
    "name": "Peruvian sol",
    "symbol": "S/ ",
    "countryCode": "pe"
  },
  {
    "code": "PGK",
    "name": "Papua New Guinean kina",
    "symbol": "K",
    "countryCode": "pg"
  },
  {
    "code": "PHP",
    "name": "Philippine peso",
    "symbol": "₱",
    "countryCode": "ph"
  },
  {
    "code": "PKR",
    "name": "Pakistani rupee",
    "symbol": "₨",
    "countryCode": "pk"
  },
  {
    "code": "PLN",
    "name": "Polish złoty",
    "symbol": "zł",
    "countryCode": "pl"
  },
  {
    "code": "PYG",
    "name": "Paraguayan guaraní",
    "symbol": "₲",
    "countryCode": "py"
  },
  {
    "code": "QAR",
    "name": "Qatari riyal",
    "symbol": "ر.ق",
    "countryCode": "qa"
  },
  {
    "code": "RON",
    "name": "Romanian leu",
    "symbol": "lei",
    "countryCode": "ro"
  },
  {
    "code": "RSD",
    "name": "Serbian dinar",
    "symbol": "дин.",
    "countryCode": "rs"
  },
  {
    "code": "RUB",
    "name": "Russian ruble",
    "symbol": "₽",
    "countryCode": "ru"
  },
  {
    "code": "RWF",
    "name": "Rwandan franc",
    "symbol": "Fr",
    "countryCode": "rw"
  },
  {
    "code": "SAR",
    "name": "Saudi riyal",
    "symbol": "ر.س",
    "countryCode": "sa"
  },
  {
    "code": "SBD",
    "name": "Solomon Islands dollar",
    "symbol": "$",
    "countryCode": "sb"
  },
  {
    "code": "SCR",
    "name": "Seychellois rupee",
    "symbol": "₨",
    "countryCode": "sc"
  },
  {
    "code": "SDG",
    "name": "Sudanese pound",
    "symbol": "ج.س",
    "countryCode": "sd"
  },
  {
    "code": "SEK",
    "name": "Swedish krona",
    "symbol": "kr",
    "countryCode": "se"
  },
  {
    "code": "SGD",
    "name": "Singapore dollar",
    "symbol": "$",
    "countryCode": "bn"
  },
  {
    "code": "SHP",
    "name": "Saint Helena pound",
    "symbol": "£",
    "countryCode": "sh"
  },
  {
    "code": "SLE",
    "name": "Leone",
    "symbol": "Le",
    "countryCode": "sl"
  },
  {
    "code": "SOS",
    "name": "Somali shilling",
    "symbol": "Sh",
    "countryCode": "so"
  },
  {
    "code": "SRD",
    "name": "Surinamese dollar",
    "symbol": "$",
    "countryCode": "sr"
  },
  {
    "code": "SSP",
    "name": "South Sudanese pound",
    "symbol": "£",
    "countryCode": "ss"
  },
  {
    "code": "STN",
    "name": "São Tomé and Príncipe dobra",
    "symbol": "Db",
    "countryCode": "st"
  },
  {
    "code": "SYP",
    "name": "Syrian pound",
    "symbol": "£",
    "countryCode": "sy"
  },
  {
    "code": "SZL",
    "name": "Swazi lilangeni",
    "symbol": "L",
    "countryCode": "sz"
  },
  {
    "code": "THB",
    "name": "Thai baht",
    "symbol": "฿",
    "countryCode": "th"
  },
  {
    "code": "TJS",
    "name": "Tajikistani somoni",
    "symbol": "ЅМ",
    "countryCode": "tj"
  },
  {
    "code": "TMT",
    "name": "Turkmenistan manat",
    "symbol": "m",
    "countryCode": "tm"
  },
  {
    "code": "TND",
    "name": "Tunisian dinar",
    "symbol": "د.ت",
    "countryCode": "tn"
  },
  {
    "code": "TOP",
    "name": "Tongan paʻanga",
    "symbol": "T$",
    "countryCode": "to"
  },
  {
    "code": "TRY",
    "name": "Turkish lira",
    "symbol": "₺",
    "countryCode": "tr"
  },
  {
    "code": "TTD",
    "name": "Trinidad and Tobago dollar",
    "symbol": "$",
    "countryCode": "tt"
  },
  {
    "code": "TVD",
    "name": "Tuvaluan dollar",
    "symbol": "$",
    "countryCode": "tv"
  },
  {
    "code": "TWD",
    "name": "New Taiwan dollar",
    "symbol": "$",
    "countryCode": "tw"
  },
  {
    "code": "TZS",
    "name": "Tanzanian shilling",
    "symbol": "Sh",
    "countryCode": "tz"
  },
  {
    "code": "UAH",
    "name": "Ukrainian hryvnia",
    "symbol": "₴",
    "countryCode": "ua"
  },
  {
    "code": "UGX",
    "name": "Ugandan shilling",
    "symbol": "Sh",
    "countryCode": "ug"
  },
  {
    "code": "USD",
    "name": "United States dollar",
    "symbol": "$",
    "countryCode": "gu"
  },
  {
    "code": "UYU",
    "name": "Uruguayan peso",
    "symbol": "$",
    "countryCode": "uy"
  },
  {
    "code": "UZS",
    "name": "Uzbekistani soʻm",
    "symbol": "so'm",
    "countryCode": "uz"
  },
  {
    "code": "VES",
    "name": "Venezuelan bolívar soberano",
    "symbol": "Bs.S.",
    "countryCode": "ve"
  },
  {
    "code": "VND",
    "name": "Vietnamese đồng",
    "symbol": "₫",
    "countryCode": "vn"
  },
  {
    "code": "VUV",
    "name": "Vanuatu vatu",
    "symbol": "Vt",
    "countryCode": "vu"
  },
  {
    "code": "WST",
    "name": "Samoan tālā",
    "symbol": "T",
    "countryCode": "ws"
  },
  {
    "code": "XAF",
    "name": "Central African CFA franc",
    "symbol": "Fr",
    "countryCode": "td"
  },
  {
    "code": "XCD",
    "name": "Eastern Caribbean dollar",
    "symbol": "$",
    "countryCode": "ai"
  },
  {
    "code": "XOF",
    "name": "West African CFA franc",
    "symbol": "Fr",
    "countryCode": "bj"
  },
  {
    "code": "XPF",
    "name": "CFP franc",
    "symbol": "₣",
    "countryCode": "pf"
  },
  {
    "code": "YER",
    "name": "Yemeni rial",
    "symbol": "﷼",
    "countryCode": "ye"
  },
  {
    "code": "ZAR",
    "name": "South African rand",
    "symbol": "R",
    "countryCode": "na"
  },
  {
    "code": "ZMW",
    "name": "Zambian kwacha",
    "symbol": "ZK",
    "countryCode": "zm"
  },
  {
    "code": "ZWL",
    "name": "Zimbabwean dollar",
    "symbol": "$",
    "countryCode": "zw"
  }
];