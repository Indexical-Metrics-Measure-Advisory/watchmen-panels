import { faChartArea, faChartBar, faChartLine, faChartPie, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { DarkenColors24 } from '../../../charts/color-theme';
import { CustomChart } from '../../../charts/custom-chart';
import { ChartDefinitions } from '../../../charts/custom/defs';
import { isSettingsValid } from '../../../charts/custom/settings';
import {
	ChartKey,
	ChartSettings,
	ChartSettingsDimension,
	ChartSettingsIndicator,
	IndicatorAggregator
} from '../../../charts/custom/types';
import { DataSet, DataTopic } from '../../../data/types';
import Button from '../../component/button';
import { ChartHeader, ChartOperators, ChartTitle } from '../../component/chart';
import { DropdownOption } from '../../component/dropdown';
import { useGuideContext } from '../guide-context';
import { useChartContext } from './chart-context';
import { DimensionDropdown, DimensionInteractionType } from './custom/dimension-dropdown-item';
import { DropdownItem } from './custom/dropdown-item';
import { IndicatorDropdown, IndicatorInteractionType } from './custom/indicator-dropdown-item';
import { InputItem } from './custom/input-item';
import { FactorOption } from './custom/types';
import { DownloadButton } from './download-button';
import { HideOnPrintButton } from './hide-on-print-button';
import { ResizeButtons } from './resize-buttons';
import { SaveButton } from './save-button';
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
			grid-template-columns: 1fr;
			background-color: var(--bg-color-opacity7);
			> div:last-child {
				margin-bottom: calc(var(--margin) / 2);
			}
		}
		> div[data-widget='chart'] + div[data-widget='chart-settings'] {
			background-color: var(--bg-color-opacity);
		}
	}
	&[data-settings-active=true][data-expanded=false] {
		> div[data-widget='chart'] {
			flex-grow: 1;
		}
	}
	&[data-settings-active=true][data-expanded=true] {
		> div[data-widget='chart'],
		> div[data-widget='chart-disabled'] {
			width: 50%;
		}
		> div[data-widget='chart-settings'] {
			position: relative;
			top: unset;
			left: unset;
			width: 50%;
			height: unset;
			border-top: 0;
			border-left: var(--border);
			z-index: unset;
			background-color: var(--bg-color);
		}
	}
	&[data-settings-active=false] {
		> div[data-widget='chart'],
		> div[data-widget='chart-disabled'] {
			width: 100%
		}
	}
	&[data-settings-active=false][data-expanded=true] {
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
	&[data-visible=false] {
		width: 0;
	}
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

const ChartDefOptions = ChartDefinitions.map(def => ({ label: def.name, value: def.key }));

export const CustomChartPanel = (props: {
	settings: ChartSettings,
	onSettingsChanged: (settings: ChartSettings) => void,
	canSave?: boolean,
	rnd: boolean
}) => {
	const { settings, onSettingsChanged, canSave = false, rnd } = props;

	const chartContext = useChartContext();
	const settingsContext = useChartSettingsContext();
	const guideContext = useGuideContext();

	const onDropdownValueChanged = (key: keyof ChartSettings) => async (option: DropdownOption) => {
		onSettingsChanged({ ...settings, [key]: option.value as ChartKey });
	};
	const onInputValueChanged = (key: keyof ChartSettings) => (value: string) => {
		onSettingsChanged({ ...settings, [key]: value });
	};
	// indicator
	const onIndicatorAddClicked = () => onSettingsChanged({
		...settings,
		indicators: [ ...settings.indicators, { aggregator: IndicatorAggregator.NONE } ]
	});
	const onIndicatorChanged = (indicator: ChartSettingsIndicator, interactionType: IndicatorInteractionType) => {
		if (interactionType === IndicatorInteractionType.REMOVE) {
			onSettingsChanged({ ...settings, indicators: settings.indicators.filter(item => item !== indicator) });
		} else if (interactionType === IndicatorInteractionType.CHANGE) {
			onSettingsChanged({ ...settings });
		}
	};
	const onDimensionAddClicked = () => onSettingsChanged({ ...settings, dimensions: [ ...settings.dimensions, {} ] });
	const onDimensionChanged = (dimension: ChartSettingsDimension, interactionType: DimensionInteractionType) => {
		if (interactionType === DimensionInteractionType.REMOVE) {
			onSettingsChanged({ ...settings, dimensions: settings.dimensions.filter(item => item !== dimension) });
		} else if (interactionType === DimensionInteractionType.CHANGE) {
			onSettingsChanged({ ...settings });
		}
	};

	const data: DataSet = guideContext.getData() || {};
	const factorOptions: Array<FactorOption> = Object.keys(data).map(topicName => {
		const topic: DataTopic = data[topicName];
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

	const { valid: settingsValid, advises: invalidAdvises } = isSettingsValid(settings);

	const title = settings.title || 'Chart on You';

	// TODO chart special settings, such as stack for bar/line, symbol size for scatter, etc.
	return <Fragment>
		<ChartHeader>
			<ChartTitle>{title}</ChartTitle>
			<ChartOperators>
				<HideOnPrintButton visible={rnd} title={title}/>
				<SaveButton visible={canSave && !!settings.key && settingsValid} settings={settings}/>
				<DownloadButton visible={!!settings.key && settingsValid}/>
				<SettingsButton visible={true}/>
				<ResizeButtons/>
			</ChartOperators>
		</ChartHeader>
		<ChartBody data-expanded={chartContext.expanded} data-settings-active={settingsContext.active}>
			{!settings.key
				? null
				: (invalidAdvises.length !== 0
					? <ChartErrorReminder>
						{invalidAdvises.map(advise => {
							return <div key={advise}>{advise}</div>;
						})}
					</ChartErrorReminder>
					: <CustomChart data={data} settings={settings} errorWrapper={ChartErrorReminder}/>)
			}
			{settings.key
				? null
				: <ChartDisabledPlaceholder>
					<FontAwesomeIcon icon={faChartBar}/>
					<FontAwesomeIcon icon={faChartPie}/>
					<FontAwesomeIcon icon={faChartArea}/>
					<FontAwesomeIcon icon={faChartLine}/>
				</ChartDisabledPlaceholder>
			}
			<SettingsContainer>
				<SettingsLeading>
					<span>Identity</span>
				</SettingsLeading>
				<InputItem label='NarrowPageTitle' value={settings.title} require={true}
				           onValueChanged={onInputValueChanged('title')}/>
				<DropdownItem label='Chart' value={settings.key}
				              require={true} please={'...'}
				              options={ChartDefOptions} onOptionChanged={onDropdownValueChanged('key')}/>
				<SettingsLeading>
					<span>Dimensions</span>
					<Button onClick={onDimensionAddClicked}><FontAwesomeIcon icon={faPlus}/></Button>
				</SettingsLeading>
				{settings.dimensions.map((dimension, index, dimensions) => {
					return <DimensionDropdown key={index}
					                          label={index === 0 ? 'On' : 'And On'}
					                          dimension={dimension}
					                          require={index === 0} please={'...'}
					                          options={factorOptions}
					                          removable={dimensions.length !== 1}
					                          onChanged={onDimensionChanged}/>;
				})}
				<SettingsLeading>
					<span>Indicators</span>
					<Button onClick={onIndicatorAddClicked}><FontAwesomeIcon icon={faPlus}/></Button>
				</SettingsLeading>
				{settings.indicators.map((indicator, index, indicators) => {
					return <IndicatorDropdown key={index}
					                          label={index === 0 ? 'With' : 'And With'}
					                          indicator={indicator}
					                          require={index === 0} please={'...'}
					                          options={factorOptions}
					                          removable={indicators.length !== 1}
					                          onChanged={onIndicatorChanged}/>;
				})}
			</SettingsContainer>
		</ChartBody>
	</Fragment>;
};

export const AutonomousCustomChartPanel = (props: { rnd: boolean }) => {
	const { rnd } = props;
	const [ settings, setSettings ] = useState<ChartSettings>({
		dimensions: [ {} ],
		indicators: [ { aggregator: IndicatorAggregator.NONE } ]
	});

	const onSettingsChanged = (settings: ChartSettings) => setSettings(settings);

	return <CustomChartPanel settings={settings} onSettingsChanged={onSettingsChanged}
	                         canSave={true} rnd={rnd}/>;
};
