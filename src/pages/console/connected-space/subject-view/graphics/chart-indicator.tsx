import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from "react";
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import {
	ConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartIndicator,
	ConsoleSpaceSubjectChartIndicatorAggregator,
	ConsoleSpaceSubjectDataSetColumn,
	ConsoleTopicFactorType
} from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { isIndicatorCanRemove } from '../../../chart/chart-defender';
import { SettingsSegmentRowLabel } from './components';
import { transformColumnsToDropdownOptions, transformColumnToDropdownValue } from './utils';

const IndicatorEditor = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	&[data-can-remove=true] {
		> div:first-child {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		> div:nth-child(2) {
			border-right: 0;
			border-radius: 0;
		}
		> button {
			border: var(--border);
			border-top-right-radius: var(--border-radius);
			border-bottom-right-radius: var(--border-radius);
			border-left-color: transparent;
			&:before {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
			> svg {
				opacity: 0;
			}
		}
	}
	&:hover > button,
	> div:first-child:focus-within ~ button,
	> div:nth-child(2):focus-within + button {
		border-left-color: var(--border-color);
		> svg {
			opacity: 1;
		}
	}
	&:hover > div:nth-child(2),
	> div:first-child:focus-within + div,
	> div:nth-child(2):focus-within {
		border-left-color: var(--border-color);
	}
	> div:first-child {
		flex-grow: 1;
		border-right: 0;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 0;
	}
	> div:nth-child(2) {
		flex-grow: 0;
		width: 0;
		min-width: 100px;
		border-left-color: transparent;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		margin-left: -1px;
	}
	> button {
		align-self: stretch;
		min-width: 32px;
		font-size: 0.8em;
		margin-left: -1px;
		> svg {
			transform: scale(0.9);
			transition: all 300ms ease-in-out;
		}
	}
`;

export const ChartIndicator = (props: {
	space: ConsoleSpace;
	subject: ConsoleSpaceSubject;
	chart: ConsoleSpaceSubjectChart;
	indicator: ConsoleSpaceSubjectChartIndicator;
	onRemove: (indicator: ConsoleSpaceSubjectChartIndicator) => void;
}) => {
	const { space, subject, chart, indicator, onRemove } = props;
	const { dataset: { columns = [] } = {} } = subject;
	const { indicators } = chart;

	const forceUpdate = useForceUpdate();

	const onChange = async (option: DropdownOption) => {
		const column: ConsoleSpaceSubjectDataSetColumn = (option as any).column;
		indicator.topicId = column.topicId;
		indicator.factorId = column.factorId;
		indicator.operator = column.operator;
		indicator.secondaryTopicId = column.secondaryTopicId;
		indicator.secondaryFactorId = column.secondaryFactorId;
		indicator.alias = column.alias;
		forceUpdate();
	};
	const onAggregatorChange = async (option: DropdownOption) => {
		indicator.aggregator = option.value as ConsoleSpaceSubjectChartIndicatorAggregator;
		forceUpdate();
	};
	const onIndicatorRemoveClicked = () => onRemove(indicator);

	const index = indicators.indexOf(indicator);
	const options = transformColumnsToDropdownOptions(space, columns);
	const canRemove = isIndicatorCanRemove(chart);
	const value = transformColumnToDropdownValue(indicator);
	const aggregateOptions: Array<DropdownOption> = [
		{ label: 'As Is', value: ConsoleSpaceSubjectChartIndicatorAggregator.NONE },
		{ label: 'Count', value: ConsoleSpaceSubjectChartIndicatorAggregator.COUNT }
	];

	if (!!indicator.topicId && !!indicator.factorId) {
		// eslint-disable-next-line
		const topic = space.topics.find(topic => topic.topicId == indicator.topicId);
		// eslint-disable-next-line
		const factor = topic?.factors.find(factor => factor.factorId == indicator.factorId);
		switch (true) {
			case !factor:
				break;
			case factor!.type === ConsoleTopicFactorType.NUMBER:
				aggregateOptions.push(
					{ label: 'Summary', value: ConsoleSpaceSubjectChartIndicatorAggregator.SUMMARY },
					{ label: 'Average', value: ConsoleSpaceSubjectChartIndicatorAggregator.AVERAGE },
					{ label: 'Median', value: ConsoleSpaceSubjectChartIndicatorAggregator.MEDIAN },
					{ label: 'Minimum', value: ConsoleSpaceSubjectChartIndicatorAggregator.MINIMUM },
					{ label: 'Maximum', value: ConsoleSpaceSubjectChartIndicatorAggregator.MAXIMUM }
				);
				break;
			case factor!.type === ConsoleTopicFactorType.DATETIME:
				aggregateOptions.push(
					{ label: 'Minimum', value: ConsoleSpaceSubjectChartIndicatorAggregator.MINIMUM },
					{ label: 'Maximum', value: ConsoleSpaceSubjectChartIndicatorAggregator.MAXIMUM }
				);
				break;
			default:
			// no aggregator
		}
	}

	if (!aggregateOptions.some(option => option.value === indicator.aggregator)) {
		indicator.aggregator = ConsoleSpaceSubjectChartIndicatorAggregator.NONE;
	}
	const { aggregator } = indicator;

	return <Fragment>
		<SettingsSegmentRowLabel>{index === 0 ? 'With:' : 'And With:'}</SettingsSegmentRowLabel>
		<IndicatorEditor data-can-remove={canRemove}>
			<Dropdown value={value} options={options} onChange={onChange}/>
			<Dropdown value={aggregator} options={aggregateOptions} onChange={onAggregatorChange}/>
			{canRemove
				? <LinkButton onClick={onIndicatorRemoveClicked}>
					<FontAwesomeIcon icon={faTimes}/>
				</LinkButton>
				: null}
		</IndicatorEditor>
	</Fragment>;
};