import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import Button from '../../../component/button';
import { ChartSettingItem, ChartSettingsItemEditor, ChartSettingsItemLabel } from '../../../component/chart';
import Dropdown, { DropdownOption } from '../../../component/dropdown';

const DropdownInCell = styled(Dropdown)`
	transition: all 300ms ease-in-out;
	width: 100%;
	&:hover,
	&:focus {
		border-color: var(--primary-color);
		> svg {
			color: var(--primary-color);
		}
		> div:last-child {
			border-color: var(--primary-color);
		}
	}
`;

export const DropdownItem = (props: {
	label: string,
	options: Array<DropdownOption>,
	please?: string,
	require?: boolean,
	value?: string | number | boolean,
	onOptionChanged: (options: DropdownOption) => Promise<void>,
	removable?: boolean,
	onRemove?: () => void;
	className?: string;
}) => {
	const { label, value, please, require, options, onOptionChanged, removable = false, onRemove, className } = props;

	return <ChartSettingItem className={className}>
		<ChartSettingsItemLabel data-require={require}>{label}</ChartSettingsItemLabel>
		<ChartSettingsItemEditor>
			<DropdownInCell options={options} onChange={onOptionChanged} value={value} please={please}/>
			{removable ? <Button onClick={onRemove}><FontAwesomeIcon icon={faTimes}/></Button> : null}
		</ChartSettingsItemEditor>
	</ChartSettingItem>;
};
