import React from 'react';
import { ChartSettingsDimension } from '../../../../charts/custom/types';
import { DropdownOption } from '../../../component/dropdown';
import { DropdownItem } from './dropdown-item';
import { FactorOption } from './types';

export enum DimensionInteractionType {
	CHANGE, REMOVE
}

export const DimensionDropdown = (props: {
	label: string,
	options: Array<FactorOption>,
	please?: string,
	require?: boolean,
	dimension: ChartSettingsDimension,
	removable?: boolean,
	onChanged: (dimension: ChartSettingsDimension, interactionType: DimensionInteractionType) => void,
	className?: string;
}) => {
	const { dimension, onChanged, ...dropdownOptions } = props;

	const { topicName = '', column: { name: columnName = '' } = { name: '' } } = dimension;
	const value = (topicName && columnName) ? `${topicName}.${columnName}` : '';

	const onFactorChanged = async (option: DropdownOption) => {
		const { topicName, column } = option as FactorOption;
		dimension.topicName = topicName;
		dimension.column = column;
		dimension.label = column.label || column.name;
		onChanged(dimension, DimensionInteractionType.CHANGE);
	};
	const onRemove = () => {
		onChanged(dimension, DimensionInteractionType.REMOVE);
	};
	return <DropdownItem {...dropdownOptions}
	                     value={value}
	                     onOptionChanged={onFactorChanged}
	                     onRemove={onRemove}/>;
};