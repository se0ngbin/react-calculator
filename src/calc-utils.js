import { operators } from "./constants";

const rank = (op) => {
    if (op === "+" || op === "-") { return 1; }
    else if (op === "*" || op === "/" || op === "mod") { return 2; }
    else if (op === "^") { return 3; }
    else if (op === "neg") { return 4; }
}

const infixToPostfix = (elements) => {
    let postfixStack = [];
    let tempStack = [];

    elements.forEach((element, i) => {
        if (!isNaN(parseFloat(element))) { postfixStack.push(element); }
        else if (element === "(") { tempStack.push(element); }
        else if (operators.includes(element)) {
            if (tempStack.length === 0) { tempStack.push(element); }
            else {
                while (tempStack.length > 0) {
                    let op = tempStack.pop()
                    if (op === "(" || rank(op) < rank(element)) {
                        tempStack.push(op);
                        break;
                    }
                    else { postfixStack.push(op); }
                }
                tempStack.push(element);
            }
        }
        else if (element === ")") {
            while (tempStack.length > 0) {
                let op = tempStack.pop()
                if (op === "(") { break; }
                postfixStack.push(op);
            }
        }
    })

    while (tempStack.length > 0) { postfixStack.push(tempStack.pop()); }
    return postfixStack;
}

const getResult = (result) => {
    // add spaces so we can split by spaces
    result = result.replaceAll("(", "( ");
    result = result.replaceAll(")", " )")

    // handle negation
    let i = result.indexOf("-", 0)
    while (i > 0) {
        if (result[i + 1] !== " ") {
            result = result.slice(0, i) + "-1 neg " + result.slice(i + 1);
        }
        i = result.indexOf("-", i + 1);
    }

    // if no spaces (=no operators), return result
    if (result.indexOf(" ") === -1) { return result; }

    // get postfix
    var elements = result.split(" ");
    let postfixElements = infixToPostfix(elements);
    let postfixStack = []

    // evaluate postfix using stack
    postfixElements.forEach((element, i) => {
        if (!isNaN(element)) { postfixStack.push(element); }
        else if (operators.includes(element)) {
            let v1 = postfixStack.pop();
            let v2 = postfixStack.pop();
            let calculatedNumber;
            switch (element) {
                case "+":
                    calculatedNumber = parseFloat(v2) + parseFloat(v1);
                    break;
                case "-":
                    calculatedNumber = parseFloat(v2) - parseFloat(v1);
                    break;
                case "neg":
                case "*":
                    calculatedNumber = parseFloat(v2) * parseFloat(v1);
                    break;
                case "/":
                    calculatedNumber = parseFloat(v2) / parseFloat(v1);
                    break;
                case "mod":
                    calculatedNumber = parseFloat(v2) % parseFloat(v1);
                    break;
                case "^":
                    calculatedNumber = parseFloat(v2) ** parseFloat(v1);
                    break;
                default:
                    console.log("error");
                    break;
            }
            postfixStack.push(calculatedNumber);
        }
    })

    let newResult = postfixStack.pop();
    return newResult;
}


export default getResult;