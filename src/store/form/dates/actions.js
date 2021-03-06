import { SELECT_DATE, TOGGLE_DATEPICKER, SET_AVAILABLE_DATES } from 'store/actions';

const getDateByType = (state, dateType) => state.form.dates[dateType].date;

export const selectDate = (date, dateType) => {
	return {
		type: SELECT_DATE,
		dateType,
		payload: {
			date
		}
	};
};

export const toggleDatePicker = (isActive, dateType) => {
	return {
		type: TOGGLE_DATEPICKER,
		dateType,
		payload: {
			isActive
		}
	};
};

export const setAvailableDates = (availableDates, dateType) => {
	return {
		type: SET_AVAILABLE_DATES,
		dateType,
		payload: {
			availableDates
		}
	};
};

/**
 * Some wrapper for `SELECT_DATE` action.
 *
 * @param {Moment|null} date
 * @param {String} dateType
 * @returns {Function}
 */
export const datepickerChange = (date, dateType) => {
	return (dispatch, getState) => {
		const state = getState();

		// If the new departure date is `bigger` than the selected return date,
		// clear the return date.
		if (dateType === 'departure') {
			const anotherDate = getDateByType(state, 'return');

			if (anotherDate && anotherDate.isBefore(date)) {
				dispatch(selectDate(null, 'return'));
				dispatch(toggleDatePicker(false, 'return'));
			}
		}

		// Do the same thing if the selected departure date is `smaller` than the new return date.
		else if (dateType === 'return') {
			const anotherDate = getDateByType(state, 'departure');

			if (anotherDate && anotherDate.isAfter(date)) {
				dispatch(selectDate(date, 'departure'));
			}
		}

		// Update new date.
		dispatch(selectDate(date, dateType));
	};
};
