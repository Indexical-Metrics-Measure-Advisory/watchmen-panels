import { faChartArea, faChartBar, faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { DarkenColors24 } from '../../../charts/color-theme';
import { ChartHeader, ChartOperators, ChartTitle } from '../../component/chart';
import { DropdownOption } from '../../component/dropdown';
import { useChartContext } from './chart-context';
import { ChartDefinitions } from './custom';
import { DropdownItem } from './custom/dropdown-item';
import { ChartKey, ChartSettings } from './custom/types';
import { DownloadButton } from './download-button';
import { ResizeButtons } from './resize-buttons';
import { SettingsButton } from './settings-button';
import { SettingsContainer } from './settings-container';
import { useChartSettingsContext } from './settings-context';

const ChartBody = styled.div.attrs({
	'data-widget': 'chart-body'
})`
	flex-grow: 1;
	height: 300px;
	border-top: var(--border);
	border-top-color: transparent;
	display: grid;
	grid-template-columns: 1fr;
	&[data-expanded=true] {
		@media (min-width: 800px) {
			height: 500px;
			> div[data-widget="chart"],
			> div[data-widget="chart-disabled"] {
				height: 500px;
			}
		}
		@media (min-width: 1600px) {
			height: 650px;
			> div[data-widget="chart"],
			> div[data-widget="chart-disabled"] {
				height: 650px;
			}
		}
	}
	&[data-settings-active=true] {
		border-top-color: var(--border-color);
	}
	&[data-settings-active=true][data-expanded=false] {
	}
	&[data-settings-active=true][data-expanded=true] {
		grid-template-columns: 70% 30%;
		> div[data-widget="chart-settings"] {
			display: block;
			position: relative;
			top: unset;
			left: unset;
			width: unset;
			height: unset;
			border-top: 0;
			border-left: var(--border);
			z-index: unset;
			background-color: var(--bg-color);
		}
	}
	&[data-settings-active=false] {
		> div[data-widget="chart-settings"] {
			display: block;
			position: relative;
			top: unset;
			left: unset;
			width: unset;
			height: unset;
			border-top: 0;
			border-left: var(--border);
			z-index: unset;
			background-color: var(--bg-color);
		}
	}
`;
const ChartDisabledPlaceholder = styled.div.attrs({
	'data-widget': 'chart-disabled'
})`
	flex-grow: 1;
	height: 300px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 50% auto 1fr;
	> svg {
		font-size: 48px;
		opacity: 0.2;
		&:first-child {
			color: ${DarkenColors24[0]};
			align-self: end;
		    justify-self: end;
		    padding-right: 4px;
		}
		&:nth-child(2) {
			color: ${DarkenColors24[1]};
			align-self: end;
		    padding-left: 4px;
		}
		&:nth-child(3) {
			color: ${DarkenColors24[2]};
			justify-self: end;
		    padding-right: 4px;
		}
		&:nth-child(4) {
			color: ${DarkenColors24[3]};
		    padding-left: 4px;
		}
	}
`;

const ChartDefOptions = ChartDefinitions.map(def => ({ label: def.name, value: def.key }));

export const CustomChartPanel = (props: {}) => {
	const chartContext = useChartContext();
	const settingsContext = useChartSettingsContext();
	const [ settings, setSettings ] = useState<ChartSettings>({});

	const onChartDefChanged = async (option: DropdownOption) => {
		setSettings({
			...settings,
			key: option.value as ChartKey
		});
	};

	return <Fragment>
		<ChartHeader>
			<ChartTitle>Chart on You</ChartTitle>
			<ChartOperators>
				<DownloadButton visible={false}/>
				<SettingsButton visible={true}/>
				<ResizeButtons/>
			</ChartOperators>
		</ChartHeader>
		<ChartBody data-expanded={chartContext.expanded} data-settings-active={settingsContext.active}>
			<ChartDisabledPlaceholder>
				<FontAwesomeIcon icon={faChartBar}/>
				<FontAwesomeIcon icon={faChartPie}/>
				<FontAwesomeIcon icon={faChartArea}/>
				<FontAwesomeIcon icon={faChartLine}/>
			</ChartDisabledPlaceholder>
			<SettingsContainer>
				<DropdownItem label="Chart" value={settings.key}
				              require={true} please={'Choose chart series...'}
				              options={ChartDefOptions} onOptionChanged={onChartDefChanged}/>
			</SettingsContainer>
		</ChartBody>
	</Fragment>;
};