import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import { v4 } from 'uuid';
import { useForceUpdate } from '../../../../../common/utils';
import {
	ConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDimension
} from '../../../../../services/console/types';
import { isDimensionCanAppend } from '../../../chart/chart-defender';
import { ChartDimension } from './chart-dimension';
import { AppendButton, SettingsSegmentTitle } from './components';

export const ChartSettingsDimensions = (props: {
	space: ConsoleSpace;
	subject: ConsoleSpaceSubject;
	chart: ConsoleSpaceSubjectChart;
}) => {
	const { space, subject, chart } = props;

	const forceUpdate = useForceUpdate();

	const onDimensionRemove = (dimension: ConsoleSpaceSubjectChartDimension) => {
		chart.dimensions = chart.dimensions.filter(d => d !== dimension);
		forceUpdate();
	};
	const onDimensionAddClicked = () => {
		chart.dimensions.push({});
		forceUpdate();
	};

	const canAddDimension = isDimensionCanAppend(chart);

	return <Fragment>
		<SettingsSegmentTitle><span>Dimensions</span></SettingsSegmentTitle>
		{chart.dimensions.map(dimension => {
			return <ChartDimension space={space} subject={subject} chart={chart} dimension={dimension}
			                       onRemove={onDimensionRemove}
			                       key={v4()}/>;
		})}
		{canAddDimension
			? <AppendButton onClick={onDimensionAddClicked}>
				<FontAwesomeIcon icon={faLayerGroup}/>
				<span>Add Dimension</span>
			</AppendButton>
			: null}
	</Fragment>;
};