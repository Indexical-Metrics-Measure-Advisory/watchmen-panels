import React, { useReducer } from 'react';
import styled from 'styled-components';
import {
	ConsoleSpaceSubjectDataSetFilter,
	ConsoleSpaceSubjectDataSetFilterJoint,
	FilterJointType
} from '../../../../../services/console/types';
import { FilterExpression } from './filter-expression';
import { isExpressionFilter, isJointFilter } from './utils';

const JointRow = styled.div.attrs(() => {
	return {
		'data-widget': 'console-subject-filter-joint'
	};
})`
	display: flex;
	&[data-level='0']:last-child {
		margin-bottom: calc(var(--margin) / 4);
	}
`;
const Joint = styled.div.attrs({
	'data-widget': 'console-subject-filter-joint'
})`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	font-size: 0.8em;
	width: 24px;
	margin-left: calc(var(--margin) / 2);
	margin-top: calc(var(--margin) / 4);
	&[data-filters-count='1'] {
		&:before {
			display: none;
		}
	}
	&:before {
		content: '';
		display: block;
		position: absolute;
		left: calc(50% - 1px);
		top: 16px;
		width: 16px;
		height: calc(100% - 32px);
		border: var(--border);
		border-width: 2px;
		border-right: 0;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
		z-index: 0;
	}
	> span {
		display: block;
		font-family: var(--console-title-font-family);
		height: 1.6em;
		width: 24px;
		min-width: 24px;
		text-align: center;
		z-index: 1;
		background-color: var(--border-color);
		border: 1px solid var(--border-color);
		border-radius: 0.8em;
		cursor: pointer;
		user-select: none;
		> span {
			display: inline-block;
			transform: scale(0.8, 0.8);
		}
	}
`;
const Filters = styled.div.attrs({
	'data-widget': 'console-subject-filter-joint-filters'
})`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
`;

const FilterRow = (props: {
	filter: ConsoleSpaceSubjectDataSetFilter;
	removeFilter: (filter: ConsoleSpaceSubjectDataSetFilter) => void;
	childrenFiltersChanged: () => void;
	level: number;
}) => {
	const { filter, removeFilter, childrenFiltersChanged, level } = props;

	if (isJointFilter(filter)) {
		return <FilterJoint joint={filter} level={level}
		                    removeFilter={removeFilter} childrenFiltersChanged={childrenFiltersChanged}/>;
	} else if (isExpressionFilter(filter)) {
		return <FilterExpression filter={filter} level={level} removeFilter={removeFilter}/>;
	} else {
		return null;
	}
};

export const FilterJoint = (props: {
	joint: ConsoleSpaceSubjectDataSetFilterJoint;
	removeFilter: (filter: ConsoleSpaceSubjectDataSetFilter) => void;
	childrenFiltersChanged: () => void;
	level: number;
}) => {
	const { joint, removeFilter, childrenFiltersChanged, level } = props;
	const { filters = [] } = joint;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	if (filters.length === 0) {
		return null;
	}

	const onSwitchJointClicked = () => {
		joint.jointType = joint.jointType === FilterJointType.AND ? FilterJointType.OR : FilterJointType.AND;
		forceUpdate();
	};
	const removeChildFilter = (filter: ConsoleSpaceSubjectDataSetFilter) => {
		const index = filters.indexOf(filter);
		filters.splice(index, 1);
		if (filters.length === 0) {
			// all child filters are removed
			// then remove the joint
			removeFilter(joint);
		} else {
			childrenFiltersChanged();
		}
	};

	return <JointRow data-level={level}>
		<Joint data-filters-count={filters.length}>
			<span onClick={onSwitchJointClicked}>
				<span>{joint.jointType === FilterJointType.AND ? 'AND' : 'OR'}</span>
			</span>
		</Joint>
		<Filters>
			{filters.map((filter, index) => {
				return <FilterRow key={index} filter={filter}
				                  removeFilter={removeChildFilter} childrenFiltersChanged={childrenFiltersChanged}
				                  level={level + 1}/>;
			})}
		</Filters>
	</JointRow>;
};