//$(document).ready(function () {
//    $(".dropdown-menu").on('click', 'li a', function () {
//        $("#dropdownBtn:first-child").text($(this).text());
//        $("#dropdownBtn:first-child").val($(this).text());
//        $("#dropdownBtn:first-child").append("&nbsp;&nbsp;<span class='caret'></span>");
//    });
//});

//$('ul.nav').on('click', 'a', function () {
//    var xmlHttp = new window.XMLHttpRequest();
//    xmlHttp.onreadystatechange = function () {
//        if (this.readyState === 4 && this.status === 200) {
//            $('#tools').html(xmlHttp.responseText);
//            console.log(xmlHttp.responseText)
//            loadTab(tabclicked);
//        }
//    };

//    tabclicked = $(this).attr('name');
//    var href = $(this).attr('href');
//    xmlHttp.open("GET", href, true);
//    xmlHttp.send(null);

//});

function loadXML(xml) {
    var xhr = new XMLHttpRequest();
    //var tabInformation = document.getElementById("dispContent");
    //var currentTab = document.getElementsByClassName("active")[0];
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //selectTools(currentTab, this, tabInformation);
            initTabs(this);
        }
    }
    xhr.open("get", xml, false);
    xhr.send(null);
}

function initTabs(xml) {
    var tools = xml.responseXML.children;
    //console.log(tools);
    var tabInformation = document.getElementById("dispContent");
    var tab = document.getElementsByClassName("tabs");

    for (var i = 0; i < tools[0].childElementCount; i++) {
        tab[i].addEventListener("click", function () {
            selectTools(this, tools[0], tabInformation);
        });
    }

}

function selectTools(targetTab, xmlData, dispContent) {
    //var tools = xmlData.responseXML.children;
    //console.log(tools);
    //var tabInformation = document.getElementById("dispContent");
    var tab = document.getElementsByClassName("tabs");

    //console.log(tab[1]);
    //for (var i = 0; i <3; i++) {
    //    tab[i].addEventListener("click", function () {
    //        selectTools(this, tools[0], tabInformation);
    //    });
    //}

    var currentTab = document.getElementsByClassName("active")[0];

    currentTab.classList.remove("active");
    targetTab.classList.add("active");
    removeTabInformation(dispContent);

    if (targetTab.value === tab[0].value) {
        //console.log(targetTab.value);  
        var data = xmlData.children[targetTab.value];
        //console.log(data.children);
        createConverter(data.children, dispContent, "Mass");
        //loadUnitConverter(xmlData, targetTab.value, dispContent);
    }
    else if (targetTab.value === tab[1].value) {
        createMortgageCalculator(xmlData.children[1], dispContent);
    }
    else if (targetTab.value === tab[2].value) {
        createCurrencyConverter(xmlData.children[2], dispContent);
    }
}

function removeTabInformation(dispContent) {
    while (dispContent.hasChildNodes()) {
        dispContent.removeChild(dispContent.lastChild);
    }
}

var group1 = { group: "group1", factor: "1000", value: 0 }
var group2 = { group: "group2", factor: "1000", value: 0 }

