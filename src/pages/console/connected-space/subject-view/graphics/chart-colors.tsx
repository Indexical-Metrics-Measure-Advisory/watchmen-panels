import React, { Fragment, useRef, useState } from 'react';
import styled from 'styled-components';
import { BaseColors24, DarkenColors24, LightColors24, LighterColors24 } from '../../../../../charts/color-theme';
import { useCollapseFixedThing, useForceUpdate } from '../../../../../common/utils';
import { ConsoleSpaceSubjectChart } from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { SettingsSegmentRowLabel } from './components';

const PICKER_HEIGHT = 200;

interface PickerState {
	top: number;
	left: number;
	width: number;
	visible: boolean;
	color?: string;
	colorIndex?: number;
}

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
const CUSTOM_COLORS = 'custom';

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
const CustomColors = styled.div`
	grid-column: span 2;
	display: grid;
	grid-template-columns: repeat(24, minmax(20px, 1fr));
	align-self: center;
	height: 28px;
	transition: all 300ms ease-in-out;
	&[data-visible=false] {
		opacity: 0;
		pointer-events: none;
	}
`;
const CustomColor = styled.span.attrs<{ color?: string }>(({ color }) => {
	return {
		style: {
			backgroundColor: color || 'transparent',
			borderColor: color || 'var(--border-color)'
		}
	};
})<{ color?: string }>`
	display: block;
	align-self: center;
	justify-self: end;
	width: 16px;
	height: 16px;
	border: var(--border);
	border-radius: var(--border-radius);
	cursor: pointer;
	&:hover {
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.7);
	}
`;
const ColorPicker = styled.div.attrs<PickerState>(({ top, left, width, visible }) => {
	return {
		style: {
			top, left, width,
			opacity: visible ? 1 : 0,
			pointerEvents: visible ? 'auto' : 'none'
		}
	};
})<PickerState>`
	display: grid;
	grid-template-columns: 50% 1fr;
	grid-column-gap: var(--margin);
	position: fixed;
	background-color: var(--bg-color);
	border: var(--border);
	border-radius: var(--border-radius);
	padding: calc(var(--margin) / 4);
	height: ${PICKER_HEIGHT}px;
	z-index: 100;
	transition: opacity 300ms ease-in-out;
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

	const customColorsRef = useRef<HTMLDivElement>(null);
	const pickerRef = useRef<HTMLDivElement>(null);
	const [ pickerState, setPickerState ] = useState<PickerState>({ top: 0, left: 0, width: 0, visible: false });
	const forceUpdate = useForceUpdate();
	useCollapseFixedThing(pickerRef, () => setPickerState({ ...pickerState, visible: false }));

	const onColorsChange = async (option: DropdownOption) => {
		if (option.value === CUSTOM_COLORS) {
			chart.colors = [ '#ff0000', '#00ff00', '#0000ff' ];
		} else {
			chart.colors = option.value as string;
		}
		forceUpdate();
	};
	const onColorClicked = (index: number) => (event: React.MouseEvent<HTMLSpanElement>) => {
		const { top } = (event.target as HTMLSpanElement).getBoundingClientRect();
		const { left: containerLeft, width } = customColorsRef.current!.getBoundingClientRect();
		const { left: firstLeft } = (customColorsRef.current!.querySelector('span:first-child'))!.getBoundingClientRect();
		console.log((chart.colors || [])[index]);
		setPickerState({
			top: top - PICKER_HEIGHT - 6,
			left: firstLeft,
			width: width - (firstLeft - containerLeft),
			visible: true,
			color: (chart.colors || [])[index],
			colorIndex: index
		});
	};

	const colors = [
		...Object.keys(ColorsMap).map(type => ({ value: type, label: <ColorLabel type={type as Colors}/> }))
		// { value: CUSTOM_COLORS, label: 'Custom Series' }
	];
	let selectedColor;
	if (chart.colors && typeof chart.colors === 'string') {
		selectedColor = chart.colors;
	} else if (Array.isArray(chart.colors)) {
		selectedColor = CUSTOM_COLORS;
	} else {
		selectedColor = Colors.STANDARD;
	}

	return <Fragment>
		<SettingsSegmentRowLabel>Color Series:</SettingsSegmentRowLabel>
		<ColorsDropdown value={selectedColor} options={colors} onChange={onColorsChange}/>
		<CustomColors data-visible={Array.isArray(chart.colors)} ref={customColorsRef}>
			{new Array(24).fill(1).map((x, index) => {
				return <CustomColor key={index} color={(chart.colors || [])[index]}
				                    onClick={onColorClicked(index)}/>;
			})}
			<ColorPicker {...pickerState} ref={pickerRef}>
			</ColorPicker>
		</CustomColors>
	</Fragment>;
};