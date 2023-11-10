const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const form = document.getElementById("form");
const initialStateInput = document.getElementById("stateInput");
const gridSizeInput = document.getElementById("gridSize");
const initialOddsInput = document.getElementById("odds");
const compoundingMethodInput = document.getElementById("compoundingMethod");
const generationsInput = document.getElementById("generations");
const successAmountInput = document.getElementById("successAmount");


function getInitialCellState(initialPosition) {
    return {
        position: initialPosition,
        odds: initialOddsInput.value / 100
    }
}

function getNextCellState(currentState, success) {
    const amount = successAmountInput.value / 100;
    const max = stateInput.value.length;

    if (success) {
        return {
            position: Math.min(currentState.position + 1, max - 1),
            odds: compoundingMethodInput.value === "additive" ? Math.min(currentState.odds + amount, 1) :
                Math.min(currentState.odds * (1 + amount), 1)
        }
    }
    return {
        position: Math.max(currentState.position - 1, 0),
        odds: compoundingMethodInput.value === "additive" ? Math.max(currentState.odds - amount, 0) :
            Math.max(currentState.odds * (1 - amount), 0)
    }
}

function getInitialRowState() {
    const list = initialStateInput.value.split("");
    const initialRowState = [];
    for (let i = 0; i < list.length; ++i) {
        if (list[i] === "1") {
            initialRowState.push(getInitialCellState(i));
        }
    }

    return initialRowState;
}

function passOdds(odds) {
    return Math.random() < odds;
}

function generateNextRowState(currentRowState) {
    const results = [];
    for (let i = 0; i < currentRowState.length; ++i) {
        results.push(getNextCellState(currentRowState[i], passOdds(currentRowState[i].odds)))
    }

    return results;
}

function simulate() {
    const initialRow = getInitialRowState();

    const generationList = [initialRow];
    for (let i = 1; i <= generationsInput.value; ++i) {
        generationList.push(generateNextRowState(generationList[i - 1]));
    }
    console.log(generationList);
    render(generationList);
}

function renderRow(row, level, gridSize) {
    for (let i = 0; i < row.length; ++i) {
        ctx.fillRect(gridSize * row[i].position, level * gridSize, gridSize, gridSize);
    }
}

function render(list) {
    const gridSize = gridSizeInput.value;
    ctx.canvas.width = stateInput.value.length * gridSize;
    ctx.canvas.height = generationsInput.value * gridSize;
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    for (let i = 0; i < list.length; ++i) {
        renderRow(list[i], i, gridSize);
    }
}

form.addEventListener("submit", e => {
    e.preventDefault();

    const state = stateInput.value;
    const gridSize = gridSizeInput.value;
    const initialOdds = initialOddsInput.value;
    const compoundingMethod = compoundingMethodInput.value;
    const generations = generationsInput.value;
    const successAmount = successAmountInput.value;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("initialState", state);
    searchParams.set("gridSize", gridSize);
    searchParams.set("initialOdds", initialOdds);
    searchParams.set("compoundingMethod", compoundingMethod);
    searchParams.set("generations", generations);
    searchParams.set("successAmount", successAmount);
    window.location.search = searchParams.toString();

})

const searchParams = new URLSearchParams(window.location.search);
const initialState = searchParams.get("initialState");
const gridSize = searchParams.get("gridSize");
const initialOdds = searchParams.get("initialOdds");
const compoundingMethod = searchParams.get("compoundingMethod");
const generations = searchParams.get("generations");
const successAmount = searchParams.get("successAmount");

if (initialState) {
    initialStateInput.value = initialState;
}

if (gridSize) {
    gridSizeInput.value = gridSize;
}

if (initialOdds) {
    initialOddsInput.value = initialOdds;
}

if (compoundingMethod) {
    compoundingMethodInput.value = compoundingMethod;
}

if (generations) {
    generationsInput.value = generations;
}

if (successAmount) {
    successAmountInput.value = successAmount;
}

simulate();