import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { change, hideResults } from 'ducks/search';
import { moveCenter } from 'ducks/map';

const inputStyle = {
	fontSize: 14,
	height: 30,
	padding: '0 10px',
	border: '1px solid #ddd',
	width: '100%',
};

const resultStyle = {
	listStyleType: 'none',
	float: 'left',
	width: '20%',
	padding: 10,
};

class Search extends Component {
	static propTypes = {
		value: PropTypes.string.isRequired,
		showResults: PropTypes.bool.isRequired,
		results: PropTypes.array.isRequired,
	};

	onChange(event) {
		let { dispatch } = this.props;
		let value = event.target.value;

		dispatch(change(value));
	}

	render() {
		let {
			value,
		} = this.props;

		return (
			<div className="search-box">
				<input 
					style={inputStyle}
					type="text" 
					placeholder="Search for movie locations" 
					value={value} 
					onChange={this.onChange.bind(this)} 
					/>
			</div>
		);
	}
}

class _Results extends Component {
	static propTypes = {
		value: PropTypes.string.isRequired,
		showResults: PropTypes.bool.isRequired,
		results: PropTypes.array.isRequired,
	};

	onClick(film) {
		let { dispatch } = this.props;

		if (film.loc) {
			dispatch(moveCenter(film.loc));
		} else {
			alert('could not geocode this movie');
		}
	}

	renderText(res) {
		let { value } = this.props;

		if (res['locations'].indexOf(value) !== -1) {
			return <span>{ res.locations } / { res.title }</span>;
		} else {
			return <span>{ res.title } / { res.locations }</span>;
		}
	}

	render() {
		let {
			results,
			showResults,
		} = this.props;

		return (
			showResults ?
				<ul style={resultStyle}>
					{ results.map(res => <li key={res[':sid']}><a href="#" onClick={this.onClick.bind(this, res)}>{ this.renderText(res) }</a></li>) }
				</ul> :
				<span />
		);
	}
}

function mapStateToProps(state = {}, ownProps) {
	return state.search;
}

export default connect(mapStateToProps)(Search);

export const Results = connect(mapStateToProps)(_Results);