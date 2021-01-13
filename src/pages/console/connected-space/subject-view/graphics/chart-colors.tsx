import React, { Fragment } from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { ConsoleSpaceSubjectChart } from '../../../../../services/console/types';
import { SettingsSegmentRowLabel } from './components';

export const ChartColors = (props: {
	chart: ConsoleSpaceSubjectChart;
}) => {
	const { chart } = props;

	const forceUpdate = useForceUpdate();

	const onValueChange = (value: boolean) => {
		forceUpdate();
	};

	return <Fragment>
		<SettingsSegmentRowLabel>Color Series:</SettingsSegmentRowLabel>
	</Fragment>;
};