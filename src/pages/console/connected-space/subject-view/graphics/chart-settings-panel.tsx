import { faUncharted } from '@fortawesome/free-brands-svg-icons';
import { faDoorOpen, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { v4 } from 'uuid';
import { useForceUpdate } from '../../../../../common/utils';
import {
	ConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDimension,
	ConsoleSpaceSubjectChartIndicator,
	ConsoleSpaceSubjectChartIndicatorAggregator,
	ConsoleSpaceSubjectChartType
} from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import Input from '../../../../component/input';
import { DangerObjectButton } from '../../../../component/object-button';
import {
	ChartTypeDropdownOptions,
	defendChart,
	isDimensionCanAppend,
	isIndicatorCanAppend
} from '../../../chart/chart-defender';
import { ChartSettingsDimension } from './chart-settings-dimension';
import { ChartSettingsIndicator } from './chart-settings-indicator';
import {
	AppendButton,
	BottomGapper,
	SettingsBackdrop,
	SettingsBody,
	SettingsContainer,
	SettingsFooter,
	SettingsHeader,
	SettingsRowLabel,
	SettingsSegmentTitle
} from './components';

export const ChartSettingsPanel = (props: {
	space: ConsoleSpace;
	subject: ConsoleSpaceSubject;
	chart: ConsoleSpaceSubjectChart;
	visible: boolean;
	closeSettings: () => void;
}) => {
	const { space, subject, chart, visible, closeSettings } = props;

	const forceUpdate = useForceUpdate();

	const onNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		chart.name = event.target.value;
		forceUpdate();
	};
	const onTypeChanged = async (option: DropdownOption) => {
		chart.type = option.value as ConsoleSpaceSubjectChartType;
		forceUpdate();
	};
	const onDimensionRemove = (dimension: ConsoleSpaceSubjectChartDimension) => {
		chart.dimensions = chart.dimensions.filter(d => d !== dimension);
		forceUpdate();
	};
	const onDimensionAddClicked = () => {
		chart.dimensions.push({});
		forceUpdate();
	};
	const onIndicatorRemove = (indicator: ConsoleSpaceSubjectChartIndicator) => {
		chart.indicators = chart.indicators.filter(i => i !== indicator);
		forceUpdate();
	};
	const onIndicatorAddClicked = () => {
		chart.indicators.push({ aggregator: ConsoleSpaceSubjectChartIndicatorAggregator.NONE });
		forceUpdate();
	};
	const onSettingsCloseClicked = () => closeSettings();

	defendChart(chart);
	const canAddDimension = isDimensionCanAppend(chart);
	const canAddIndicator = isIndicatorCanAppend(chart);

	return <SettingsContainer data-visible={visible}>
		<SettingsBackdrop/>
		<SettingsHeader>
			<span>{chart.name || 'Noname'}</span>
		</SettingsHeader>
		<SettingsBody>
			<SettingsRowLabel>Name:</SettingsRowLabel>
			<Input value={chart.name || ''} onChange={onNameChanged}/>
			<SettingsRowLabel>Type:</SettingsRowLabel>
			<Dropdown options={ChartTypeDropdownOptions} value={chart.type} onChange={onTypeChanged}/>
			<SettingsSegmentTitle><span>Dimensions</span></SettingsSegmentTitle>
			{chart.dimensions.map(dimension => {
				return <ChartSettingsDimension space={space} subject={subject} chart={chart} dimension={dimension}
				                               onRemove={onDimensionRemove}
				                               key={v4()}/>;
			})}
			{canAddDimension
				? <AppendButton onClick={onDimensionAddClicked}>
					<FontAwesomeIcon icon={faLayerGroup}/>
					<span>Add Dimension</span>
				</AppendButton>
				: null}
			<SettingsSegmentTitle><span>Indicators</span></SettingsSegmentTitle>
			{chart.indicators.map(indicator => {
				return <ChartSettingsIndicator space={space} subject={subject} chart={chart} indicator={indicator}
				                               onRemove={onIndicatorRemove}
				                               key={v4()}/>;
			})}
			{canAddIndicator
				? <AppendButton onClick={onIndicatorAddClicked}>
					<FontAwesomeIcon icon={faUncharted}/>
					<span>Add Indicator</span>
				</AppendButton>
				: null}
			<BottomGapper/>
		</SettingsBody>
		<SettingsFooter>
			<DangerObjectButton onClick={onSettingsCloseClicked}>
				<FontAwesomeIcon icon={faDoorOpen}/>
				<span>Done & Close</span>
			</DangerObjectButton>
		</SettingsFooter>
	</SettingsContainer>;
};