import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { DomainChart, DomainChartGroupBy, DomainChartOptions } from '../../../services/types';
import {
	ChartHeader,
	ChartOperators,
	ChartSettingsItem,
	ChartSettingsItemEditor,
	ChartSettingsItemLabel,
	ChartTitle
} from '../../component/chart';
import Dropdown, { DropdownOption } from '../../component/dropdown';
import { useGuideContext } from '../guide-context';
import { DownloadButton } from './download-button';
import { HideOnPrintButton } from './hide-on-print-button';
import { ResizeButtons } from './resize-buttons';
import { SettingsButton } from './settings-button';
import { SettingsContainer } from './settings-container';

const ChartDisabledPlaceholder = styled.div.attrs({
	'data-widget': 'chart-disabled'
})`
	flex-grow: 1;
	height: 300px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	> svg {
		font-size: 64px;
		opacity: 0.2;
	}
	> div {
		font-size: 0.8em;
		opacity: 0.8;
	}
`;

const GroupBy = (props: {
	def?: Array<DomainChartGroupBy>,
	options: any,
	onChange: (options: any) => void
}) => {
	const { def, options, onChange } = props;

	if (!def) {
		return null;
	}

	const onGroupByChanged = (key: string) => async (option: DropdownOption) => {
		onChange({ ...options, [key]: option.value });
	};

	return <Fragment>
		{def.map(item => {
			const groupByOptions = item.options.map(option => {
				return {
					label: option.label,
					value: option.value
				};
			});
			return <ChartSettingsItem key={item.label}>
				<ChartSettingsItemLabel>{item.label}</ChartSettingsItemLabel>
				<ChartSettingsItemEditor>
					<Dropdown options={groupByOptions} onChange={onGroupByChanged(item.key)} value={options[item.key]}/>
				</ChartSettingsItemEditor>
			</ChartSettingsItem>;
		})}
	</Fragment>;
};

const buildChartOptions = (def?: DomainChartOptions) => {
	if (!def) {
		return {};
	}

	const options: { [key in string]: any } = {};
	// group by
	(def.groupBy || []).forEach(groupBy => {
		const key = groupBy.key;
		options[key] = groupBy.options.find(item => item.default)?.value;
	});

	return options;
};

export const PredefinedChartPanel = (props: { chart: DomainChart, rnd: boolean }) => {
	const { chart, rnd } = props;

	const guide = useGuideContext();
	const [ options, setOptions ] = useState(buildChartOptions(chart.options));

	const Chart = chart.chart;
	const data = guide.getData();
	const hasSettings = !!(chart.options && Object.keys(chart.options).length !== 0);
	const chartEnabled = chart.enabled ? chart.enabled(data) : { enabled: true, reason: null };

	return <Fragment>
		<ChartHeader>
			<ChartTitle>{chart.name}</ChartTitle>
			<ChartOperators>
				<HideOnPrintButton visible={rnd} title={chart.name}/>
				<DownloadButton visible={chartEnabled.enabled}/>
				<SettingsButton visible={hasSettings && chartEnabled.enabled}/>
				<ResizeButtons visible={chartEnabled.enabled}/>
			</ChartOperators>
		</ChartHeader>
		<SettingsContainer>
			<GroupBy def={chart.options?.groupBy} options={options} onChange={setOptions}/>
		</SettingsContainer>
		{chartEnabled.enabled
			? <Chart data={data || {}} options={options}/>
			: <ChartDisabledPlaceholder>
				<FontAwesomeIcon icon={faChartBar}/>
				<div>{chartEnabled.reason}</div>
			</ChartDisabledPlaceholder>
		}
	</Fragment>;
};