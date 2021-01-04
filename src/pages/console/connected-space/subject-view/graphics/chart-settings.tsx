import React from "react";
import styled from 'styled-components';
import { ChartDefinitions } from '../../../../../charts/custom/defs';
import { ChartKey } from '../../../../../charts/custom/types';
import { useForceUpdate } from '../../../../../common/utils';
import { ConsoleSpaceSubject, ConsoleSpaceSubjectChart } from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import Input from '../../../../component/input';

const ChartDefOptions = ChartDefinitions.map(def => ({ label: def.name, value: def.key }));

const SettingsContainer = styled.div`
	display: grid;
	position: absolute;
	grid-template-columns: minmax(150px, 35%) 1fr;
	grid-auto-rows: minmax(32px, auto);
	grid-column-gap: var(--margin);
	grid-row-gap: calc(var(--margin) / 4);
	align-content: start;
	padding: calc(var(--margin) / 2);
	width: 100%;
	overflow: hidden;
	transition: all 300ms ease-in-out;
	&[data-visible=false] {
		padding-top: 0;
		padding-bottom: 0;
		height: 0;
	}
	&[data-visible=true] {
		height: 100%;
	}
	&::-webkit-scrollbar {
		background-color: transparent;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: transparent;
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
	> input {
		font-size: 0.8em;
	}
	> div[data-widget=dropdown] {
		font-size: 0.8em;
		> div:last-child {
			&::-webkit-scrollbar {
				background-color: transparent;
				width: 4px;
			}
			&::-webkit-scrollbar-track {
				background-color: transparent;
				border-radius: 2px;
			}
			&::-webkit-scrollbar-thumb {
				background-color: var(--console-favorite-color);
				border-radius: 2px;
			}
		}
	}
`;
const Label = styled.div`
	display: flex;
	align-items: center;
	font-variant: petite-caps;
	font-weight: var(--font-demi-bold);
	font-size: 0.8em;
	height: 32px;
`;

export const ChartSettings = (props: {
	subject: ConsoleSpaceSubject;
	chart: ConsoleSpaceSubjectChart;
	visible: boolean;
}) => {
	const { chart, visible } = props;

	const forceUpdate = useForceUpdate();

	const onNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		chart.title = event.target.value;
		forceUpdate();
	};
	const onTypeChanged = async (option: DropdownOption) => {
		chart.key = option.value as ChartKey;
		forceUpdate();
	};

	return <SettingsContainer data-visible={visible}>
		<Label>Name:</Label>
		<Input value={chart.title || ''} onChange={onNameChanged}/>
		<Label>Type:</Label>
		<Dropdown options={ChartDefOptions} value={chart.key} onChange={onTypeChanged}/>
	</SettingsContainer>;
};