function createConverter(xmlDispData, dispContent, conversionType) {
    var unitTitle = document.createElement("div");
    unitTitle.className += "toolsTitle";
    var toolsTitle = document.createTextNode("Unit Converter");
    unitTitle.appendChild(toolsTitle);
    dispContent.appendChild(unitTitle);

    var typeSelect = document.createElement("div");
    typeSelect.className = "typeSelect";
    var typeLabel = document.createElement("label");
    typeLabel.className = "control-label";
    typeLabel.id = "typeLabel";
    var typeLabelText = document.createTextNode("Unit type:");
    typeLabel.appendChild(typeLabelText);
    typeSelect.appendChild(typeLabel);
    dispContent.appendChild(typeSelect);

    var convertMain1 = document.createElement("div");
    convertMain1.className = "firstInput";
    var firstLabel = document.createElement("label");
    firstLabel.className = "control-label";
    var firstLabelText = document.createTextNode("From:");
    firstLabel.appendChild(firstLabelText);
    convertMain1.appendChild(firstLabel);
    dispContent.appendChild(convertMain1);

    var convertMain2 = document.createElement("div");
    convertMain2.className = "secondInput";
    dispContent.appendChild(convertMain2);

    var secondLabel = document.createElement("label");
    secondLabel.className = "control-label";
    var secondLabelText = document.createTextNode("To:");
    secondLabel.appendChild(secondLabelText);
    convertMain2.appendChild(secondLabel);
    dispContent.appendChild(convertMain2);

    for (var i = 0; i < xmlDispData.length; i++) {
        if (xmlDispData[i].tagName === "select3") {
            var dropdownMenu = document.createElement("select");
            dropdownMenu.id = xmlDispData[i].id;

            dropdownMenu.className += " form-control";
            createDropdownLists(dropdownMenu, xmlDispData[i], conversionType);
            dropdownMenu.addEventListener("change", function (e) {
                loadNewUnits("tools.xml", e);
            });
            typeSelect.appendChild(dropdownMenu);
        }
        else if (xmlDispData[i].tagName === "input1") {
            var inputElement = document.createElement("input");
            inputElement.id = xmlDispData[i].id;
            inputElement.className += "group1";
            inputElement.className += " form-control";
            inputElement.placeholder = 0;
            inputElement.addEventListener("input", function (e) {
                convertValuesOnInput(e);
            });
            convertMain1.appendChild(inputElement);
        }

        else if (xmlDispData[i].tagName === "select1") {
            var dropdownMenu = document.createElement("select");
            dropdownMenu.id = xmlDispData[i].id;
            dropdownMenu.className += "group1";
            dropdownMenu.className += " form-control";
            createDropdownLists(dropdownMenu, xmlDispData[i], conversionType);

            dropdownMenu.addEventListener("change", function (e) {
                changeUnits(e);
            });

            convertMain1.appendChild(dropdownMenu);
        }

        else if (xmlDispData[i].tagName === "input2") {
            var inputElement = document.createElement("input");
            inputElement.id = xmlDispData[i].id;
            inputElement.className += "group2";
            inputElement.className += " form-control";
            inputElement.placeholder = 0;
            inputElement.addEventListener("input", function (e) {
                convertValuesOnInput(e);
            });
            convertMain2.appendChild(inputElement);
        }

        else if (xmlDispData[i].tagName === "select2") {
            var dropdownMenu = document.createElement("select");
            dropdownMenu.id = xmlDispData[i].id;
            dropdownMenu.className += "group2";
            dropdownMenu.className += " form-control";
            createDropdownLists(dropdownMenu, xmlDispData[i], conversionType);

            dropdownMenu.addEventListener("change", function (e) {
                changeUnits(e);
            });

            convertMain2.appendChild(dropdownMenu);
        }
    }
}

function createDropdownLists(dropdownMenu, dropdownListElement, conversionType) {
    var firstAccessFlag = true;
    for (var j = 0; j < dropdownListElement.children.length; j++) {


        if (dropdownListElement.children[j].attributes.length === 0) {
            var dropdownOption = document.createElement("option");
            dropdownOption.value = dropdownListElement.children[j].innerHTML;
            dropdownOption.innerHTML = dropdownOption.value;
            dropdownMenu.appendChild(dropdownOption);
        }

        else if (dropdownListElement.children[j].attributes[1].value === conversionType) {
            var dropdownOption = document.createElement("option");
            dropdownOption.value = dropdownListElement.children[j].innerHTML;
            //console.log(dropdownListElement.children[j].innerHTML);
            dropdownOption.innerHTML = dropdownOption.value;

            dropdownOption.offsetFactor = dropdownListElement.children[j].attributes[0].value;
            // Set the factor to the first element on the list
            if (firstAccessFlag) {
                group1.factor = dropdownOption.offsetFactor;
                group2.factor = dropdownOption.offsetFactor;
                var input2 = document.getElementById("input2");
                if (input2 != null) {
                    //console.log(input2);
                    document.getElementById("input2").value = document.getElementById("input1").value = "";
                }

                firstAccessFlag = false;
            }
            dropdownMenu.appendChild(dropdownOption);
        }
    }
}

function changeUnits(changedUnit) {
    for (var g = 0; g < changedUnit.currentTarget.classList.length; g++) {
        var selectedFactor = changedUnit.currentTarget.options[changedUnit.currentTarget.selectedIndex].offsetFactor;
        if (changedUnit.currentTarget.classList.contains(group1.group)) {
            group1.factor = selectedFactor;
        }
        else if (changedUnit.currentTarget.classList.contains(group2.group)) {
            group2.factor = selectedFactor;
        }

        convertValues(document.getElementById("input1"));
    }
}

