import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'reducers';

/**
 * Create Redux-store.
 * 
 * @param defaultState
 * @returns {Store}
 */
export function getStore(defaultState) {
	// Thunk middleware allows us to create functions instead of plain objects in action-creators (for async purposes).
	// @see https://github.com/gaearon/redux-thunk#motivation
	const store = createStore(
		rootReducer,
		defaultState, 
		applyMiddleware(
			thunk
		)
	);

	if (module.hot) {
		module.hot.accept('../reducers', () => {
			const nextRootReducer = require('../reducers');
			store.replaceReducer(nextRootReducer)
		})
	}
	
	return store;
}