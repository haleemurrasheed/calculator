    const display = document.getElementById("display");
    const buttons = document.querySelectorAll("button");

    let firstNumber = "";
    let secondNumber = "";
    let currentOperator = null;
    let shouldResetScreen = false;

    // ===== MATH FUNCTIONS (Using Arrow Functions and Unary Plus for conciseness) =====
    const add = (a, b) => a + b;
    const subtract = (a, b) => a - b;
    const multiply = (a, b) => a * b;
    const divide = (a, b) => b === 0 ? "Error" : a / b;

    function operate(operator, a, b) {
        // Using the Unary Plus (+) for concise string-to-number conversion
        a = +a;
        b = +b;
        switch (operator) {
            case "+": return add(a, b);
            case "-": return subtract(a, b);
            case "*": return multiply(a, b);
            case "/": return divide(a, b);
        }
    }

    // ===== DISPLAY & CONTROL FUNCTIONS =====
    function appendNumber(number) {
        if (shouldResetScreen) resetScreen();

        // Prevent multiple decimals
        if (number === "." && display.textContent.includes(".")) return;

        // Limit display length to keep it readable (15 chars)
        if (display.textContent.length >= 15 && number !== '⌫') return;

        // Handle the initial '0' and general appending
        if (display.textContent === "0" && number !== '.') {
            display.textContent = number;
        } else {
            display.textContent += number;
        }
    }

    function resetScreen() {
        display.textContent = "";
        shouldResetScreen = false;
    }

    function setOperator(operator) {
        if (currentOperator !== null) evaluate();
        firstNumber = display.textContent;
        currentOperator = operator;
        shouldResetScreen = true;
    }

    function evaluate() {
        if (currentOperator === null || shouldResetScreen) return;
        secondNumber = display.textContent;

        const result = operate(currentOperator, firstNumber, secondNumber);

        if (result === "Error") {
            display.textContent = "Error";
        } else {
            // Round result to prevent common JavaScript float math errors
            const finalResult = Math.round(result * 100000) / 100000;
            display.textContent = finalResult;
            firstNumber = finalResult;
        }
        currentOperator = null;
    }

    function clear() {
        display.textContent = "0";
        firstNumber = "";
        secondNumber = "";
        currentOperator = null;
        shouldResetScreen = false;
    }

    function deleteNumber() {
        if (display.textContent === "Error") {
            clear();
            return;
        }
        if (display.textContent.length === 1) {
            display.textContent = "0";
        } else {
            // Slice off the last character
            display.textContent = display.textContent.toString().slice(0, -1);
        }
    }

    // ===== ANIMATION =====
    function animateButton(button) {
        button.classList.add("active");
        setTimeout(() => button.classList.remove("active"), 150);
    }

    // ===== EVENT LISTENERS =====

    // 1. Button Click Handlers
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            handleButtonClick(button.textContent);
            animateButton(button);
        });
    });

    function handleButtonClick(value) {
        if (!isNaN(value) || value === ".") {
            appendNumber(value);
        } else if (["+", "-", "*", "/"].includes(value)) {
            setOperator(value);
        } else if (value === "=") {
            evaluate();
        } else if (value === "C") {
            clear();
        } else if (value === "⌫") {
            deleteNumber();
        }
    }

    // 2. Keyboard Support
    window.addEventListener("keydown", handleKeyboardInput);

    function handleKeyboardInput(e) {
        let key = e.key;
        let targetButton = null;

        if (key >= 0 && key <= 9) {
            appendNumber(key);
            targetButton = Array.from(buttons).find(b => b.textContent === key);
        } else if (key === ".") {
            appendNumber(".");
            targetButton = Array.from(buttons).find(b => b.textContent === ".");
        } else if (["+", "-", "*", "/"].includes(key)) {
            setOperator(key);
            targetButton = Array.from(buttons).find(b => b.textContent === key);
        } else if (key === "Enter" || key === "=") {
            evaluate();
            targetButton = Array.from(buttons).find(b => b.textContent === "=");
            e.preventDefault(); // Prevent default enter key action
        } else if (key === "Backspace") {
            deleteNumber();
            targetButton = Array.from(buttons).find(b => b.textContent === "⌫");
        } else if (key.toLowerCase() === "c" || key === "Escape") {
            clear();
            targetButton = Array.from(buttons).find(b => b.textContent === "C");
        }

        if (targetButton) animateButton(targetButton);
    }
