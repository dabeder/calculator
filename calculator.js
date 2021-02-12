const calculatorDisplay = document.querySelector('.display');

const digitButtons = document.querySelectorAll('.digit');
const functionButtons = document.querySelectorAll('.function');
const clearButton = document.querySelector('.button-clear');
const equalsButton = document.querySelector('.button-equals');

let input1 = 0;
let input2 = '';
let operator = '';
let prevButtonType = "";

const clear = () => {
    input1 = 0;
    input2 = '';
    operator = '';
    prevButtonType = "";
    calculatorDisplay.innerText = "0";
    console.log(input1);
}

clear();

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
    number1 = parseInt(number1);
    number2 = parseInt(number2);
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
        calculatorDisplay.innerText = "ERROR";
        input1 = 0;
        input2 = '';
        operator = '';
        prevButtonType = '';
    }
    else {
        result = Math.round(parseFloat(result));
        calculatorDisplay.innerText = result;
        input1 = calculatorDisplay.innerText;
        input2 = '';
        operator = '';
    }
}

clearButton.addEventListener('click', clear);

equalsButton.addEventListener('click', () => {
    operate(input1, operator, input2);
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
            return;
        }
        else {
            calculatorDisplay.innerText = temp + button.innerText;
            input2 = parseInt(calculatorDisplay.innerText);
            prevButtonType = "numberKey";
            console.log(`Inputs are ${input1} and ${input2}`);
        }
    });
});

functionButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (operator==="") operator = "add";
        if (prevButtonType === "numberKey") {
            operate(input1, operator, input2);
        }
        else if (prevButtonType === "equalsKey") {
            console.log('...');
        }
        else {
            console.log('ignore for now but change ui');
        }
        operator = button.getAttribute('data-button');
        prevButtonType = "functionKey";
        console.log(operator);
    });
});