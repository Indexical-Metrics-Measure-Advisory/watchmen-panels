import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faChevronDown, faLongArrowAltLeft, faLongArrowAltRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import {
	CompositeCondition,
	CompositeMode,
	ConditionOperator,
	PlainCondition
} from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { HorizontalOptions } from '../components/horizontal-options';
import { computeConditionLines, isCompositeCondition } from '../components/utils';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { PlainConditionRow } from './plain-condition-row';

const Container = styled.div.attrs({
	'data-widget': 'composite-condition'
})`
	display: flex;
	position: relative;
	flex-direction: column;
	&[data-removable=true] {
		&:before,
		&:after {
			content: '';
			display: block;
			position: absolute;
			background-color: var(--border-color);
		}
		&:before {
			top: 16px;
			left: calc(var(--margin) / -2);
			width: calc(var(--margin) / 2 - 4px);
			height: 1px;
		}
		&:after {
			top: 0;
			left: calc(var(--margin) / -2);
			width: 1px;
			height: 16px;
		}
		&:not(:last-child):after {
			height: 100%;
		}
	}
`;
const Title = styled.div.attrs({
	'data-widget': 'composite-condition-title'
})`
	display: grid;
	grid-template-columns: auto auto 1fr;
	height: 32px;
	min-height: 32px;
	align-items: center;
	transition: all 300ms ease-in-out;
	&:hover {
		> div:nth-child(2) {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		> div:nth-child(3) {
			opacity: 1;
			pointer-events: auto;
		}
	}
	&[data-expanded=false] {
		> div:first-child > svg {
			transform: rotateZ(-90deg);
		}
		+ div {
			min-height: 0;
			height: 0;
		}
	}
	> div:first-child {
		display: flex;
		width: var(--margin);
		justify-content: center;
		cursor: pointer;
		> svg {
			opacity: 0.7;
			transition: all 300ms ease-in-out;
		}
	}
	> div:nth-child(2) {
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
		text-transform: capitalize;
	}
	> div:last-child {
		display: flex;
		justify-self: start;
		cursor: pointer;
		border-top-right-radius: 11px;
		border-bottom-right-radius: 11px;
		background-color: var(--pipeline-bg-color);
		opacity: 0;
		pointer-events: none;
		transition: all 300ms ease-in-out;
		> div {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 22px;
			box-shadow: 0 1px 0 0 var(--border-color), 0 -1px 0 0 var(--border-color), 1px 0 0 0 var(--border-color);
			padding: calc(var(--margin) / 3);
			font-size: 0.8em;
			&:hover {
				box-shadow: var(--console-primary-hover-shadow);
				pointer-events: auto;
			}
			&:last-child {
				border-top-right-radius: 11px;
				border-bottom-right-radius: 11px;
			}
		}
	}
`;
const NoChild = styled.div.attrs({
	'data-widget': 'composite-condition-no-child'
})`
	display: flex;
	position: relative;
	align-items: center;
	padding: 0 var(--margin);
	min-height: 32px;
	height: 32px;
	overflow: hidden;
	transition: all 300ms ease-in-out;
	&:before,
	&:after {
		content: '';
		display: block;
		position: absolute;
		background-color: var(--border-color);
	}
	&:before {
		top: 16px;
		left: calc(var(--margin) / 2);
		width: calc(var(--margin) / 2 - 4px);
		height: 1px;
	}
	&:after {
		top: 0;
		left: calc(var(--margin) / 2);
		width: 1px;
		height: 16px;
	}
`;
const ChildConditionsNode = styled.div.attrs<{ count: number, visible: boolean }>(
	({ count, visible }) => {
		return {
			'data-widget': 'composite-condition-children',
			style: {
				maxHeight: visible ? count * 32 : 0,
				transform: visible ? 'none' : 'rotateX(90deg)'
			}
		};
	})<{ count: number, visible: boolean }>`
	display: flex;
	flex-direction: column;
	padding-left: var(--margin);
	transform-origin: top;
	transition: all 300ms ease-in-out;
`;

