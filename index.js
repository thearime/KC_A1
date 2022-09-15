// Bank elements
const bankBalanceElement = document.getElementById("balance")
const outstandingLoanElement = document.getElementById("outstanding-loan")
const loanButtonElement = document.getElementById("loan-button")
const repayButtonElement = document.getElementById("repay-button")

// Work elements
const salaryElement = document.getElementById("salary")
const workButtonElement = document.getElementById("work-button")
const transferButtonElement = document.getElementById("transfer-button")

//Computer elements
const computerSelectElement = document.getElementById("computer-select")
const infoContainerElement = document.getElementById("info-description")
const specsElement = document.getElementById("specs")
const buyButtonElement = document.getElementById("buy-button")
const descriptionElement = document.getElementById("description");
const imgElement = document.getElementById("img");
const priceElement = document.getElementById("price");

let computers = []
let salary = 0
let bankBalance = 200
let hasOutstandingLoan = false
let loanAmount = 0
let currentComputer = {}

const baseURL = "https://noroff-komputer-store-api.herokuapp.com/";

fetch(baseURL + "computers")
    .then(response => response.json())
    .then(data => computers = data)
    .then(computers => addComputersToSelection(computers))

const addComputersToSelection = (computers) => {
    computers.forEach(x => addComputerToSelection(x));
    imgElement.src = baseURL + computers[0].image;
}

const addComputerToSelection = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer .id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computerSelectElement.appendChild(computerElement);
    currentComputer = computers[0];
}

const handleComputerChange = (e) => {
    const selectedComputer = computers[e.target.selectedIndex];
    specsElement.innerText = selectedComputer.specs;
    currentComputer = selectedComputer;
    imgElement.src = baseURL + selectedComputer.image;
    descriptionElement.innerText = selectedComputer.description;
    infoContainerElement.innerText = selectedComputer.title;
    priceElement.innerText = selectedComputer.price + "NOK"
    
}

const getALoan = () => {
    let MAX_LOAN = bankBalance * 2;
    let loanRequest = Number(prompt("Enter amount"))

    const approveLoan = () => {
        if (hasOutstandingLoan) {
            alert("You already have an outstanding loan");
            return false;
        }
        else if (isNaN(loanRequest)) {
            alert("Amount has to be a number");
            return false;
        }
        else if (loanRequest > MAX_LOAN) {
            alert("Loan can not be higher than two times your balance");
            return false;
        }
        else if (loanRequest <= 0) {
            alert("Amount can not be zero or lower");
        return false;
        }
        else {
            return true;
        } 
    }

    if (approveLoan()) {
        bankBalance += loanRequest;
        loanAmount += loanRequest;
        hasOutstandingLoan = true;

        alert("Loan of: " + loanAmount + " current balance is: " + bankBalance)

        bankBalanceElement.innerText = bankBalance;
        outstandingLoanElement.innerText = loanAmount;
        repayButtonElement.hidden = false;
    }
}

const work = () =>  {
    salary += 100;
    salaryElement.innerText = salary;
}

const salaryToBankTransfer = () => {
    let payOffLoan = salary * 0.1;
    let salaryLeft = salary - payOffLoan;

    if(hasOutstandingLoan) {
        loanAmount -= payOffLoan;
        bankBalance += salaryLeft;

        outstandingLoanElement.innerText = loanAmount;
    }
    else {
        bankBalance += salary;
    }

    salary = 0;

    bankBalanceElement.innerText = bankBalance;
    salaryElement.innerText = salary;
}

const payBackLoan = () => {
    if(salary > 0) {
        loanAmount -= salary;
    }
    else {
        alert("You don't have enough money");
    }

    if(loanAmount > salary) {
        bankBalance += Math.abs(loanAmount);
    }
    salary = 0;

    bankBalanceElement.innerText = bankBalance;
    outstandingLoanElement.innerText = loanAmount;
    salaryElement.innerText = salary;

    if (loanAmount <= 0) {
        outstandingLoanElement.innerHTML = "";
        repayButtonElement.hidden = true;
        hasOutstandingLoan = false;
        loanAmount = 0;
      }
}

const buyComputer = () => {
    if (bankBalance >= currentComputer.price) {
        alert("You just bought a laptop!");
        bankBalance -= currentComputer.price;
        bankBalanceElement.innerText = bankBalance;
    }
    else {
        alert("You need more money to buy this computer");
    }
}

// Events
computerSelectElement.addEventListener("change", handleComputerChange)
loanButtonElement.addEventListener("click", getALoan)
transferButtonElement.addEventListener("click", salaryToBankTransfer)
repayButtonElement.addEventListener("click", payBackLoan)
workButtonElement.addEventListener("click", work)
buyButtonElement.addEventListener("click", buyComputer)
