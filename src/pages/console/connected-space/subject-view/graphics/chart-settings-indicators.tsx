import { faUncharted } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import { v4 } from 'uuid';
import { useForceUpdate } from '../../../../../common/utils';
import {
	ConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartIndicator,
	ConsoleSpaceSubjectChartIndicatorAggregator
} from '../../../../../services/console/types';
import { isIndicatorCanAppend } from '../../../chart/chart-defender';
import { ChartIndicator } from './chart-indicator';
import { AppendButton, SettingsSegmentTitle } from './components';

export const ChartSettingsIndicators = (props: {
	space: ConsoleSpace;
	subject: ConsoleSpaceSubject;
	chart: ConsoleSpaceSubjectChart;
}) => {
	const { space, subject, chart } = props;

	const forceUpdate = useForceUpdate();

	const onIndicatorRemove = (indicator: ConsoleSpaceSubjectChartIndicator) => {
		chart.indicators = chart.indicators.filter(i => i !== indicator);
		forceUpdate();
	};
	const onIndicatorAddClicked = () => {
		chart.indicators.push({ aggregator: ConsoleSpaceSubjectChartIndicatorAggregator.NONE });
		forceUpdate();
	};

	const canAddIndicator = isIndicatorCanAppend(chart);

	return <Fragment>
		<SettingsSegmentTitle><span>Indicators</span></SettingsSegmentTitle>
		{chart.indicators.map(indicator => {
			return <ChartIndicator space={space} subject={subject} chart={chart} indicator={indicator}
			                       onRemove={onIndicatorRemove}
			                       key={v4()}/>;
		})}
		{canAddIndicator
			? <AppendButton onClick={onIndicatorAddClicked}>
				<FontAwesomeIcon icon={faUncharted}/>
				<span>Add Indicator</span>
			</AppendButton>
			: null}
	</Fragment>;
};