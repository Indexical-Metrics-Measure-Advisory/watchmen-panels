import React, { Fragment } from 'react';
import styled from 'styled-components';
import { BaseColors24, DarkenColors24, LightColors24, LighterColors24 } from '../../../../../charts/color-theme';
import { useForceUpdate } from '../../../../../common/utils';
import { ConsoleSpaceSubjectChart } from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { SettingsSegmentRowLabel } from './components';

enum Colors {
	STANDARD = 'standard',
	DARK = 'dark',
	LIGHT = 'light',
	LIGHTER = 'lighter'
}

const ColorsMap: { [key in Colors]: Array<string> } = {
	[Colors.STANDARD]: BaseColors24,
	[Colors.DARK]: DarkenColors24,
	[Colors.LIGHT]: LightColors24,
	[Colors.LIGHTER]: LighterColors24
};

const ColorsDropdown = styled(Dropdown)`
	overflow: hidden;
	> span {
		margin-right: 4px;
		border-top-right-radius: 2px;
		border-bottom-right-radius: 2px;
	}
`;
const ColorLabelContainer = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	> span {
		margin-right: var(--margin);
		text-transform: capitalize;
	}
	> div {
		display: flex;
		flex-grow: 1;
		align-items: center;
		justify-content: flex-end;
		> span {
			display: block;
			width: 16px;
			height: 16px;
			&:first-child {
				border-top-left-radius: 2px;
				border-bottom-left-radius: 2px;
			}
			&:last-child {
				border-top-right-radius: 2px;
				border-bottom-right-radius: 2px;
			}
		}
	}
`;

const ColorLabel = (props: { type: Colors }) => {
	const { type } = props;

	return <ColorLabelContainer>
		<span>{type}</span>
		<div>
			{ColorsMap[type].map((color, index) => {
				return <span style={{ backgroundColor: color }} key={`${color}-${index}`}/>;
			})}
		</div>
	</ColorLabelContainer>;
};

export const ChartColors = (props: {
	chart: ConsoleSpaceSubjectChart;
}) => {
	const { chart } = props;

	const forceUpdate = useForceUpdate();

	const onColorsChange = async (option: DropdownOption) => {
		chart.colors = option.value as string;
		forceUpdate();
	};

	const colors = [
		...Object.keys(ColorsMap).map(type => ({ value: type, label: <ColorLabel type={type as Colors}/> })),
		{ value: 'custom', label: 'Custom Series' }
	];
	let selectedColor;
	if (chart.colors && typeof chart.colors === 'string') {
		selectedColor = chart.colors;
	} else if (Array.isArray(chart.colors)) {
		selectedColor = 'custom';
	} else {
		selectedColor = Colors.STANDARD;
	}

	return <Fragment>
		<SettingsSegmentRowLabel>Color Series:</SettingsSegmentRowLabel>
		<ColorsDropdown value={selectedColor} options={colors} onChange={onColorsChange}/>
	</Fragment>;
};