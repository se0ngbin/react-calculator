import './App.css';
import Frame from "./pages/Frame"
import Key from "./pages/Key"
import Display from "./pages/Display"
import React from 'react';
import getResult from "./calc-utils"
import { btnValues, btnValues2, operators } from './constants';


class App extends React.Component {
    constructor() {
        super();

        this.state = {
            keys: btnValues,
            result: "",
            proceed: true,
            // keeps track of whether the last number was a decimal
            isFloat: false,
            prevAns: NaN,
            nParen: 0
        }
    }


    calculate = (result) => {
        const newResult = getResult(result);
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

        else if ((key === "C" || key === "del") && this.state.result !== "") {
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

        else if (key === "-") {
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
                result: this.state.result + " " + key + " ",
                isFloat: false,
                proceed: true
            })
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
            else if (lastDig === " " || lastDig === "-" || lastDig === "(") { 
                this.setState({ result: this.state.result + "(", nParen: this.state.nParen + 1 }) 
            }
        }

        // is ). Only allowed after a number or ) AND if there is a (.
        else if (key === ")") {
            if (this.state.nParen < 1) { return; }

            let lastDig = this.state.result.slice(-1);
            if (!isNaN(lastDig) || lastDig === ")") { this.setState({ result: this.state.result + ")", nParen: this.state.nParen - 1 }) }
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