const ChildConditions = (props: {
	left?: QueriedTopicForPipeline;
	parent?: CompositeCondition;
	condition: CompositeCondition;
	visible: boolean;
}) => {
	const { left: topic, parent: parentCondition, condition, visible } = props;

	const lines = computeConditionLines(condition) - 1;

	return <ChildConditionsNode visible={visible} count={lines}>
		{condition.children.map((child, index) => {
			if (isCompositeCondition(child)) {
				return <CompositeConditionRow left={topic}
				                              grandParent={parentCondition} parent={condition} condition={child}
				                              removable={true}
				                              key={index}/>;
			} else {
				const plain = child as PlainCondition;
				return <PlainConditionRow left={topic}
				                          grandParent={parentCondition} parent={condition} condition={plain}
				                          key={index}/>;
			}
		})}
	</ChildConditionsNode>;
};

export const CompositeConditionRow = (props: {
	left?: QueriedTopicForPipeline;
	grandParent?: CompositeCondition;
	parent?: CompositeCondition;
	condition: CompositeCondition;
	removable: boolean;
}) => {
	const { left: topic, grandParent: grandParentCondition, parent: parentCondition, condition, removable } = props;

	const { firePropertyChange } = usePipelineUnitActionContext();
	const [ expanded, setExpanded ] = useState(true);
	const forceUpdate = useForceUpdate();

	const label = condition.mode;
	const onToggleExpandedClicked = () => setExpanded(!expanded);
	const onSelect = (mode: CompositeMode) => {
		condition.mode = mode;
		forceUpdate();
	};
	const onAddSubFilterClicked = () => {
		condition.children.push({ operator: ConditionOperator.EQUALS });
		expanded ? forceUpdate() : setExpanded(true);
		firePropertyChange(PipelineUnitActionEvent.FILTER_ADDED);
	};
	const onOutdentClicked = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!grandParentCondition || !parentCondition) {
			return;
		}
		const indexInParent = parentCondition.children.findIndex(child => child === condition);
		const indexInGrand = grandParentCondition.children.findIndex(child => child === parentCondition);
		// remove from parent
		parentCondition.children.splice(indexInParent, 1);
		// add into grand, after parent
		grandParentCondition.children.splice(indexInGrand + 1, 0, condition);
		firePropertyChange(PipelineUnitActionEvent.FILTER_OUTDENT);
	};
	const onIndentClicked = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!parentCondition) {
			return;
		}
		const newParent: CompositeCondition = { mode: CompositeMode.AND, children: [ condition ] };
		const mode = parentCondition.mode;
		if (mode === CompositeMode.AND) {
			newParent.mode = CompositeMode.OR;
		}
		const index = parentCondition.children.findIndex(child => child === condition);
		parentCondition.children.splice(index, 1, newParent);
		firePropertyChange(PipelineUnitActionEvent.FILTER_INDENT);
	};
	const onRemoveClicked = () => {
		if (!parentCondition) {
			return;
		}
		const index = parentCondition.children.findIndex(child => child === condition);
		parentCondition.children.splice(index, 1);
		firePropertyChange(PipelineUnitActionEvent.FILTER_REMOVED);
	};

	return <Container data-expanded={expanded} data-removable={removable}>
		<Title data-expanded={expanded}>
			<div onClick={onToggleExpandedClicked}><FontAwesomeIcon icon={faChevronDown}/></div>
			<HorizontalOptions label={label}
			                   options={[ CompositeMode.AND, CompositeMode.OR ].filter(x => x !== condition.mode)}
			                   toLabel={(mode: CompositeMode) => mode}
			                   onSelect={onSelect}/>
			<div>
				<div onClick={onAddSubFilterClicked}>
					<FontAwesomeIcon icon={faPlus}/>
				</div>
				{!!grandParentCondition
					? <div onClick={onOutdentClicked}>
						<FontAwesomeIcon icon={faLongArrowAltLeft}/>
					</div>
					: null}
				{removable
					? <div onClick={onIndentClicked}>
						<FontAwesomeIcon icon={faLongArrowAltRight}/>
					</div>
					: null}
				{removable
					? <div onClick={onRemoveClicked}>
						<FontAwesomeIcon icon={faTrashAlt}/>
					</div>
					: null}
			</div>
		</Title>
		{condition.children.length === 0
			? <NoChild>No Child Defined.</NoChild>
			: <ChildConditions left={topic} parent={parentCondition} condition={condition} visible={expanded}/>}
	</Container>;
};
