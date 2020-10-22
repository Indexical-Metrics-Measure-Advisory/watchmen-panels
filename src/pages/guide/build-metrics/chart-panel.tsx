import { faCog, faCompressArrowsAlt, faDownload, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { DomainChart, DomainChartGroupBy, DomainChartOptions } from '../../../services/types';
import Button from '../../component/button';
import Dropdown, { DropdownOption } from '../../component/dropdown';
import { useGuideContext } from '../guide-context';

const ChartContainer = styled.div`
	border-radius: calc(var(--border-radius) * 2);
	border: var(--border);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	position: relative;
	> div[data-widget="chart"] {
		flex-grow: 1;
		height: 300px;
	}

	&[data-expanded=true] {
		@media (min-width: 800px) {
			grid-column: span 3;
			> div[data-widget="chart"] {
				height: 500px;
			}
		}
		@media (min-width: 1600px) {
			grid-column: span 4;
			> div[data-widget="chart"] {
				height: 650px;
			}
		}
		div[data-widget="chart-title"] {
			font-size: 1.4em;
		}
	}
`;
const ChartHeader = styled.div`
	display: flex;
	padding: 0 calc(var(--margin) / 2);
	align-items: center;
	justify-content: space-between;
	height: 40px;
`;
const ChartTitle = styled.div.attrs({
	'data-widget': 'chart-title'
})`
	font-size: 1em;
	font-weight: bold;
	white-space: nowrap;
	overflow-x: hidden;
	text-overflow: ellipsis;
	transition: all 300ms ease-in-out;
`;
const ChartOperators = styled.div`
	display: flex;
	align-items: center;
	> button {
		display: block;
		border: 0;
		width: 28px;
		height: 28px;
		padding: 0;
		transition: all 300ms ease-in-out;
		&:not(:first-child) {
			margin-left: 2px;
		}
		&:hover {
			background-color: var(--primary-hover-color);
			color: var(--invert-color);
			opacity: 1;
		}
		&[data-visible=false] {
			display: none;
		}
		&[data-active=true] {
			background-color: var(--primary-color);
			color: var(--invert-color);
			opacity: 1;
		}
		@media (max-width: 799px) {
			&[data-size-fixed-visible=false] {
				display: none;
			}
		}
	}
`;
const ChartSettings = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-column-gap: calc(var(--margin) / 2);
	grid-row-gap: calc(var(--margin) / 2);
	align-items: baseline;
	position: absolute;
	top: 40px;
	left: 0;
	width: 100%;
	height: 0;
	padding: 0 var(--margin);
	transition: all 300ms ease-in-out;
	background-color: var(--bg-color-opacity);
	z-index: 1;
	overflow: hidden;
	&[data-visible=true] {
		height: calc(100% - 40px);
		border-top: var(--border);
		overflow-x: auto;
		padding-top: calc(var(--margin) / 2);
		padding-bottom: calc(var(--margin) / 2);
	}
	&[data-columns="2"] {
		grid-template-columns: 1fr 1fr;
	}
`;
const ChartSettingItem = styled.div`
	display: grid;
	grid-template-columns: 40% 60%;
	align-items: center;
`;
const ChartSettingsItemLabel = styled.div`
	display: flex;
	align-items: center;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	font-size: 0.8em;
	font-weight: var(--font-bold);
`;
const ChartSettingsItemEditor = styled.div`
	display: flex;
	align-items: center;
	> input,
	> div[data-widget=dropdown] {
		font-size: 0.8em;
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
			return <ChartSettingItem key={item.label}>
				<ChartSettingsItemLabel>{item.label}</ChartSettingsItemLabel>
				<ChartSettingsItemEditor>
					<Dropdown options={groupByOptions} onChange={onGroupByChanged(item.key)} value={options[item.key]}/>
				</ChartSettingsItemEditor>
			</ChartSettingItem>;
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

export const ChartPanel = (props: { chart: DomainChart }) => {
	const { chart } = props;

	const guide = useGuideContext();
	const [ expanded, setExpanded ] = useState<boolean>(false);
	const [ settingsVisible, setSettingsVisible ] = useState<boolean>(false);
	const [ options, setOptions ] = useState(buildChartOptions(chart.options));
	const [ settingsColumns, setSettingsColumns ] = useState(1);
	const settingsRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!settingsRef.current) {
			return;
		}

		// @ts-ignore
		const resizeObserver = new ResizeObserver(() => {
			if (!settingsRef.current) {
				return;
			}

			const rect = settingsRef.current.getBoundingClientRect();
			setSettingsColumns(rect.width > 600 ? 2 : 1);
		});
		resizeObserver.observe(settingsRef.current);
		return () => resizeObserver.disconnect();
	});

	const onDownloadClicked = () => {
	};
	const onSettingsToggleClicked = () => setSettingsVisible(!settingsVisible);
	const onChartExpandClicked = () => setExpanded(true);
	const onChartCollapseClicked = () => setExpanded(false);

	const Chart = chart.chart;
	const hasSettings = !!chart.options?.groupBy;

	return <ChartContainer data-expanded={expanded}>
		<ChartHeader>
			<ChartTitle>{chart.name}</ChartTitle>
			<ChartOperators>
				<Button onClick={onDownloadClicked}>
					<FontAwesomeIcon icon={faDownload}/>
				</Button>
				<Button onClick={onSettingsToggleClicked} data-visible={hasSettings} data-active={settingsVisible}>
					<FontAwesomeIcon icon={faCog}/>
				</Button>
				<Button onClick={onChartExpandClicked} data-visible={!expanded}
				        data-size-fixed-visible={false}>
					<FontAwesomeIcon icon={faExpandArrowsAlt}/>
				</Button>
				<Button onClick={onChartCollapseClicked} data-visible={expanded}
				        data-size-fixed-visible={false}>
					<FontAwesomeIcon icon={faCompressArrowsAlt}/>
				</Button>
			</ChartOperators>
		</ChartHeader>
		<ChartSettings data-visible={settingsVisible} data-columns={settingsColumns}
		               ref={settingsRef}>
			<GroupBy def={chart.options?.groupBy} options={options} onChange={setOptions}/>
		</ChartSettings>
		<Chart data={guide.getData()!.tasks.data} options={options}/>
	</ChartContainer>;
};