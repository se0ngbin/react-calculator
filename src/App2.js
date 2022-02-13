import './App.css';
import Frame from "./pages/Frame"
import Key from "./pages/Key"
import Display from "./pages/Display"
import React from 'react';


const btnValues = ["AC", "+/-", "mod", "/", 7, 8, 9, "*", 4, 5, 6, "-", 1, 2, 3, "+", "2nd", 0, ".", "="];
const btnValues2 = ["C", "^", "(", ")", 7, 8, 9, "ln", 4, 5, 6, "log", 1, 2, 3, "Ans", "2nd", 0, ".", "="];
const operators = ["+", "-", "*", "/", "mod", "^", "neg"];
const miscKeys = ["log", "ln"];

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            keys: btnValues,
            result: "",
            proceed: true,
            isFloat: false,
            prevAns: NaN,
            nParen: 0
        }
    }


    rank = (op) => {
        if (op === "+" || op === "-") { return 1; }
        else if (op === "*" || op === "/" || op === "mod") { return 2; }
        else if (op === "^") { return 3; }
        else if (op === "neg") { return 4; }
    }

    infixToPostfix = (elements) => {
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
                        if (op === "(" || this.rank(op) < this.rank(element)) {
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

    // called to calculate expression inside (); done through recursion
    calculate = (result) => {
        result = result.replaceAll("(", "( ");
        result = result.replaceAll(")", " )")
        let i = result.indexOf("-", 0)
        while (i > 0) {
            if (result[i + 1] !== " ") {
                result = result.slice(0, i) + "-1 neg " + result.slice(i + 1);
            }
            i = result.indexOf("-", i + 1);
        }

        if (result.indexOf(" ") === -1) {
            this.setState({
                result: result,
                prevAns: result,
                proceed: false
            });
        }

        var elements = result.split(" ");
        let postfixElements = this.infixToPostfix(elements);
        let postfixStack = []

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
        this.setState({
            result: "" + newResult,
            prevAns: newResult,
            proceed: false
        });
    }

    pressedKey = key => {
        if (key === "AC") {
            this.setState({
                result: "",
                proceed: true,
                isFloat: false,
                nParen: 0,
            })
        }

        else if (key === "C" && this.state.result !== "") {
            let lastDig = this.state.result.slice(-1);
            if (!this.state.proceed || lastDig === "n") { this.setState({ proceed: true, result: "", isFloat: false, nParen: 0 }) }
            else {
                if (lastDig === " ") { this.setState({ result: this.state.result.slice(0, -3) }) }
                else if (lastDig === ".") { this.setState({ result: this.state.result.slice(0, -1), isFloat: false }) }
                else if (lastDig === "(") { this.setState({ result: this.state.result.slice(0, -1), nParen: this.state.nParen - 1 }) }
                else if (lastDig === ")") { this.setState({ result: this.state.result.slice(0, -1), nParen: this.state.nParen + 1 }) }
                else { this.setState({ result: this.state.result.slice(0, -1) }) }
            }
        }

        else if (key === "=" && this.state.proceed && this.state.result !== "" && this.state.nParen === 0) {
            let lastDig = this.state.result.slice(-1);
            console.log(lastDig);
            if (lastDig !== " ") {
                this.calculate(this.state.result)
            }
        }

        else if (key === "2nd") {
            if (this.state.keys === btnValues) { this.setState({ keys: btnValues2 }) }
            else { this.setState({ keys: btnValues }) }
        }

        // edge case handling done
        else if (key === "Ans") {
            let lastDig = this.state.result.slice(-1);
            console.log(this.state)

            if (this.state.proceed && (lastDig === " " || lastDig === '-')) {
                if (lastDig === '-' && this.state.prevAns < 0) {
                    console.log("first taken")
                    this.setState({
                        result: this.state.result.slice(0, -1) + -this.state.prevAns
                    })
                }
                else { console.log("second taken"); this.setState({ result: this.state.result + this.state.prevAns }) }
            }
            else {
                console.log("third taken")
                this.setState({
                    result: "" + this.state.prevAns,
                    proceed: false,
                    isFloat: false
                })
            }
        }

        // key is number
        else if (!isNaN(key)) {
            if (this.state.proceed) {
                // TODO: support operations like y(n) = y*n
                // must specify operation after ()
                if (this.state.result.slice(-1) === ")") { return; }
                this.setState({
                    result: this.state.result + key
                })
            }
            else {
                this.setState({
                    result: "" + key,
                    proceed: true
                })
            }
        }

        else if (key === ".") {
            // add . only if it isn't after result AND number doesn't have a . already
            if (this.state.proceed && !this.state.isFloat) {
                this.setState({
                    result: this.state.result + key,
                    isFloat: true
                })
            }
            else if (!this.state.proceed) {
                this.setState({
                    result: "" + key,
                    isFloat: true,
                    proceed: true
                })
            }
        }

        else if (key === "+/-") {
            // TODO: support negation inside parentheses expression
            if (this.state.result.slice(-1) === ")") { return; }
            if (this.state.result.slice(-1) === "(") { this.setState({ result: this.state.result + "-" }); return; }

            let lastNumIndex = this.state.result.lastIndexOf(" ")

            // if just one number or empty: lastnumindex = -1
            if (lastNumIndex === -1) {
                if (this.state.result !== "" && this.state.result.charAt(0) === '-') {
                    this.setState({
                        result: this.state.result.slice(1)
                    })
                }

                else {
                    this.setState({
                        result: "-" + this.state.result
                    })
                }
            }


            // if last was operator or number or paren
            let lastNum = this.state.result.slice(lastNumIndex + 1);

            if (lastNum.charAt(0) === '-') {
                this.setState({
                    result: this.state.result.slice(0, lastNumIndex + 1) + lastNum.slice(1)
                })
            }

            else {
                this.setState({
                    result: this.state.result.slice(0, lastNumIndex + 1) + "-" + lastNum
                })
            }
        }

        // is operator
        else if (this.state.result !== "" && operators.includes(key)) {
            // can't insert an operator after another OR after open parenthesis
            let lastDig = this.state.result.slice(-1);
            if (lastDig === " " || lastDig === "-" || lastDig === "(") { return; }

            this.setState({
                result: this.state.result + " " + key + " ",
                isFloat: false,
                proceed: true
            })
        }

        // is (. Only allowed after an operator OR minus sign OR as first entry OR after another (
        else if (key === "(") {
            let lastDig = this.state.result.slice(-1);

            if (!this.state.proceed || this.state.result === "") { this.setState({ proceed: true, result: "(", nParen: this.state.nParen + 1 }) }
            else if (lastDig === " " || lastDig === "-" || lastDig === "(") { this.setState({ result: this.state.result + "(", nParen: this.state.nParen + 1 }) }
        }

        // is ). Only allowed after a number or ) AND if there is a (.
        else if (key === ")") {
            if (this.state.nParen < 1) { return; }

            let lastDig = this.state.result.slice(-1);
            if (!isNaN(lastDig) || lastDig === ")") { this.setState({ result: this.state.result + ")", nParen: this.state.nParen - 1 }) }
        }

        // is logarithm --> takes logarithm of latest number
        else if (miscKeys.includes(key) && this.state.result !== "") {
            let lastDig = this.state.result.slice(-1);
            // if last was operator or ()
            if (lastDig === "(" || lastDig === ")" || lastDig === " ") { return; }

            let lastNumIndex = this.state.result.lastIndexOf(" ");
            let lastParen = this.state.result.lastIndexOf("(")
            lastNumIndex = lastNumIndex < lastParen ? lastParen : lastNumIndex;
            let num;

            // if just one number: lastnumindex = -1
            if (lastNumIndex === -1) { num = this.state.result; }

            // if multiple numbers
            else { num = this.state.result.slice(lastNumIndex + 1); }

            switch (key) {
                case "ln":
                    num = Math.log(num);
                    break;
                default:
                    num = Math.log10(num);
            }

            this.setState({
                result: this.state.result.slice(0, lastNumIndex + 1) + num.toFixed(8),
                isFloat: true,
                proceed: true
            })
        }
    };


    render() {
        return (
            <div>
                <div className="calculator-body">
                    <Display result={this.state.result} />
                    <Frame>
                        {this.state.keys.map((key, i) => {
                            return (
                                <Key
                                    value={this.state.keys[i]}
                                    onClick={() => this.pressedKey(key)}
                                />
                            );
                        })}
                    </Frame>
                </div>
            </div>
        );
    }
}

export default App;
