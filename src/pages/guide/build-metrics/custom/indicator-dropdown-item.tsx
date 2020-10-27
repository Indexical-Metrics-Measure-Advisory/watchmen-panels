import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { ChartSettingsIndicator, IndicatorAggregator } from '../../../../charts/custom/types';
import { DataColumnType } from '../../../../data/types';
import { DropdownOption } from '../../../component/dropdown';
import { DropdownItem } from './dropdown-item';
import { FactorOption } from './types';

const SubDropdownItem = styled(DropdownItem)`
	> div[data-widget='chart-settings-item-label'] {
		opacity: 0.7;
		transform: scale(0.8);
		transform-origin: left;
		> svg {
			margin-right: calc(var(--margin) / 4);
		}
	}
`;

export enum IndicatorInteractionType {
	CHANGE, REMOVE
}

export const IndicatorDropdown = (props: {
	label: string,
	options: Array<FactorOption>,
	please?: string,
	require?: boolean,
	indicator: ChartSettingsIndicator,
	removable?: boolean,
	onChanged: (indicator: ChartSettingsIndicator, interactionType: IndicatorInteractionType) => void,
	className?: string;
}) => {
	const { indicator, onChanged, ...dropdownOptions } = props;

	const { topicName = '', column: { name: columnName = '' } = { name: '' } } = indicator;
	const value = (topicName && columnName) ? `${topicName}.${columnName}` : '';

	const onFactorChanged = async (option: DropdownOption) => {
		const { topicName, column } = option as FactorOption;
		indicator.topicName = topicName;
		indicator.column = column;
		indicator.label = column.label || column.name;
		onChanged(indicator, IndicatorInteractionType.CHANGE);
	};
	const onRemove = () => {
		onChanged(indicator, IndicatorInteractionType.REMOVE);
	};

	let aggregatorDropdownItem = null;
	if (indicator.column) {
		const aggregateOptions: Array<DropdownOption> = [
			{ label: 'No Aggregate', value: IndicatorAggregator.NONE },
			{ label: 'Count', value: IndicatorAggregator.COUNT }
		];

		if (indicator.column) {
			const { type } = indicator.column;
			switch (true) {
				case DataColumnType.NUMERIC === type:
					aggregateOptions.push(
						{ label: 'Summary', value: IndicatorAggregator.SUMMARY },
						{ label: 'Average', value: IndicatorAggregator.AVERAGE },
						{ label: 'Median', value: IndicatorAggregator.MEDIAN },
						{ label: 'Minimum', value: IndicatorAggregator.MINIMUM },
						{ label: 'Maximum', value: IndicatorAggregator.MAXIMUM }
					);
					break;
				case [ DataColumnType.TIME, DataColumnType.DATETIME, DataColumnType.DATE ].includes(type):
					aggregateOptions.push(
						{ label: 'Minimum', value: IndicatorAggregator.MINIMUM },
						{ label: 'Maximum', value: IndicatorAggregator.MAXIMUM }
					);
					break;
				default:
				// no aggregator
			}
		}

		if (!aggregateOptions.some(option => option.value === indicator.aggregator)) {
			indicator.aggregator = IndicatorAggregator.NONE;
		}

		const onAggregatorChanged = async (option: DropdownOption) => {
			const { value } = option;
			indicator.aggregator = value as IndicatorAggregator;
			onChanged(indicator, IndicatorInteractionType.CHANGE);
		};

		aggregatorDropdownItem = <SubDropdownItem value={indicator.aggregator}
		                                          options={aggregateOptions} onOptionChanged={onAggregatorChanged}
		                                          label={
			                                          <Fragment>
				                                          <FontAwesomeIcon icon={faMinus}/>
				                                          <span>Aggregate</span>
			                                          </Fragment>
		                                          }/>;
	}

	return <Fragment>
		<DropdownItem {...dropdownOptions}
		              value={value}
		              onOptionChanged={onFactorChanged}
		              onRemove={onRemove}/>
		{aggregatorDropdownItem}
	</Fragment>;
};