function convertValuesOnInput(updatedGroup) {
    var updatedValue = updatedGroup.currentTarget;
    convertValues(updatedValue);
}

function convertValues(target) {
    if (target.classList.contains(group1.group)) {
        group1.value = target.value;
        group2.value = group1.value * (group1.factor / group2.factor);
        var input2 = document.getElementById("input2");
        input2.value = group2.value;
    }
    else if (target.classList.contains(group2.group)) {
        group2.value = target.value;
        group1.value = group2.value * (group2.factor / group1.factor);
        var input1 = document.getElementById("input1");
        input1.value = group1.value;
    }
}

function loadNewUnits(url, selectedConversionType) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            refreshUnitLists(this.responseXML.children, selectedConversionType);
        }
    }
    xhr.open("get", url, false);
    xhr.send(null);
}

function refreshUnitLists(xr, selectedConversionType) {
    var unitConversionChildren = xr[0].children[0].children;
    //console.log(unitConversionChildren);
    for (var i = 0; i < unitConversionChildren.length; i++) {
        if (unitConversionChildren[i].id === "units1" && "units2") {
            var conversion = selectedConversionType.currentTarget.options[selectedConversionType.currentTarget.selectedIndex].value;
            for (var j = 0; j <= selectedConversionType.currentTarget.classList.length; j++) {
                var units = document.getElementById("units" + (j + 1));
                while (units.hasChildNodes()) {
                    units.removeChild(units.children[0]);
                }
                createDropdownLists(units, unitConversionChildren[i], conversion);
            }
        }
    }
}

////////////////////////////////////////////////////////////////// Mortgage //////////////////////////////////////////////////////////////////////////////////////

function createMortgageCalculator(xmlData, dispContent) {
    dispContent.innerHTML = xmlData.innerHTML;

    var price = document.getElementById("price");
    var downPayment = document.getElementById("downPayment");
    var interestRate = document.getElementById("interestRate");
    var mortgageLength = document.getElementById("mortgageLength");
    var payFrequency = document.getElementById("payFrequency");

    price.addEventListener("input", function () {
        calculateMortgage(price, downPayment, interestRate, mortgageLength, payFrequency);
    });
    downPayment.addEventListener("input", function () {
        calculateMortgage(price, downPayment, interestRate, mortgageLength, payFrequency);
    });
    interestRate.addEventListener("input", function () {
        calculateMortgage(price, downPayment, interestRate, mortgageLength, payFrequency);
    });
    mortgageLength.addEventListener("input", function () {
        calculateMortgage(price, downPayment, interestRate, mortgageLength, payFrequency);
    });
    payFrequency.addEventListener("change", function () {
        calculateMortgage(price, downPayment, interestRate, mortgageLength, payFrequency);
    });
}

function calculateMortgage() {
    var price = parseFloat(document.getElementById("price").value);
    var downPayment = parseFloat(document.getElementById("downPayment").value);
    var interestRate = parseFloat(document.getElementById("interestRate").value);
    var mortgageLength = parseFloat(document.getElementById("mortgageLength").value);
    var payFrequency = parseFloat(document.getElementById("payFrequency").value);
    var mortgageLabel = document.getElementById("mortgageLabel");

    for (var i = 0; i < arguments.length; i++) {
        if (isNaN(arguments[i].value) || price < downPayment) {
            mortgageLabel.innerHTML = "Invalid Inputs";
            return;
        }
        if (isNaN(parseFloat(arguments[i].value))) {
            mortgageLabel.innerHTML = "Please fill all the forms..";
            return;
        }
    }

    //https://mortgage.lovetoknow.com/Calculate_Mortgage_Payments_Formula
    //Monthly Payment = Princple * [monRate * (1 + monRate)^numPayment] / [(1 + monRate)^numPayment - 1]

    var principle = price - downPayment;
    var numPayment = mortgageLength * payFrequency;
    console.log(payFrequency);
    var monRate = interestRate / 100 / payFrequency;
    var term = Math.pow((1 + monRate), numPayment);
    var monPayment = principle * [monRate * term / (term - 1)];
    console.log(monPayment);
    mortgageLabel.innerHTML = "Mortgage Amount: $" + monPayment.toFixed(2);
}

