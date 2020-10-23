import { faChartArea, faChartBar, faChartLine, faChartPie, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { DarkenColors24 } from '../../../charts/color-theme';
import Button from '../../component/button';
import { ChartHeader, ChartOperators, ChartTitle } from '../../component/chart';
import { DropdownOption } from '../../component/dropdown';
import { GuideData, GuideDataColumn, GuideTopic, useGuideContext } from '../guide-context';
import { useChartContext } from './chart-context';
import { ChartDefinitions } from './custom';
import { DropdownItem } from './custom/dropdown-item';
import { InputItem } from './custom/input-item';
import { ChartKey, ChartSettings, ChartSettingsDimension, ChartSettingsIndicator } from './custom/types';
import { DownloadButton } from './download-button';
import { ResizeButtons } from './resize-buttons';
import { SettingsButton } from './settings-button';
import { SettingsContainer } from './settings-container';
import { useChartSettingsContext } from './settings-context';

interface FactorOption extends DropdownOption {
	topicName: string;
	topic: GuideTopic;
	column: GuideDataColumn;
}

const ChartBody = styled.div.attrs({
	'data-widget': 'chart-body'
})`
	flex-grow: 1;
	height: 300px;
	border-top: var(--border);
	border-top-color: transparent;
	display: flex;
	&[data-expanded=true] {
		@media (min-width: 800px) {
			height: 500px;
			> div[data-widget='chart'],
			> div[data-widget='chart-disabled'] {
				height: 500px;
			}
		}
		@media (min-width: 1600px) {
			height: 650px;
			> div[data-widget='chart'],
			> div[data-widget='chart-disabled'] {
				height: 650px;
			}
		}
	}
	&[data-settings-active=true] {
		border-top-color: var(--border-color);
		> div[data-widget='chart-settings'] {
			background-color: var(--bg-color-opacity7);
			> div:last-child {
				margin-bottom: calc(var(--margin) / 2);
			}
		}
	}
	&[data-settings-active=true][data-expanded=false] {
	}
	&[data-settings-active=true][data-expanded=true] {
		> div[data-widget='chart'],
		> div[data-widget='chart-disabled'] {
			width: 70%;
		}
		> div[data-widget='chart-settings'] {
			position: relative;
			top: unset;
			left: unset;
			width: 30%;
			height: unset;
			border-top: 0;
			border-left: var(--border);
			z-index: unset;
			background-color: var(--bg-color);
		}
	}
	&[data-settings-active=false][data-expanded=true] {
		> div[data-widget='chart'],
		> div[data-widget='chart-disabled'] {
			width: 100%
		}
		> div[data-widget='chart-settings'] {
			position: relative;
			top: unset;
			left: unset;
			width: 0;
			height: 0;
			border-top: 0;
			border-left: 0;
			padding-left: 0;
			padding-right: 0;
			z-index: unset;
			background-color: var(--bg-color);
			overflow: hidden;
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
const SettingsLeading = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 0.8em;
	font-weight: var(--font-bold);
	height: var(--height);
	border-bottom: var(--border);
	> button:last-child {
		min-width: 27px;
		height: 27px;
		padding: 0;
		border: 0;
		&:hover {
			background-color: var(--primary-color);
			color: var(--invert-color);
			opacity: 1;
		}
	}
`;
const FactorDropdown = styled(DropdownItem)`
	div[data-widget="dropdown"] {
		> span,
		> div > span {
			text-transform: capitalize;
		}
	}
`;

const ChartDefOptions = ChartDefinitions.map(def => ({ label: def.name, value: def.key }));

export const CustomChartPanel = (props: {}) => {
	const chartContext = useChartContext();
	const settingsContext = useChartSettingsContext();
	const guideContext = useGuideContext();
	const [ settings, setSettings ] = useState<ChartSettings>({
		dimensions: [ {} ],
		indicators: [ {} ]
	});

	const onDropdownValueChanged = (key: keyof ChartSettings) => async (option: DropdownOption) => {
		setSettings({
			...settings,
			[key]: option.value as ChartKey
		});
	};
	const onInputValueChanged = (key: keyof ChartSettings) => (value: string) => {
		setSettings({
			...settings,
			[key]: value
		});
	};
	const onIndicatorAddClicked = () => {
		setSettings({ ...settings, indicators: [ ...settings.indicators, {} ] });
	};
	const onIndicatorDropdownValueChanged = (indicator: ChartSettingsIndicator) => async (option: DropdownOption) => {
		const { topicName, column } = option as FactorOption;
		indicator.topicName = topicName;
		indicator.columnName = column.name;
		setSettings({ ...settings });
	};
	const onIndicatorRemove = (indicator: ChartSettingsIndicator) => () => {
		setSettings({ ...settings, dimensions: settings.indicators.filter(d => d !== indicator) });
	};
	const onDimensionAddClicked = () => {
		setSettings({ ...settings, dimensions: [ ...settings.dimensions, {} ] });
	};
	const onDimensionDropdownValueChanged = (dimension: ChartSettingsDimension) => async (option: DropdownOption) => {
		const { topicName, column } = option as FactorOption;
		dimension.topicName = topicName;
		dimension.columnName = column.name;
		setSettings({ ...settings });
	};
	const onDimensionRemove = (dimension: ChartSettingsDimension) => () => {
		setSettings({ ...settings, dimensions: settings.dimensions.filter(d => d !== dimension) });
	};

	const data: GuideData = guideContext.getData() || {};
	const factorOptions: Array<FactorOption> = Object.keys(data).map(topicName => {
		const topic: GuideTopic = data[topicName];
		return topic.columns.map(column => {
			return {
				label: `${topicName}.${column.label || column.name}`,
				value: `${topicName}.${column.name}`,
				topicName,
				topic,
				column
			};
		});
	}).flat().sort((a, b) => a.label.localeCompare(b.label));

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
				<SettingsLeading>
					<span>Identity</span>
				</SettingsLeading>
				<InputItem label='Title' value={settings.title} require={true}
				           onValueChanged={onInputValueChanged('title')}/>
				<DropdownItem label='Chart' value={settings.key}
				              require={true} please={'...'}
				              options={ChartDefOptions} onOptionChanged={onDropdownValueChanged('key')}/>
				<SettingsLeading>
					<span>Indicators</span>
					<Button onClick={onIndicatorAddClicked}><FontAwesomeIcon icon={faPlus}/></Button>
				</SettingsLeading>
				{settings.indicators.map((indicator, index, indicators) => {
					const { topicName = '', columnName = '' } = indicator;
					const value = (topicName && columnName) ? `${topicName}.${columnName}` : '';
					return <FactorDropdown key={index}
					                       label={index === 0 ? 'On' : 'And On'} value={value}
					                       require={index === 0} please={'...'}
					                       options={factorOptions}
					                       onOptionChanged={onIndicatorDropdownValueChanged(indicator)}
					                       removable={indicators.length !== 1}
					                       onRemove={onIndicatorRemove(indicator)}/>;
				})}
				<SettingsLeading>
					<span>Dimensions</span>
					<Button onClick={onDimensionAddClicked}><FontAwesomeIcon icon={faPlus}/></Button>
				</SettingsLeading>
				{settings.dimensions.map((dimension, index, dimensions) => {
					const { topicName = '', columnName = '' } = dimension;
					const value = (topicName && columnName) ? `${topicName}.${columnName}` : '';
					return <FactorDropdown key={index}
					                       label={index === 0 ? 'With' : 'And With'} value={value}
					                       require={index === 0} please={'...'}
					                       options={factorOptions}
					                       onOptionChanged={onDimensionDropdownValueChanged(dimension)}
					                       removable={dimensions.length !== 1}
					                       onRemove={onDimensionRemove(dimension)}/>;
				})}
				<SettingsLeading>
					<span>Save</span>
				</SettingsLeading>
				<InputItem label='As' value={settings.name} require={true}
				           onValueChanged={onInputValueChanged('name')}/>
			</SettingsContainer>
		</ChartBody>
	</Fragment>;
};