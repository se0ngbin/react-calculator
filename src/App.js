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
			prevAns: NaN
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

	calculate = (result) => {
		var calculatedNumber = this.doOperation(result);

		this.setState({
			result: "" + calculatedNumber,
			prevAns: calculatedNumber,
			proceed: false
		});
	}



	pressedKey = key => {
		if (key === "AC") {
			this.setState({
				result: "",
				proceed: true,
				isFloat: false
			})
		}

		else if (key === "C" && this.state.result !== "") {
			if (!this.state.proceed) { this.setState({ proceed: true, result: "", isFloat: false }) }
			else {
				let lastDig = this.state.result.slice(-1);
				if (lastDig === " ") { this.setState({ result: this.state.result.slice(0, -3) }) }
				else if (lastDig === ".") { this.setState({ result: this.state.result.slice(0, -1), isFloat: false }) }
				else { this.setState({ result: this.state.result.slice(0, -1) }) }
			}
		}

		else if (key === "=" && this.state.proceed && this.state.result !== "") {
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


			// if last was operator or number
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
			this.setState({
				result: this.state.result + " " + key + " ",
				isFloat: false,
				proceed: true
			})
		}

		// is logarithm --> takes logarithm of latest number
		else if (miscKeys.includes(key) && this.state.result !== "") {
			let lastDig = this.state.result.slice(-1);
			// if last was operator or ()
			if (lastDig === "(" || lastDig === "(" || operators.includes(lastDig)) { return; }

			let lastNumIndex = this.state.result.lastIndexOf(" ");
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
