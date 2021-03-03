const calculatorDisplay = document.querySelector('.display');

const digitButtons = document.querySelectorAll('.digit');
const functionButtons = document.querySelectorAll('.function');
const clearButton = document.querySelector('.button-clear');
const equalsButton = document.querySelector('.button-equals');

let input1 = 0;
let input2 = 0;
let operator = '';
let prevButtonType = "";

const clearVariables = () => {
    input1 = 0;
    input2 = 0;
    operator = '';
    prevButtonType = "";
    // console.log("Cleared");
}

const updateDisplay = (string) => {
    calculatorDisplay.innerText = string;
}

const flashDisplay = () => {
    calculatorDisplay.classList.add('display--flash');
    calculatorDisplay.addEventListener('transitionend', () => {
        calculatorDisplay.classList.remove('display--flash');
    });
}

const clearFunctionKeys = () => {
    functionButtons.forEach(button => {
        button.classList.remove('function--selected');
    })
}

const findDecimal = (string) => {
    let dotLocation = string.search(/[.]/g);
    if (dotLocation == -1) return false;
    else return dotLocation;
}

const add = (number1, number2) => {
    return number1 + number2;
}
const subtract = (number1, number2) => {
    return number1 - number2;
}
const multiply = (number1, number2) => {
    return number1 * number2;
};
const divide = (number1, number2) => {
    if (number2 === 0) return "ERROR";
    else return number1/number2;
}

const runClear = () => {
    clearVariables(); // clears variables
    clearFunctionKeys(); // removes formatting from active function key
    updateDisplay("0"); // zeroes display
}

const runEquals = () => {
    operate(input1, operator, input2);
    clearFunctionKeys();
    prevButtonType = "equalsKey";
}

const operate = (number1, operator, number2) => {
    // console.log(`Calculate: ${number1}, ${number2}, ${operator}`);
    number1 = parseFloat(number1);
    number2 = parseFloat(number2);
    let result;
    switch (operator) {
        case "+":
            result = add(number1, number2);
            break;
        case "-":
            result = subtract(number1, number2);
            break;
        case "*":
            result = multiply(number1, number2);
            break;
        case "/":
            result = divide(number1, number2);
            break;
        default:
            result = add(number1, number2);
    }
    if ((result==="ERROR") || Number.isNaN(result)) {
        updateDisplay("ERROR");
        flashDisplay();
        clearVariables();
    }
    else {
        resultString = result.toString();
        if (resultString.length > 15) {
            if ((findDecimal(resultString)>16) || (!findDecimal(resultString))) { // more than 15 digits left of the decimal, so display as overflow
                updateDisplay("OVERFLOW");
                flashDisplay();
                clearVariables();
            }
            else { // figure out how many to round down
                let leftDigits = findDecimal(resultString);
                let digitsToRound = 14-leftDigits;
                let temp = Math.round(result * Math.pow(10, digitsToRound)) / Math.pow(10, digitsToRound);
                result = temp;
                updateDisplay(result);
                input1 = result;
                input2 = '';
                operator = '';
            }
        }
        else {
            updateDisplay(result);
            input1 = result;
            input2 = '';
            operator = '';
        }

    }
}

const enterDigit = (digit) => {
    let temp = '';
    if (prevButtonType === "equalsKey") {
        clearVariables();
    }
    else if (prevButtonType === "numberKey") {
        temp = calculatorDisplay.innerText.toString();
    }
    if (temp.length >= 15) {
        // console.log('out of space');
        flashDisplay();
        return;
    }
    else { // still fits on screen
        if (digit===".") {
            if (findDecimal(temp)) return; // if a decimal point already exists, can't add another
            if (temp == '') {
                temp = '0';
            }
        }
        input2 = temp + digit;
        updateDisplay(input2);
        prevButtonType = "numberKey";
        // console.log(`Inputs are ${input1} and ${input2}, operator is ${operator}`);
    }
}

const enterFunction = (arithmeticFunction) => {
    clearFunctionKeys();
    if (operator==="") operator = "+";
    if (prevButtonType === "numberKey") {
        operate(input1, operator, input2);
    }
    else if (prevButtonType === "equalsKey") {
        console.log("won't recalculate until a new 2nd term is entered");
    }
    else {
        console.log('changed operator!');
    }
    operator = arithmeticFunction;
    let selectedFunctionButton = document.querySelector('div[data-button = "' + operator + '"]');
    selectedFunctionButton.classList.add('function--selected');
    prevButtonType = "functionKey";
    // console.log(`Inputs are ${input1} and ${input2}, operator is ${operator}`);
}

const figureKeyPress = (e) => {
    var isNumber = Number.isInteger(parseInt(e.key));
    var functionArray = ["+", "-", "*", "/"];
    var isFunction = functionArray.includes(e.key);
    if ((isNumber) || (e.key == ".")) {
        enterDigit(e.key);
        // console.log("digit");
    }
    else if (isFunction) {
        enterFunction(e.key);
        // console.log("function");
    }
    else if ((e.key == "Enter") || (e.key == "=")) {
        runEquals();
        // console.log("equals");
    }
    else if ((e.key == "Clear") || (e.key == "Escape")) {
        runClear();
        // console.log("clear");
    }
    else {
        return;
    }
}

document.addEventListener('keydown', figureKeyPress); // what to do when keys are pressed, points to the right helper function

/* Adds event listeners to all buttons */

equalsButton.addEventListener('click', runEquals);

clearButton.addEventListener('click', runClear);


digitButtons.forEach(button => {
    button.addEventListener('click', () => {
        let digit = button.getAttribute('data-button');
        enterDigit(digit);
    });
});

functionButtons.forEach(button => {
    button.addEventListener('click', () => {
        let arithmeticFunction = button.getAttribute('data-button');
        enterFunction(arithmeticFunction);
    });
});

/* Initialize variables and display bar */

clearVariables();
updateDisplay("0");