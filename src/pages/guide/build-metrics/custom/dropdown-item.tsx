import React from 'react';
import { ChartSettingItem, ChartSettingsItemEditor, ChartSettingsItemLabel } from '../../../component/chart';
import Dropdown, { DropdownOption } from '../../../component/dropdown';

export const DropdownItem = (props: {
	label: string,
	options: Array<DropdownOption>,
	please?: string,
	require?: boolean,
	value?: string | number | boolean,
	onOptionChanged: (options: DropdownOption) => Promise<void>
}) => {
	const { label, value, please, require, options, onOptionChanged } = props;

	return <ChartSettingItem>
		<ChartSettingsItemLabel data-require={require}>{label}</ChartSettingsItemLabel>
		<ChartSettingsItemEditor>
			<Dropdown options={options} onChange={onOptionChanged} value={value} please={please}/>
		</ChartSettingsItemEditor>
	</ChartSettingItem>;
};
