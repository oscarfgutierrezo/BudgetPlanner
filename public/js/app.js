// VARIABLES Y SELECTORES

// Formulario para ingresar el presupuesto
const requestBudget = document.querySelector("#request-budget__form");

// Formulario para ingresar gastos
const addExpenceForm = document.querySelector("#add-expences__form");

// UL para listar los gastos agregados
const expencesList = document.querySelector("#expences__list");

// Botón Reset
const resetBtn = document.querySelector("#reset-btn")



// EVENTOS

eventListeners();
function eventListeners () {
    // Funciones ejecutadas al cargar la página
    document.addEventListener("DOMContentLoaded", initApp)

    // Funciones ejecutadas al click en el botón "OK" en el ingreso del presupuesto
    requestBudget.addEventListener("submit", catchBudget)

    // Funciones ejecutadas al click en el botón "Add" en el ingreso de gastos
    addExpenceForm.addEventListener("submit", addExpence)

    // Funciones ejecutadas al click en el botón "Reset"
    resetBtn.addEventListener("click", resetPage)
}



// CLASES

class UserBudget {
    constructor(userBudget) {
        this.budget = userBudget;
        this.balance = userBudget;
        this.expences = [];
    }

    // Agregar el gasto ingresado al arreglo de gastos
    newExpence(expence) {

        // Mantener los elementos del arreglo y agregar el nuevo objeto "expence"
        this.expences = [...this.expences, expence];

        // Calcular el balance teniendo en cuenta los cambios en el arreglo
        this.calculateBalance();
    }

    // Calcular el balance
    calculateBalance() {
        // Reducir los precios de los elementos del arreglo de gastos a un sólo valor
        const accumulatedExpenses = this.expences.reduce((total, expence) => total + expence.expenceAmount, 0); 

        // Recalcular el balance a partir del valor total de gastos
        this.balance = this.budget - accumulatedExpenses; 
    }

    // Eliminar gastos de la lista
    removeExpence(id) {
        // Crear nuevo arreglo con los objetos cuyo ID es diferente al ID del objeto a eliminar
        this.expences = this.expences.filter( expence => expence.id !== id); 

        // Recalcular el balance con el nuevo arreglo
        this.calculateBalance()
    }
}

class UI {
    showBudgetAlert(message, type) {
        // Crear la etiqueta HTML con el mensaje y las clases
        const budgetAlert = document.createElement("p");
        budgetAlert.textContent = message;
        budgetAlert.classList.add("fw-bolder", "text-center");

        // Agregar clases dependiendo el tipo de mensaje
        alertColor(budgetAlert, type)

        // Insertar el mensaje en el DOM
        const requestBudgetContainer = document.querySelector("#request-budget__container");
        requestBudgetContainer.insertBefore(budgetAlert, requestBudgetContainer.children[1]);

        // Eliminar el mensaje después de 2.5s
        setTimeout(() => budgetAlert.remove(), 2500);
    }

    insertUserBudget(userBudget) {
        // Destructuring sobre el objeto userBudget
        const {budget, balance} = userBudget; 
        
        // Convertir datos a strings y agregar puntos cada 3 dígitos
        const budgetPoints = numberPoints(budget);
        const balancePoints = numberPoints(balance);

        // Insertar datos en DOM
        document.querySelector("#budget").textContent = `$${budgetPoints}`;
        document.querySelector("#balance").textContent = `$${balancePoints}`;

        // Resetear formulario
        requestBudget.reset();
    }

    showExpenceAlert(message, type) {
        // Crear la etiqueta HTML con el mensaje y las clases
        const expenceAlert = document.createElement("p");
        expenceAlert.textContent = message;
        expenceAlert.classList.add("text-center", "fw-bolder");

        // Agregar clases dependiendo el tipo de mensaje
        alertColor(expenceAlert, type)

        // Insertar la alerta en el DOM
        addExpenceForm.insertBefore(expenceAlert, addExpenceForm.children[3]);

        // Remover la alerta después de 2s
        setTimeout(() => expenceAlert.remove(), 2500);
    }

    showExpences(expences) {
        // Limpiar el UL para evitar que se listen gastos repetidos 
        this.cleanHTML()
        
        // Iterar sobre el arreglo que contiene los gastos
        expences.forEach( expence => {
            
            // Destructuring sobre cada objeto de gasto
            const {expenceName, expenceAmount, id} = expence;

            // Convertir "expenceAmount" en string y agregarle puntos cada 3 dígitos
            const expenceAmountPoints = numberPoints(expenceAmount);

            // Crear la etiqueta HTML, agregar clases, data-id y texto
            const newExpence = document.createElement("li");
            newExpence.classList.add("list-group-item");
            newExpence.dataset.id = id;
            newExpence.innerHTML = `${expenceName} <span>$ ${expenceAmountPoints}</span>`;

            // Crear la etiqueta para el botón que permite eliminar cada gasto, agregar clases y texto
            const removeExpenceBtn = document.createElement("button");
            removeExpenceBtn.classList.add("remove-btn");
            removeExpenceBtn.innerHTML = "x";
            
            // Ejecutar la función removeExpence al hacer clic sobre el botón teniendo como argumento el id de cada objeto de gasto
            removeExpenceBtn.onclick = () => {
                removeExpence(id);
            }

            // Agregar el botón en el LI de cada gasto
            newExpence.appendChild(removeExpenceBtn);

            // Mostrar la información del gasto en el DOM
            expencesList.appendChild(newExpence);
        }) 
    }

