const calculatorDisplay = document.querySelector('.display');

const digitButtons = document.querySelectorAll('.digit');
const functionButtons = document.querySelectorAll('.function');
const clearButton = document.querySelector('.button-clear');
const equalsButton = document.querySelector('.button-equals');

let input1 = 0;
let input2 = 0;
let operator = '';
let prevButtonType = "";

const clear = () => {
    input1 = 0;
    input2 = 0;
    operator = '';
    prevButtonType = "";
    console.log(input1);
}

const updateDisplay = (string) => {
    calculatorDisplay.innerText = string;
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

clear();
updateDisplay("0");

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

const operate = (number1, operator, number2) => {
    console.log(`Calculate: ${number1}, ${number2}, ${operator}`);
    number1 = parseFloat(number1);
    number2 = parseFloat(number2);
    let result;
    switch (operator) {
        case "add":
            result = add(number1, number2);
            break;
        case "subtract":
            result = subtract(number1, number2);
            break;
        case "multiply":
            result = multiply(number1, number2);
            break;
        case "divide":
            result = divide(number1, number2);
            break;
        default:
            result = add(number1, number2);
    }
    if ((result==="ERROR") || Number.isNaN(result)) {
        clear();
        updateDisplay("ERROR");
    }
    else {
        resultString = result.toString();
        if (resultString.length > 15) {
            if ((findDecimal(resultString)>16) || (!findDecimal(resultString))) { // more than 15 digits left of the decimal, so display as overflow
                updateDisplay("OVERFLOW");
                clear();
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

clearButton.addEventListener('click', () => {
    clear();
    clearFunctionKeys();
    updateDisplay("0");
});

equalsButton.addEventListener('click', () => {
    operate(input1, operator, input2);
    clearFunctionKeys();
    prevButtonType = "equalsKey";
});

digitButtons.forEach(button => {
    button.addEventListener('click', () => {
        let temp = '';
        if (prevButtonType === "equalsKey") {
            clear();
        }
        else if (prevButtonType === "numberKey") {
            temp = calculatorDisplay.innerText.toString();
        }
        if (temp.length >= 15) {
            console.log('out of space');
            // change css to flash display box or something
            return;
        }
        else { // still fits on screen
            if (button.getAttribute('data-button')==="decimal") {
                if (findDecimal(temp)) return; // if a decimal point already exists, can't add another
                console.log('point'); //TODO. also standardize hover/active css
                if (temp == '') {
                    temp = '0';
                }
            }
            input2 = temp + button.innerText;
            updateDisplay(input2);
            prevButtonType = "numberKey";
            console.log(`Inputs are ${input1} and ${input2}, operator is ${operator}`);
        }
    });
});

functionButtons.forEach(button => {
    button.addEventListener('click', () => {
        clearFunctionKeys();
        if (operator==="") operator = "add";
        if (prevButtonType === "numberKey") {
            operate(input1, operator, input2);
        }
        else if (prevButtonType === "equalsKey") {
            console.log('...');
        }
        else {
            console.log('changed operator!');
        }
        operator = button.getAttribute('data-button');
        button.classList.add('function--selected');
        prevButtonType = "functionKey";
        console.log(`Inputs are ${input1} and ${input2}, operator is ${operator}`);
    });
});