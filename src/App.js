import './App.css';
import Frame from "./pages/Frame"
import Key from "./pages/Key"
import Display from "./pages/Display"
import React from 'react';


const btnValues = ["AC", "+/-", "%", "/", 7, 8, 9, "*", 4, 5, 6, "-", 1, 2, 3, "+", "2nd", 0, ".", "="];
const operators = ["+", "-", "*", "/", "%"];

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			keys: btnValues,
			result: "",
			proceed: true,
			isFloat: false,
		}
	}

	calculate = (result) => {
		var elements = result.split(" ");
		var calculatedNumber;

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
				case "%":
					calculatedNumber = parseFloat(elements[i - 1]) % parseFloat(elements[i + 1]);
					break;
				default:
					break;
			}
		});

		//precision issues
		if (!isNaN(calculatedNumber)) {calculatedNumber = parseFloat(calculatedNumber.toFixed(12));}
		
		console.log("result: %d", calculatedNumber);

		this.setState({
			result: "" + calculatedNumber,
			proceed: false
		});
	}

	pressedKey = key => {
		if (key === "AC") {
			this.setState({
				result: ""
			})
		}

		else if (key === "C" && this.state.result !== "") {
			this.setState({
				result: this.state.result.slice(0, -1),
				proceed: true
			})
		}

		else if (key === "=" && this.state.proceed) {
			let lastDig = this.state.result.slice(-1);
			console.log(lastDig);
			if (lastDig !== " ") {
				this.calculate(this.state.result)
			}
		}

		else if (key === "2nd") {
			// TODO: switch key set
		}

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

		else if (key === "+/-" && !isNaN(this.state.result)) {
			if (this.state.result.charAt(0) === '-') {
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

		// is operator
		else if (this.state.result !== "" && operators.includes(key)) {
			this.setState({
				result: this.state.result + " " + key + " ",
				isFloat: false,
				proceed: true
			})
		}
		console.log(this.state.proceed);
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
