import React from 'react';
import DatesContainer from 'components/Form/Search/DatesContainer';
import AutocompleteContainer from 'components/Form/Search/AutocompleteContainer';
import PassengersContainer from 'components/Form/Search/PassengersContainer';
import AdditionalOptionsContainer from 'components/Form/Search/AdditionalOptionsContainer';
import { i18n } from 'utils';
import PropTypes from 'prop-types';

export default class Search extends React.Component {
	propTypes = {
		startSearch: PropTypes.func.isRequired,
		showCouponField: PropTypes.bool.isRequired,
		showMileCardField: PropTypes.bool.isRequired
	};

	render() {
		const { startSearch } = this.props;

		return <div className="widget-form-search">
			<div className="widget-form-search__wrapper">
				<AutocompleteContainer/>
				<DatesContainer/>

				<div className="row widget-form-search__footer">
					<div className="col">
						<PassengersContainer/>
					</div>

					<div className="col">
						<AdditionalOptionsContainer/>

						<button className="btn btn-primary widget-form-search__startButton" onClick={startSearch}>
							{i18n('form', 'search')}
						</button>
					</div>
				</div>
			</div>
		</div>;
	}
}