    // Limpiar el UL que contiene la lista de gastos
    cleanHTML() {
        while(expencesList.firstChild) {
            expencesList.removeChild(expencesList.firstChild);
        }
    }

    // Actualizar el balance que se muestra en el DOM
    toUpdateBalance(balance) {
        // Convertir el balance en string y agregarle puntos cada 3 dígitos
        const balancePoints = numberPoints(balance);
        // Mostrar el balance en el DOM
        document.querySelector("#balance").textContent = `$${balancePoints}`
    }

    checkBudget(budgetObj) {
        const {budget, balance} = budgetObj;
        const balanceDOM = document.querySelector(".balance-container");

        // Verificar si se ha gastado más del 75% o del 50% del presupuesto
        if( (budget / 4) > balance & balance > 0 ) {
            ui.showBudgetAlert("You spent more than 75% of the budget", "error")
            balanceDOM.classList.remove("div-success", "div-warning");
            balanceDOM.classList.add("div-danger")
        } else if ( (budget / 2) > balance & balance > 0 ) {
            ui.showBudgetAlert("You spent more than 50% of the budget", "warning")
            balanceDOM.classList.remove("div-success", "div-danger");
            balanceDOM.classList.add("div-warning")
        } else {
            balanceDOM.classList.remove("div-warning", "div-danger");
            balanceDOM.classList.add("div-success")
        }

        // Mostrar alerta y desabilitar botón cuando se supera el presupuesto
        if(balance <= 0) {
            ui.showBudgetAlert("The budget is over", "error")
            addExpenceForm.querySelector("button[type='submit']").disabled = true;
            balanceDOM.classList.remove("div-success", "div-warning");
            balanceDOM.classList.add("div-danger")
        } else {
            addExpenceForm.querySelector("button[type='submit']").disabled = false;
        }
    }
}

const ui = new UI();

let userBudget;



// Funciones
function initApp() {
    // Desabilitar el bóton para agregar nuevos gastos  
    addExpenceForm.querySelector("button[type='submit']").disabled = true;
}

function catchBudget(evt) {
    evt.preventDefault();

    // Crear constante con el presupuesto ingresado por el usuario
    const enteredBudget = Number(requestBudget.querySelector("input").value);

    // Validar el dato ingresado por el usuario
    if(enteredBudget === "" || enteredBudget === null || isNaN(enteredBudget) || enteredBudget <= 0) {  
        // Mostrar mensaje de alerta si el dato es erroneo
        ui.showBudgetAlert("Please enter a valid value", "error"); 
        
        // Desabilitar el botón para ingresar el presupuesto mientras desaparece el mensaje de alerta
        requestBudget.querySelector("button[type='submit']").disabled = true; // 
        setTimeout(() => requestBudget.querySelector("button[type='submit']").disabled = false, 2500)
    } else {
        // Instanciar userBudget a partir del presupuesto ingresado por el usuario. El presupuesto se convierte en el valor de this.budget y this.balance
        userBudget = new UserBudget(enteredBudget); 

        // Insertar el presupuesto en el DOM
        ui.insertUserBudget(userBudget);

        // Habilitar el botón OK
        addExpenceForm.querySelector("button[type='submit']").disabled = false;

        requestBudget.querySelector("button[type='submit']").disabled = true;
    }
}

function addExpence(evt) {
    evt.preventDefault();
    
    // Capturar los datos ingresados por el usuario en la sección de agregar gasto
    const expenceName = document.querySelector("#expence").value;
    const expenceAmount = Number(document.querySelector("#amount").value);

    // Validar los datos ingresados
    if(expenceName === "" || expenceAmount === "") {
        // Mostrar mensaje de alerta si alguno de los campos está vacío
        ui.showExpenceAlert("All fields are required", "error");

    } else if(expenceAmount <= 0 || isNaN(expenceAmount)) {
        // Mostrar mensaje de alerta si en el campo "amount" se ingresa un dato que no es número positivo
        ui.showExpenceAlert("Please enter a valid value", "error");

    } else {
        // Crear objeto con los datos ingresados por el usuario y un id
        const expence = {expenceName, expenceAmount, id: Date.now()};

        // Ejecutar la función "newExpence" con el objeto creado
        userBudget.newExpence(expence);

        // Mostrar mensaje indicando que el gasto se agregó con éxito
        ui.showExpenceAlert("Expense added successfully");
    }

    // Destructuring sobre el objeto userBudget
    const {expences, balance} = userBudget;

    // Mostrar en el DOM los gastos agregados
    ui.showExpences(expences);

    // Actualizar el balance mostrado en el DOM
    ui.toUpdateBalance(balance);

    // Verificar el balance
    ui.checkBudget(userBudget);

    // Reset sobre el formulario
    addExpenceForm.reset();
}

function removeExpence(id) {
    // Remover del arreglo de gastos el objeto con el ID indicado
    userBudget.removeExpence(id)

    // Destructuring sobre el objeto userBudget
    const {expences, balance} = userBudget;

    // Mostrar en el DOM los gastos sin el objeto eliminado
    ui.showExpences(expences);

    // Actualizar el balance mostrado en el DOM
    ui.toUpdateBalance(balance);

    // Verificar el balance
    ui.checkBudget(userBudget);
}

function numberPoints(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') // Expresión regular para agregar puntos cada 3 dígitos
}

function alertColor(alert, type) {
    if(type === "error") {
        alert.classList.add("text-danger");
    } else if(type === "warning") {
        alert.classList.add("text-attention");
    } else {
        alert.classList.add("text-success");
    }
}

function resetPage() {
    window.location.reload();
}