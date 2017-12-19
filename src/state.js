import { autocompleteAirportReducer, autocompleteGroupsReducer } from 'store/form/autocomplete/reducer';
import { selectDateReducer, toggleDatepickerReducer, setAvailableDatesReducer } from 'store/form/dates/reducer';
import moment from 'moment';

export const MODE_NEMO = 'NEMO';
export const MODE_WEBSKY = 'WEBSKY';
export const CLASS_TYPES = ['Economy', 'Business'];

export const systemState = {
	rootElement: null,
	webskyURL: '',
	nemoURL: '',
	routingGrid: null,
	locale: 'en',
	verticalForm: false,
	readOnlyAutocomplete: false,
	autoFocusArrivalAirport: false,
	autoFocusReturnDate: false,
	mode: MODE_NEMO,
	defaultDepartureAirport: null,
	defaultArrivalAirport: null,
	defaultDepartureDate: null,
	defaultReturnDate: null,
	defaultPassengers: {
		ADT: 1
	},
	defaultServiceClass: 'Economy',
	directOnly: false,
	vicinityDatesMode: false,
	useNearestAirport: false,
	highlightAvailableDates: false,
	vicinityDays: 3,
	enableCoupon: false,
	enableMileCard: false
};

export const previousSearchesGroup = {
	options: {},
	className: 'widget-form-airports__suggestion__recently',
	name: 'previousSearches'
};

export const autocompleteState = {
	departure: {
		isLoading: false,
		suggestions: [],
		airport: null
	},
	arrival: {
		isLoading: false,
		suggestions: [],
		airport: null
	},
	defaultGroups: {
		previousSearches: previousSearchesGroup
	}
};

export const datesState = {
	'departure': {
		isActive: true,
		date: null,
		availableDates: []
	},
	'return': {
		isActive: false,
		date: null,
		availableDates: []
	}
};

export const passengersState = {
	ADT: {
		title: 'passenger_ADT',
		ageTitle: 'passenger_ADT_age',
		code: 'ADT',
		count: 0
	},
	CLD: {
		title: 'passenger_CLD',
		ageTitle: 'passenger_CLD_age',
		code: 'CLD',
		count: 0
	},
	INF: {
		title: 'passenger_INF',
		ageTitle: 'passenger_INF_age',
		code: 'INF',
		count: 0
	},
	INS: {
		title: 'passenger_INS',
		ageTitle: 'passenger_INS_age',
		code: 'INS',
		count: 0
	}
};

export const additionalState = {
	classType: null,
	vicinityDates: null,
	directFlight: null
};

export const couponState = {
	isActive: false,
	number: null
};

export const mileCardState = {
	isActive: false,
	number: null,
	password: null
};

export const initialState = {
	system: systemState,
	form: {
		dates: datesState,
		passengers: passengersState,
		autocomplete: autocompleteState,
		additional: additionalState,
		coupon: couponState,
		mileCard: mileCardState
	}
};

