import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { useForceUpdate } from '../../../../../common/utils';
import {
	ConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartType
} from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import Input from '../../../../component/input';
import { DangerObjectButton } from '../../../../component/object-button';
import { ChartTypeDropdownOptions, defendChart } from '../../../chart/chart-defender';
import { ChartSettingsAdmin } from './chart-settings-admin';
import { ChartSettingsDimensions } from './chart-settings-dimensions';
import { ChartSettingsIndicators } from './chart-settings-indicators';
import { ChartSettingsRender } from './chart-settings-render';
import {
	BottomGapper,
	SettingsBackdrop,
	SettingsBody,
	SettingsContainer,
	SettingsFooter,
	SettingsHeader,
	SettingsRowLabel
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
	const onSettingsCloseClicked = () => closeSettings();

	defendChart(chart);

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
			<ChartSettingsDimensions space={space} subject={subject} chart={chart}/>
			<ChartSettingsIndicators space={space} subject={subject} chart={chart}/>
			<ChartSettingsRender chart={chart}/>
			<ChartSettingsAdmin chart={chart}/>
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