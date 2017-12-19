import { getDepartureOptions, getArrivalOptions, formIsValid } from '../selectors';
import { initialState } from '../../../state';
import { Selector } from 'redux-testkit';
import { createStore } from 'redux';
import { changeAutocompleteSuggestions } from '../autocomplete/actions';
import { setCounter } from '../passengers/actions';
import rootReducer from 'store/reducer';
import { setSelectedAirport } from '../autocomplete/actions';
import { selectDate } from '../dates/actions';
import { getAltLayout } from '../../../utils';

const getStore = () => {
	return createStore(rootReducer, initialState);
};

const correctAirport = { name: 'Москва', nameEn: 'Moscow', IATA: 'MOW' };
const anotherCorrectAirport = { name: 'Саратов', nameEn: 'Saratov', IATA: 'RTW' };
const correctPassengers = { ADT: 1 };
const wrongAirport = { IATA: 'MOW' };

/* global describe */
/* global it */
describe('store/form/selectors', () => {
	it('should return `false` on initial state', () => {
		Selector(formIsValid).expect(initialState).toReturn(false);
	});

	it('should return `true` when form is filled out', () => {
		const store = getStore();

		store.dispatch(setSelectedAirport(correctAirport, 'departure'));
		store.dispatch(setSelectedAirport(anotherCorrectAirport, 'arrival'));
		store.dispatch(selectDate({}, 'departure'));
		store.dispatch(setCounter('ADT', correctPassengers.ADT));

		Selector(formIsValid).expect(store.getState()).toReturn(true);
	});

	describe('departure', () => {
		it('should return empty array on initial state', () => {
			Selector(getDepartureOptions).expect(initialState).toReturn([]);
		});

		it('should return empty array when wrong options given', () => {
			const options = [wrongAirport];
			const store = getStore();

			store.dispatch(changeAutocompleteSuggestions(options, 'departure'));

			Selector(getDepartureOptions).expect(store.getState()).toReturn([]);
		});

		it('should return proper array', () => {
			const options = [{ airport: correctAirport }];
			const store = createStore(rootReducer, initialState);

			store.dispatch(changeAutocompleteSuggestions(options, 'departure'));

			Selector(getDepartureOptions).expect(store.getState()).toReturn([{
				label: 'МоскваMoscowMOW' + getAltLayout('Москва'),
				value: { airport: correctAirport }
			}]);
		});
	});

	describe('arrival', () => {
		it('should return empty array on initial state', () => {
			Selector(getArrivalOptions).expect(initialState).toReturn([]);
		});

		it('should return empty array when wrong options given', () => {
			const options = [wrongAirport];
			const store = createStore(rootReducer, initialState);

			store.dispatch(changeAutocompleteSuggestions(options, 'arrival'));

			Selector(getArrivalOptions).expect(store.getState()).toReturn([]);
		});

		it('should return proper array', () => {
			const options = [{ airport: correctAirport }];
			const store = createStore(rootReducer, initialState);

			store.dispatch(changeAutocompleteSuggestions(options, 'arrival'));

			Selector(getArrivalOptions).expect(store.getState()).toReturn([{
				label: 'МоскваMoscowMOW' + getAltLayout('Москва'),
				value: { airport: correctAirport }
			}]);
		});
	});
});
