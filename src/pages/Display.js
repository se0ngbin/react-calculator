import React from 'react';
import "./Display.css";

class Display extends React.Component {
	render() {
		let { result } = this.props;
		return (
			<div className="display">
				<p className="result">{result}</p>
			</div>
		);
	}
}

export default Display;