//////////////////////////////////////////////////////////////Cunrrency Converter/////////////////////////////////////////////////////////////////////////////////


function createCurrencyConverter(xmlData, dispContent) {
    dispContent.innerHTML = xmlData.innerHTML;

    var currency1 = document.getElementById("CAD");
    var currency2 = document.getElementById("USD");
    var currency3 = document.getElementById("CNY");
    var currency4 = document.getElementById("EUR");

    currency1.addEventListener("input", function () {
        convertCurrency(event);
    });
    currency2.addEventListener("input", function () {
        convertCurrency(event);
    });
    currency3.addEventListener("input", function () {
        convertCurrency(event);
    });
    currency4.addEventListener("input", function () {
        convertCurrency(event);
    });
}

function convertCurrency(event) {
    var currency1 = parseFloat(document.getElementById("CAD").value);
    var currency2 = parseFloat(document.getElementById("USD").value);
    var currency3 = parseFloat(document.getElementById("CNY").value);
    var currency4 = parseFloat(document.getElementById("EUR").value);


    var baseCurrency = event.currentTarget.id;
    var baseCurrencyRate = currencies.find(currency => currency.abbreviation === baseCurrency).rate;

    if (baseCurrency == "CAD") {
        var ex1 = (currencies[1].rate / baseCurrencyRate).toFixed(4);
        var ex2 = (currencies[2].rate / baseCurrencyRate).toFixed(4);
        var ex3 = (currencies[3].rate / baseCurrencyRate).toFixed(4);
        document.getElementById("USD").value = (currency1 * ex1).toFixed(2);
        document.getElementById("CNY").value = (currency1 * ex2).toFixed(2);
        document.getElementById("EUR").value = (currency1 * ex3).toFixed(2);
    }
    else if (baseCurrency == "USD") {
        var ex0 = (currencies[0].rate / baseCurrencyRate).toFixed(4);
        var ex2 = (currencies[2].rate / baseCurrencyRate).toFixed(4);
        var ex3 = (currencies[3].rate / baseCurrencyRate).toFixed(4);
        document.getElementById("CAD").value = (currency2 * ex0).toFixed(2);
        document.getElementById("CNY").value = (currency2 * ex2).toFixed(2);
        document.getElementById("EUR").value = (currency2 * ex3).toFixed(2);
    }
    else if (baseCurrency == "CNY") {
        var ex0 = (currencies[0].rate / baseCurrencyRate).toFixed(4);
        var ex1 = (currencies[1].rate / baseCurrencyRate).toFixed(4);
        var ex3 = (currencies[3].rate / baseCurrencyRate).toFixed(4);
        document.getElementById("CAD").value = (currency3 * ex0).toFixed(2);
        document.getElementById("USD").value = (currency3 * ex1).toFixed(2);
        document.getElementById("EUR").value = (currency3 * ex3).toFixed(2);
    }
    else if (baseCurrency == "EUR") {
        var ex0 = (currencies[0].rate / baseCurrencyRate).toFixed(4);
        var ex1 = (currencies[1].rate / baseCurrencyRate).toFixed(4);
        var ex2 = (currencies[2].rate / baseCurrencyRate).toFixed(4);
        document.getElementById("CAD").value = (currency4 * ex0).toFixed(2);
        document.getElementById("USD").value = (currency4 * ex1).toFixed(2);
        document.getElementById("CNY").value = (currency4 * ex2).toFixed(2);
    }

}

fetch("https://api.exchangeratesapi.io/latest")
    .then((resp) => resp.json())
    .then(data => {
        data.rates["EUR"] = 1;
        currencies = currencies.filter(currency => data.rates[currency.abbreviation]);
        currencies.forEach(currency => currency.rate = data.rates[currency.abbreviation]);
    });


let currencies = [
    {
        name: "CAD Dollar",
        abbreviation: "CAD",
    },
    {
        name: "US Dollar",
        abbreviation: "USD",
    },
    {
        name: "Chinese Yuan",
        abbreviation: "CNY",
    },
    {
        name: "Euro",
        abbreviation: "EUR",
    },
];


