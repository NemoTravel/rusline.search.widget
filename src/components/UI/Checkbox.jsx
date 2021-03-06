import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Checkbox extends Component {
	static propTypes = {
		label: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired,
		trigger: PropTypes.func,
		checked: PropTypes.bool,
		isVisible: PropTypes.bool
	};

	static defaultProps = {
		isVisible: true
	};

	render() {
		const { id, label, trigger, checked, isVisible } = this.props;

		return isVisible ? <div className="widget-ui-checkbox">
			<input className="widget-ui-checkbox__input" type="checkbox" id={id} onChange={trigger} checked={checked}/>
			<label htmlFor={id}>
				<span className="widget-ui-checkbox__caption">
					{label}
				</span>
			</label>
		</div> : null;
	}
}
