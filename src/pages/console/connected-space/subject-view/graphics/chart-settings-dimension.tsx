import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from "react";
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import {
	ConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDimension
} from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { isDimensionCanRemove } from './chart-defender';
import { SettingsSegmentRowLabel } from './components';

const DimensionEditor = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	&[data-can-remove=true] {
		> div:first-child {
			border-right: 0;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
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
	> div:first-child:focus-within + button {
		border-left-color: var(--border-color);
		> svg {
			opacity: 1;
		}
	}
	> div:first-child {
		flex-grow: 1;
		width: 0;
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

export const ChartSettingsDimension = (props: {
	space: ConsoleSpace;
	subject: ConsoleSpaceSubject;
	chart: ConsoleSpaceSubjectChart;
	dimension: ConsoleSpaceSubjectChartDimension;
	onRemove: (dimension: ConsoleSpaceSubjectChartDimension) => void;
}) => {
	const { space, subject, chart, dimension, onRemove } = props;
	const { dataset: { columns = [] } = {} } = subject;
	const { dimensions } = chart;

	const forceUpdate = useForceUpdate();

	const onChange = async (option: DropdownOption) => {
		const value = option.value as string;
		const [ topicId, factorId ] = value.split('-');
		dimension.topicId = topicId;
		dimension.factorId = factorId;
		forceUpdate();
	};
	const onDimensionRemoveClicked = () => onRemove(dimension);

	const index = dimensions.indexOf(dimension);
	const options = columns.map(column => {
		// eslint-disable-next-line
		const topic = space.topics.find(topic => topic.topicId == column.topicId);
		if (!topic) {
			return null;
		}
		// eslint-disable-next-line
		const factor = topic.factors.find(factor => factor.factorId == column.factorId);
		if (!factor) {
			return null;
		}
		return { label: factor.label || factor.name, value: `${topic.topicId}-${factor.factorId}` };
	}).filter(x => x != null) as Array<DropdownOption>;
	const canRemove = isDimensionCanRemove(chart);
	const value = `${dimension.topicId}-${dimension.factorId}`;

	return <Fragment>
		<SettingsSegmentRowLabel>{index === 0 ? 'On:' : 'And On:'}</SettingsSegmentRowLabel>
		<DimensionEditor data-can-remove={canRemove}>
			<Dropdown value={value} options={options} onChange={onChange}/>
			{canRemove
				? <LinkButton onClick={onDimensionRemoveClicked}>
					<FontAwesomeIcon icon={faTimes}/>
				</LinkButton>
				: null}
		</DimensionEditor>
	</Fragment>;
};