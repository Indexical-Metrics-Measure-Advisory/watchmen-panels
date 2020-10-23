import React from 'react';
import styled from 'styled-components';
import { ChartSettingItem, ChartSettingsItemEditor, ChartSettingsItemLabel } from '../../../component/chart';
import Input from '../../../component/input';

const InputInCell = styled(Input)`
	transition: all 300ms ease-in-out;
	width: 100%;
	&:hover,
	&:focus {
		border-color: var(--primary-color);
	}
`;

export const InputItem = (props: {
	label: string,
	placeholder?: string,
	require?: boolean,
	value?: string,
	onValueChanged: (value: string) => void
}) => {
	const { label, value, placeholder, require, onValueChanged } = props;

	const onChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		onValueChanged((event.target as HTMLInputElement).value);
	};

	return <ChartSettingItem>
		<ChartSettingsItemLabel data-require={require}>{label}</ChartSettingsItemLabel>
		<ChartSettingsItemEditor>
			<InputInCell onChange={onChanged} value={value} placeholder={placeholder}/>
		</ChartSettingsItemEditor>
	</ChartSettingItem>;
};
