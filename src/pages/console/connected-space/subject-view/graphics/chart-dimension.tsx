import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from "react";
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import {
	ConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDimension,
	ConsoleSpaceSubjectDataSetColumn
} from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { isDimensionCanRemove } from '../../../chart/chart-defender';
import { SettingsSegmentRowLabel } from './components';
import { transformColumnsToDropdownOptions, transformColumnToDropdownValue } from './utils';

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

export const ChartDimension = (props: {
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
		const column: ConsoleSpaceSubjectDataSetColumn = (option as any).column;
		dimension.topicId = column.topicId;
		dimension.factorId = column.factorId;
		dimension.operator = column.operator;
		dimension.secondaryTopicId = column.secondaryTopicId;
		dimension.secondaryFactorId = column.secondaryFactorId;
		dimension.alias = column.alias;
		forceUpdate();
	};
	const onDimensionRemoveClicked = () => onRemove(dimension);

	const index = dimensions.indexOf(dimension);
	const options = transformColumnsToDropdownOptions(space, columns);
	const canRemove = isDimensionCanRemove(chart);
	const value = transformColumnToDropdownValue(dimension);

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