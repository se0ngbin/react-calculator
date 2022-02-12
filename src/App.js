import './App.css';
import Frame from "./pages/Frame"
import Key from "./pages/Key"
import Display from "./pages/Display"
import React from 'react';


const btnValues = ["AC", "+/-", "mod", "/", 7, 8, 9, "*", 4, 5, 6, "-", 1, 2, 3, "+", "2nd", 0, ".", "="];
const btnValues2 = ["C", "^", "(", ")", 7, 8, 9, "ln", 4, 5, 6, "log", 1, 2, 3, "Ans", "2nd", 0, ".", "="];
const operators = ["+", "-", "*", "/", "mod", "^"];
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

	doOperation = (expression) => {
		var elements = expression.split(" ");
		var calculatedNumber = parseFloat(elements[0]);

		elements.forEach((element, i) => {
			switch (element) {
				case "+":
					calculatedNumber = parseFloat(elements[i - 1]) + parseFloat(elements[i + 1]);
					break;
				case "-":
					calculatedNumber = parseFloat(elements[i - 1]) - parseFloat(elements[i + 1]);
					break;
				case "*":
					calculatedNumber = parseFloat(elements[i - 1]) * parseFloat(elements[i + 1]);
					break;
				case "/":
					calculatedNumber = parseFloat(elements[i - 1]) / parseFloat(elements[i + 1]);
					break;
				case "mod":
					calculatedNumber = parseFloat(elements[i - 1]) % parseFloat(elements[i + 1]);
					break;
				case "^":
					calculatedNumber = parseFloat(elements[i - 1]) ** parseFloat(elements[i + 1]);
					break;
				default:
					break;
			}
		});

		//precision issues
		if (!isNaN(calculatedNumber)) { calculatedNumber = parseFloat(calculatedNumber.toFixed(12)); }

		console.log("result: %d", calculatedNumber);

		return calculatedNumber;
	}

	calcNewResult = (result, i) => {
		let lower = result.lastIndexOf(" ", i - 2) + 1;
		let upper = result.indexOf(" ", result.indexOf(" ", i) + 1);
		if (upper === -1 && lower === 0) { return "" + this.doOperation(result); }
		if (upper === -1) { return result.slice(0, lower) + this.doOperation(result.slice(lower)); }
		return result.slice(0, lower) + this.doOperation(result.slice(lower, upper)) + result.slice(upper);
	}

	parenCalc = (result) => {
		let initIndex = result.indexOf("(");
		if (initIndex === -1) {
			let newResult = this.calculate(result)
			this.setState({
				result: newResult,
				prevAns: newResult,
				proceed: false
			});
			return;
		}

		let endIndex = result.indexOf(")", initIndex)
		let nextParenIndex = result.indexOf("(", initIndex)

		while (nextParenIndex > endIndex) {
			initIndex = nextParenIndex
			endIndex = result.indexOf(")", initIndex)
			nextParenIndex = result.indexOf("(", initIndex)
		}

		this.parenCalc(result.slice(0, initIndex) + this.calculate(result.slice(initIndex + 1, endIndex)) + result.slice(endIndex + 1));
	}

	calculate = (result) => {
		if (result.indexOf(" ") === -1) {
			return result;
		}



		if (result.indexOf("^") !== -1) {
			let i = result.indexOf("^");
			return this.calculate(this.calcNewResult(result, i));
		}

		if (result.indexOf("*") !== -1 || result.indexOf("/") !== -1 || result.indexOf("m") !== -1) {
			let i = result.indexOf("*") !== -1 ? result.indexOf("*") : Number.MAX_SAFE_INTEGER;
			let j = result.indexOf("/") !== -1 ? result.indexOf("/") : Number.MAX_SAFE_INTEGER;
			let k = result.indexOf("m") !== -1 ? result.indexOf("m") : Number.MAX_SAFE_INTEGER;
			i = i < j ? i : j;
			i = i < k ? i : k;
			return this.calculate(this.calcNewResult(result, i));
		}

		if (result.indexOf("+") !== -1 || result.indexOf("-") !== -1) {
			let i = result.indexOf("+") !== -1 ? result.indexOf("+") : Number.MAX_SAFE_INTEGER;
			let j = result.indexOf("-") !== -1 ? result.indexOf("-") : Number.MAX_SAFE_INTEGER;
			i = i < j ? i : j;
			return this.calculate(this.calcNewResult(result, i));
		}
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
				this.parenCalc(this.state.result)
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
			// can't insert an operator after another
			if (this.state.result.slice(-1) === " " || this.state.result.slice(-1) === "-") { return; }

			this.setState({
				result: this.state.result + " " + key + " ",
				isFloat: false,
				proceed: true
			})
		}

		// is (. Only allowed after an operator OR minus sign OR as first entry
		else if (key === "(") {
			let lastDig = this.state.result.slice(-1);

			if (!this.state.proceed || this.state.result === "") { this.setState({ proceed: true, result: "(", nParen: this.state.nParen + 1 }) }
			else if (lastDig === " " || lastDig === "-") { this.setState({ result: this.state.result + "(", nParen: this.state.nParen + 1 }) }
		}

		// is ). Only allowed after a number AND if there is a (.
		else if (key === ")") {
			if (this.state.nParen < 1) { return; }

			let lastDig = this.state.result.slice(-1);
			if (!isNaN(lastDig)) { this.setState({ result: this.state.result + ")", nParen: this.state.nParen - 1 }) }
		}

		// is logarithm --> takes logarithm of latest number
		else if (miscKeys.includes(key) && this.state.result !== "") {
			let lastDig = this.state.result.slice(-1);
			// if last was operator or ()
			if (lastDig === "(" || lastDig === "(" || lastDig === " ") { return; }

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
