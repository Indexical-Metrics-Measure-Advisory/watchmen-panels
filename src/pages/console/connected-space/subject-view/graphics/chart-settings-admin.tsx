import React, { Fragment } from 'react';
import { isAdmin } from '../../../../../services/account/account-session';
import { ConsoleSpaceSubjectChart } from '../../../../../services/console/types';
import { ChartIsPredefined } from './chart-is-predefined';
import { SettingsSegmentTitle } from './components';

export const ChartSettingsAdmin = (props: {
	chart: ConsoleSpaceSubjectChart;
}) => {
	if (!isAdmin()) {
		return null;
	}

	const { chart } = props;

	return <Fragment>
		<SettingsSegmentTitle><span>Admin</span></SettingsSegmentTitle>
		<ChartIsPredefined chart={chart}/>
	</Fragment>;
};