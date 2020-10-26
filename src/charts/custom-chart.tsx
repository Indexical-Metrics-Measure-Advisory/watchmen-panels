import React, { Fragment } from 'react';
import styled, { useTheme } from 'styled-components';
import { DataSet } from '../data/types';
import { Theme } from '../theme/types';
import { EChart } from './chart';
import { ChartMap } from './custom';
import { ChartSettings } from './custom/types';

const ChartErrorReminder = styled.div.attrs({
	'data-widget': 'chart'
})`
	flex-grow: 1;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	opacity: 0.5;
`;

const hasValidDimension = (settings: ChartSettings) => {
	const { dimensions } = settings;
	if (!dimensions) {
		return false;
	}
	if (dimensions.length === 0) {
		return false;
	}
	return dimensions.some(dimension => !!dimension.column);
};

const hasValidIndicators = (settings: ChartSettings) => {
	const { indicators } = settings;
	if (!indicators) {
		return false;
	}
	if (indicators.length === 0) {
		return false;
	}
	return indicators.some(indicator => !!indicator.column);
};

export const CustomChart = (props: {
	className?: string,
	data: DataSet,
	settings: ChartSettings
}) => {
	const { className, data, settings } = props;

	const theme = useTheme() as Theme;
	if (!settings.key) {
		return <Fragment/>;
	}

	const errors: Array<string> = [];
	if (!hasValidDimension(settings)) {
		errors.push('At least one dimension is required.');
	}
	if (!hasValidIndicators(settings)) {
		errors.push('At lease one indicator is required.');
	}

	if (errors.length !== 0) {
		return <ChartErrorReminder>
			{errors.map(error => {
				return <div key={error}>{error}</div>;
			})}
		</ChartErrorReminder>;
	}

	const options = ChartMap[settings.key].buildOptions({ data, theme, settings });
	console.log(JSON.stringify(options));
	return <EChart className={className} options={options}/>;
};