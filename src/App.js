import './App.css';
import Frame from "./classes/Frame"
import Key from "./classes/Key"
import Display from "./classes/Display"
import React from 'react';
import getResult from "./functions/calc-utils"
import { btnValues, btnValues2, operators } from './constants';


class App extends React.Component {
    constructor() {
        super();

        this.state = {
            keys: true,
            result: "",
            // false if last key pressed was the equal sign
            proceed: true,
            // keeps track of whether the last number was a decimal
            isFloat: false,
            prevAns: NaN,
            nParen: 0
        }
    }

    keyPad = () => {
        let keys = this.state.keys ? btnValues : btnValues2;
        let keyPad = keys.map((key, i) => {
            return (
                <Key
                    value={keys[i]}
                    key={i}
                    onClick={() => this.pressedKey(key)}
                />
            );
        });
        return keyPad;
    }


    calculate = (result) => {
        if (!(this.state.proceed && this.state.result !== "" 
            && this.state.nParen === 0 && " " !== this.state.result.slice(-1))) { return; }
        const newResult = getResult(result);
        this.setState({
            result: "" + newResult,
            prevAns: newResult,
            proceed: false
        });
    }

    handleAC = () => {
        this.setState({
            result: "",
            proceed: true,
            isFloat: false,
            nParen: 0
        })
    }

    handleC = () => {
        let lastDig = this.state.result.slice(-1);
        // if we are currently displaying the previous answer, clear the display
        if (!this.state.proceed) { this.setState({ proceed: true, result: "", isFloat: false, nParen: 0 }) }
        // else delete last key pressed
        else {
            if (lastDig === " ") { this.setState({ result: this.state.result.slice(0, -3) }) }
            else if (lastDig === ".") { this.setState({ result: this.state.result.slice(0, -1), isFloat: false }) }
            else if (lastDig === "(") { this.setState({ result: this.state.result.slice(0, -1), nParen: this.state.nParen - 1 }) }
            else if (lastDig === ")") { this.setState({ result: this.state.result.slice(0, -1), nParen: this.state.nParen + 1 }) }
            else { this.setState({ result: this.state.result.slice(0, -1) }) }
        }
    }

    handleAns = () => {
        if (isNaN(this.state.prevAns) || !this.state.proceed || !(this.state.result.slice(-1) === " " || 
            this.state.result.slice(-1) === '-' || this.state.result === "")) { return; }
        let lastDig = this.state.result.slice(-1);
        let result;

        // if last key is negation, negate the previous answer
        if (lastDig === '-' && this.state.prevAns < 0) { 
            result = this.state.result.slice(0, -1) + -this.state.prevAns;
        }
        else { result = this.state.result + this.state.prevAns }
        this.setState({ result: result })
    }

    handleNum = (key) => {
        if (this.state.proceed) {
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

    handleDp = () => {
        const lastDig = this.state.result.slice(-1)
        if (lastDig === ")") { return; }
        if (!this.state.proceed || this.state.result === "") {
            this.setState({
                result: "0.",
                isFloat: true,
                proceed: true
            })
        }
        else if (lastDig === " ") {
            this.setState({
                result: this.state.result + '0.',
                isFloat: true
            })
        }
        else if (this.state.proceed && !this.state.isFloat) {
            this.setState({
                result: this.state.result + '.',
                isFloat: true
            })
        }
    }

    handleNeg = () => {
        let lastChar = this.state.result.slice(-1);

        // can't negate after a negative sign
        if (lastChar === "-") { return; }
        // if first char OR after ( OR after an operator, add a negation sig 
        if (lastChar === " " || lastChar === "(" || this.state.result === "") { 
            this.setState({ result: this.state.result + "-" }); 
            return; 
        }

        // else act as a minus sign
        this.setState({
            result: this.state.result + " - ",
            isFloat: false,
            proceed: true
        })
    }

    handleOp = (key) => {
        // can't insert an operator after another OR after open parenthesis
        let lastDig = this.state.result.slice(-1);
        if (lastDig === " " || lastDig === "-" || lastDig === "(") { return; }

        this.setState({
            result: this.state.result + " " + key + " ",
            isFloat: false,
            proceed: true
        })
    }

    hanldeOpenParen = () => {
        let lastDig = this.state.result.slice(-1);

        if (!this.state.proceed || this.state.result === "") { 
            this.setState({ proceed: true, result: "(", nParen: this.state.nParen + 1 }) 
        }
        else if (lastDig === " " || lastDig === "-" || lastDig === "(") { 
            this.setState({ result: this.state.result + "(", nParen: this.state.nParen + 1 }) 
        }
    }

    handleCloseParen = () => {
        if (this.state.nParen < 1) { return; }

        let lastDig = this.state.result.slice(-1);
        if (!isNaN(lastDig) || lastDig === ")") { 
            this.setState({ result: this.state.result + ")", nParen: this.state.nParen - 1 }) 
        }
    }

    pressedKey = key => {
        if (key === "AC") { this.handleAC(); }
        else if ((key === "C") && this.state.result !== "") { this.handleC(); }
        else if (key === "=") { this.calculate(this.state.result); }
        else if (key === "Ans") { this.handleAns(); }
        else if (key === ".") { this.handleDp(); }
        else if (key === "-") { this.handleNeg(); }
        else if (key === "(") { this.hanldeOpenParen(); }
        else if (key === ")") { this.handleCloseParen(); }
        else if (key === "2nd") { this.setState({ keys: !this.state.keys }) }
        else if (!isNaN(key)) { this.handleNum(key); }
        else if (this.state.result !== "" && operators.includes(key)) { this.handleOp(key); }
    };


    render() {
        return (
            <div>
                <div className="calculator-body">
                    <Display result={this.state.result} />
                    <Frame>
                        {this.keyPad()}
                    </Frame>
                </div>
            </div>
        );
    }
}

export default App;
