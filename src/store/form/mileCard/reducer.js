import { CHANGE_MILE_CARD_NUMBER, CHANGE_MILE_CARD_PASSWORD } from 'store/actions';
import { mileCardState } from 'state';

export const mileCardReducer = (state, { type, newValue }) => {
	switch (type) {
		case CHANGE_MILE_CARD_NUMBER:
			return { ...state, number: newValue };

		case CHANGE_MILE_CARD_PASSWORD:
			return { ...state, password: newValue };
	}

	return state;
};

export default (state = mileCardState, action = {}) => {
	return mileCardReducer(state, action);
};
