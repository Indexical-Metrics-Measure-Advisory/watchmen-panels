import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import Button from '../../../component/button';
import { ChartSettingsItem, ChartSettingsItemEditor, ChartSettingsItemLabel } from '../../../component/chart';
import { DropdownOption } from '../../../component/dropdown';
import { DropdownInCell } from './dropdown-in-cell';

const DropdownContainer = styled(ChartSettingsItem)`
	div[data-widget="dropdown"] {
		> span,
		> div > span {
			text-transform: capitalize;
		}
	}
`;

export const DropdownItem = (props: {
	label: string | ((props: any) => React.ReactNode) | React.ReactNode,
	options: Array<DropdownOption>,
	please?: string,
	require?: boolean,
	value?: string | number | boolean,
	onOptionChanged: (options: DropdownOption) => Promise<void>,
	removable?: boolean,
	onRemove?: () => void;
	className?: string;
}) => {
	const {
		label,
		value, please,
		require,
		options, onOptionChanged,
		removable = false, onRemove,
		className
	} = props;

	return <DropdownContainer className={className}>
		<ChartSettingsItemLabel data-require={require}>{label}</ChartSettingsItemLabel>
		<ChartSettingsItemEditor>
			<DropdownInCell options={options}
			                onChange={onOptionChanged}
			                value={value} please={please}/>
			{removable ? <Button onClick={onRemove}><FontAwesomeIcon icon={faTimes}/></Button> : null}
		</ChartSettingsItemEditor>
	</DropdownContainer>;
};
