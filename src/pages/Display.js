import React from 'react';
import "./Display.css";

class Display extends React.Component {
	render() {
		let { result } = this.props;
		return (
			<div className="display">
				{result}
			</div>
		);
	}
}

export default Display;

