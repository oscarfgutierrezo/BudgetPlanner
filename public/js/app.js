// Variables y selectores

const requestBudget = document.querySelector("#request-budget__form");
const addExpenceForm = document.querySelector("#add-expences__form");
const expencesList = document.querySelector("#expences__list");



// Eventos

eventListeners();
function eventListeners () {
    // Funciones ejecutadas al cargar la página
    document.addEventListener("DOMContentLoaded", initApp)
    // Funciones ejecutadas al click en el botón "OK" en el ingreso del presupuesto
    requestBudget.addEventListener("submit", catchBudget)
    // Funciones ejecutadas al click en el botón "Add" en el ingreso de gastos
    addExpenceForm.addEventListener("submit", addExpence)
}



// Clases

class UserBudget {
    constructor(userBudget) {
        this.budget = userBudget;
        this.balance = userBudget;
        this.expences = [];
    }

    // Agregar el gasto ingresado al arreglo de gastos
    newExpence(expence) {
        this.expences = [...this.expences, expence];
        this.calculateBalance();
    }

    // Calcular el balance
    calculateBalance() {
        const accumulatedExpenses = this.expences.reduce((total, expence) => total + expence.expenceAmount, 0); // Reducción de los precios de los elementos del arreglo de gastos
        this.balance = this.budget - accumulatedExpenses; // Recalculo del balance
    }

    // Eliminar gastos de la lista
    removeExpence(id) {
        this.expences = this.expences.filter( expence => expence.id !== id); 
        this.calculateBalance()
    }
}

class UI {
    showBudgetAlert(message) {
        const budgetAlert = document.createElement("p")
        budgetAlert.textContent = message;
        budgetAlert.classList.add("text-danger", "fw-bolder", "text-center")
        const requestBudgetContainer = document.querySelector("#request-budget__container");
        requestBudgetContainer.insertBefore(budgetAlert, requestBudgetContainer.children[1]);
        setTimeout(() => budgetAlert.remove(), 1500);
    }

    insertUserBudget(userBudget) {
        const {budget, balance} = userBudget;
        const budgetPoints = numberPoints(budget);
        const balancePoints = numberPoints(balance);
        document.querySelector("#budget").textContent = `$${budgetPoints}`;
        document.querySelector("#balance").textContent = `$${balancePoints}`;
        requestBudget.reset();
    }

    showExpenceAlert(message, type) {
        const expenceAlert = document.createElement("p");
        expenceAlert.textContent = message;
        expenceAlert.classList.add("text-center", "fw-bolder");
        if(type === "error") {
            expenceAlert.classList.add("text-danger");
        } else {
            expenceAlert.classList.add("text-success");
        }
        addExpenceForm.insertBefore(expenceAlert, addExpenceForm.children[3]);
        setTimeout(() => expenceAlert.remove(), 2000);
    }

    showExpences(expences) {
        this.cleanHTML()
        
        expences.forEach( expence => {
            const {expenceName, expenceAmount, id} = expence;
            const expenceAmountPoints = numberPoints(expenceAmount);
            const newExpence = document.createElement("li");
            newExpence.classList.add("list-group-item");
            newExpence.dataset.id = id;

            newExpence.innerHTML = `${expenceName} <span>$ ${expenceAmountPoints}</span>`;

            const removeExpenceBtn = document.createElement("button");
            removeExpenceBtn.classList.add("remove-btn");
            removeExpenceBtn.innerHTML = "x";
            removeExpenceBtn.onclick = () => {
                removeExpence(id);
            }

            expencesList.appendChild(newExpence);

            newExpence.appendChild(removeExpenceBtn);
        }) 
    }

    cleanHTML() {
        while(expencesList.firstChild) {
            expencesList.removeChild(expencesList.firstChild);
        }
    }

    toUpdateBalance(balance) {
        const balancePoints = numberPoints(balance);
        document.querySelector("#balance").textContent = `$${balancePoints}`
    }
}

const ui = new UI();
let userBudget;


// Funciones
function initApp() {
    addExpenceForm.querySelector("button[type='submit']").disabled = true;
}

function catchBudget(evt) {
    evt.preventDefault();

    // Crear constante con el presupuesto ingresado por el usuario
    const enteredBudget = Number(requestBudget.querySelector("input").value);

    // Validar el dato ingresado por el usuario
    if(enteredBudget === "" || enteredBudget === null || isNaN(enteredBudget) || enteredBudget <= 0) {  
        ui.showBudgetAlert("Please enter a valid value"); // Muestra mensaje de alerta si el dato es erroneo
        requestBudget.querySelector("button[type='submit']").disabled = true; // Desabilita el botón para ingresar el presupuesto mientras desaparece el mensaje de alerta
        setTimeout(() => requestBudget.querySelector("button[type='submit']").disabled = false, 1500)
    } else {
        userBudget = new UserBudget(enteredBudget); // Instanciar 
        console.log(userBudget);
        ui.insertUserBudget(userBudget);
        addExpenceForm.querySelector("button[type='submit']").disabled = false;
    }
}

function addExpence(evt) {
    evt.preventDefault();
    
    const expenceName = document.querySelector("#expence").value;
    const expenceAmount = Number(document.querySelector("#amount").value);

    if(expenceName === "" || expenceAmount === "") {
        ui.showExpenceAlert("All fields are required", "error");
    } else if(expenceAmount <= 0 || isNaN(expenceAmount)) {
        ui.showExpenceAlert("Please enter a valid value", "error");
    } else {
        const expence = {expenceName, expenceAmount, id: Date.now()};
        userBudget.newExpence(expence);
        ui.showExpenceAlert("Expense added successfully");
    }

    const {expences, balance} = userBudget;
    ui.showExpences(expences);
    ui.toUpdateBalance(balance);
    addExpenceForm.reset();
}

function removeExpence(id) {
    userBudget.removeExpence(id)

    const {expences, balance} = userBudget;
    ui.showExpences(expences);
    ui.toUpdateBalance(balance);
}

function numberPoints(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}