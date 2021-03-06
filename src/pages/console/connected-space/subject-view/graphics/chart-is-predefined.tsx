import React, { Fragment } from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { ConsoleSpaceSubjectChart } from '../../../../../services/console/types';
import Toggle from '../../../../component/toggle';
import { SettingsSegmentRowLabel } from './components';

export const ChartIsPredefined = (props: {
	chart: ConsoleSpaceSubjectChart;
}) => {
	const { chart } = props;

	const forceUpdate = useForceUpdate();

	const onValueChange = (value: boolean) => {
		chart.predefined = value;
		forceUpdate();
	};

	return <Fragment>
		<SettingsSegmentRowLabel>Predefined:</SettingsSegmentRowLabel>
		<Toggle value={chart.predefined || false} onChange={onValueChange}/>
	</Fragment>;
};