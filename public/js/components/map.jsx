import React, { PropTypes, Component } from 'react';
import _ from 'underscore';

import GoogleMap from 'google-map-react';

const MARKER_SIZE = 15;
const MARKER_SIZE_HOVER = 50;
const markerStyle = {
  position: 'absolute',
  background: 'red',
  width: MARKER_SIZE,
  height: MARKER_SIZE,
  borderRadius: MARKER_SIZE,
  left: -MARKER_SIZE / 2,
  top: -MARKER_SIZE / 2
};

const hoverStyle = {
	position: 'absolute',
	background: '#fff',
	lineHeight: `${MARKER_SIZE_HOVER}px`,
	whiteSpace: 'nowrap',
	zIndex: 1000,
	width: MARKER_SIZE_HOVER,
	height: MARKER_SIZE_HOVER,
	borderRadius: MARKER_SIZE_HOVER,
	left: -MARKER_SIZE_HOVER / 2,
	top: -MARKER_SIZE_HOVER / 2
};

class Marker extends Component {
	render() {
		let style = this.props.$hover ? hoverStyle : markerStyle;

		return (
			<div style={style}>
				{ this.props.$hover ? this.props.text : null }
			</div>
		);
	}
}

export default class Map extends Component {
	static defaultProps = {
		center: { "lat" : 37.7749295, "lng" : -122.4194155 },
		zoom: 11,
	};

	render() {
		let { films } = this.props;

		let Markers = _(films).map(film => {
			return (
				<Marker {...film.loc} key={film[':id']} text={film.title} />
			);
		});

		return (
			<GoogleMap
				center={this.props.center}
				zoom={this.props.zoom}
				defaultZoom={11}>
				{ Markers } 
			</GoogleMap>
		);
	}
}