import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configure-store';

import Container from 'containers';

document.addEventListener('DOMContentLoaded', function() {
	const store = configureStore({});

	render(
		<Provider store={store}>
			<Container />
		</Provider>,
		document.getElementById('react-dom-hook')
	);
})