export const fillStateFromCache = (currentState, stateFromCache) => {
	const state = currentState;

	// Let's fill `state` with data from `stateFromCache`.
	// -------------------------------------------------------------------------------------
	// Disclaimer: this bullshit below can be avoided with use of `lodash` or `underscore`,
	// but those libraries are not lightweight enough for us.
	if (stateFromCache) {
		// Check if language has been changed since last user visit.
		// If so, do not process cached airport information, because the cached data most likely is in the different language.
		const canBeProcessed = !stateFromCache.system || !stateFromCache.system.locale || stateFromCache.system.locale === state.system.locale;

		if (stateFromCache.form) {
			if (stateFromCache.form.autocomplete) {
				const cachedDepartureAutocomplete = stateFromCache.form.autocomplete.departure;
				const cachedArrivalAutocomplete = stateFromCache.form.autocomplete.arrival;
				const cachedAutocompleteGroups = stateFromCache.form.autocomplete.defaultGroups;

				if (canBeProcessed && cachedDepartureAutocomplete && cachedDepartureAutocomplete.airport) {
					state.form.autocomplete.departure = autocompleteAirportReducer(
						state.form.autocomplete.departure,
						cachedDepartureAutocomplete.airport
					);
				}

				if (canBeProcessed && cachedArrivalAutocomplete && cachedArrivalAutocomplete.airport) {
					state.form.autocomplete.arrival = autocompleteAirportReducer(
						state.form.autocomplete.arrival,
						cachedArrivalAutocomplete.airport
					);
				}

				if (canBeProcessed && cachedAutocompleteGroups && cachedAutocompleteGroups.previousSearches) {
					state.form.autocomplete.defaultGroups = autocompleteGroupsReducer(
						state.form.autocomplete.defaultGroups,
						cachedAutocompleteGroups.previousSearches
					);
				}
			}

			if (stateFromCache.form.dates) {
				const cachedDepartureDate = stateFromCache.form.dates.departure;
				const cachedReturnDate = stateFromCache.form.dates.return;
				const today = moment().startOf('day');

				if (cachedDepartureDate) {
					if (cachedDepartureDate.date) {
						const newDepartureDate = moment(cachedDepartureDate.date).locale(state.system.locale);

						if (newDepartureDate.isSameOrAfter(today)) {
							state.form.dates.departure = selectDateReducer(cachedDepartureDate, newDepartureDate);
						}
					}

					if (cachedDepartureDate.availableDates instanceof Array && cachedDepartureDate.availableDates.length) {
						state.form.dates.departure = setAvailableDatesReducer(state.form.dates.departure, cachedDepartureDate.availableDates);
					}
				}

				if (cachedReturnDate) {
					if (cachedReturnDate.date) {
						const newReturnDate = moment(cachedReturnDate.date).locale(state.system.locale);

						if (newReturnDate.isSameOrAfter(today)) {
							state.form.dates.return = toggleDatepickerReducer(cachedReturnDate, true);
							state.form.dates.return = selectDateReducer(state.form.dates.return, newReturnDate);
						}
					}

					if (cachedReturnDate.availableDates instanceof Array && cachedReturnDate.availableDates.length) {
						state.form.dates.return = setAvailableDatesReducer(state.form.dates.return, cachedReturnDate.availableDates);
					}
				}
			}

			if (stateFromCache.form.passengers) {
				for (const passType in stateFromCache.form.passengers) {
					if (stateFromCache.form.passengers.hasOwnProperty(passType)) {
						state.form.passengers[passType].count = stateFromCache.form.passengers[passType].count;
					}
				}
			}

			if (stateFromCache.form.additional) {
				for (const option in stateFromCache.form.additional) {
					if (stateFromCache.form.additional.hasOwnProperty(option)) {
						state.form.additional[option] = stateFromCache.form.additional[option];
					}
				}
			}

			if (stateFromCache.form.coupon) {
				const cachedCouponIsActive = stateFromCache.form.coupon.isActive;
				const cachedCouponNumber = stateFromCache.form.coupon.number;

				if (cachedCouponIsActive) {
					state.form.coupon.isActive = cachedCouponIsActive;
				}
				if (cachedCouponNumber) {
					state.form.coupon.number = cachedCouponNumber;
				}
			}

			if (stateFromCache.form.mileCard) {
				const cachedMileCardIsActive = stateFromCache.form.mileCard.isActive;
				const cachedMileCardNumber = stateFromCache.form.mileCard.number;
				const cachedMileCardPassword = stateFromCache.form.mileCard.password;

				if (cachedMileCardIsActive) {
					state.form.mileCard.isActive = cachedMileCardIsActive;
				}

				if (cachedMileCardNumber) {
					state.form.mileCard.number = cachedMileCardNumber;
				}

				if (cachedMileCardPassword) {
					state.form.mileCard.password = cachedMileCardPassword;
				}
			}
		}
	}

	return state;
};
