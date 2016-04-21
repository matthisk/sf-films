import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { fetchFilms } from 'ducks/films';

import Search, { Results } from 'components/search';
import Map from 'components/map';

let mapWrapper = {
	height: '500px',
	float: 'right',
	width: '80%'
};

class Container extends Component {
	static propTypes = {
		films: PropTypes.object.isRequired,
		zoom: PropTypes.number.isRequired,
		center: PropTypes.shape({
			lat: PropTypes.number.isRequired,
			lng: PropTypes.number.isRequired,
		}).isRequired,
	};

	componentDidMount() {
		let { dispatch } = this.props;

		dispatch(fetchFilms());
	}

	render() {
		return (
			<div>
				<Search />
				<Results />
				<section style={mapWrapper}>
					<Map {...this.props} />
				</section>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		center: state.map.center,
		zoom: state.map.zoom,
		films: state.films
	};
}

export default connect(mapStateToProps)(Container);