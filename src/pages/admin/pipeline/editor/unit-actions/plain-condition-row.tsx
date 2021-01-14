import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faCompressAlt, faExpandAlt, faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useCollapseFixedThing, useForceUpdate } from '../../../../../common/utils';
import {
	CompositeCondition,
	CompositeMode,
	FactorValue,
	NoArithmetic,
	PlainCondition,
	SomeValueType
} from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { ConditionOperatorSelect } from '../components/condition-operator-select';
import { FacterValueFinder } from '../components/facter-value-finder';
import { FactorFinder } from '../components/factor-finder';
import { isFactorValue, isMemoryValue } from '../components/utils';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { asDisplayArithmetic, asDisplayOperator } from '../utils';

interface DropdownRect {
	top: number;
	left: number;
	width: number;
	atTop: boolean;
}

const Container = styled.div.attrs({
	'data-widget': 'plain-condition'
})`
	display: flex;
	align-items: center;
	position: relative;
	height: 32px;
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
`;
const DisplayLabel = styled.div`
	display: flex;
	position: relative;
	justify-self: flex-start;
	border-radius: 12px;
	background-color: transparent;
	height: 22px;
	line-height: 22px;
	outline: none;
	appearance: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-expanded=true],
	&:hover {
		background-color: var(--pipeline-bg-color);
		box-shadow: var(--console-primary-hover-shadow);
		> div:first-child {
			padding-left: calc(var(--margin) / 2);
		}
		> div:not(:first-child) {
			opacity: 1;
			pointer-events: auto;
		}
	}
	&[data-expanded=true] > div:nth-child(2) > svg {
		transform: rotateZ(180deg);
	}
	> div:first-child {
		flex-grow: 1;
		position: relative;
		font-weight: var(--font-bold);
		font-variant: petite-caps;
		border-top-left-radius: 12px;
		border-bottom-left-radius: 12px;
		transition: all 300ms ease-in-out;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	> div:not(:first-child) {
		position: relative;
		padding: 0 calc(var(--margin) / 3);
		opacity: 0;
		pointer-events: none;
		transition: all 300ms ease-in-out;
		> svg {
			font-size: 0.8em;
			transition: all 300ms ease-in-out;
		}
		&:not(:nth-child(2)):before {
			content: '';
			display: block;
			position: absolute;
			left: 0;
			top: 20%;
			width: 1px;
			height: 60%;
			background-color: var(--border-color);
		}
	}
`;
const DropdownHeight = 120;
const Dropdown = styled.div.attrs<DropdownRect>(({ top, left, width, atTop }) => {
	return {
		style: {
			top, left, minWidth: Math.max(width, 600),
			transformOrigin: atTop ? 'bottom' : 'top'
		}
	};
})<DropdownRect>`
	display: flex;
	position: fixed;
	flex-direction: column;
	z-index: 1000;
	height: ${DropdownHeight}px;
	padding: 0 calc(var(--margin) / 2);
	transform: scaleY(0);
	transition: transform 300ms ease-in-out;
	pointer-events: none;
	background-color: var(--bg-color);
	border-radius: calc(var(--border-radius) * 3);
	box-shadow: var(--console-primary-hover-shadow);
	&[data-expanded=true] {
		transform: none;
		pointer-events: auto;
	}
	> div {
		height: 28px;
		&:first-child {
			display: flex;
			align-items: center;
			height: 32px;
			background-color: var(--pipeline-bg-color);
			margin: 0 calc(var(--margin) / -2) 2px;
			padding: 0 calc(var(--margin) / 2);
			font-weight: var(--font-bold);
		}
		&:last-child {
			margin-bottom: 2px;
		}
	}
`;
const LeftAsFactorContainer = styled.div`
	display: flex;
	align-items: center;
	> div:first-child {
		display: flex;
		align-items: center;
		height: 22px;
		padding: 0 calc(var(--margin) / 2);
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
		background-color: var(--pipeline-bg-color);
		box-shadow: 0 0 0 1px var(--border-color);
		border-top-left-radius: var(--border-radius);
		border-bottom-left-radius: var(--border-radius);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	> div:nth-child(2) {
		flex-grow: 1;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		box-shadow: 0 1px 0 0 var(--border-color), 0 -1px 0 0 var(--border-color), 1px 0 0 0 var(--border-color);
		&:hover {
			box-shadow: var(--console-primary-hover-shadow);
		}
		> input {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
	}
`;
const OperatorAndRightContainer = styled.div`
	display: flex;
	align-items: center;
`;

const buildLabel = (options: {
	topic?: QueriedTopicForPipeline;
	condition: PlainCondition;
	topics: Array<QueriedTopicForPipeline>;
}) => {
	const { topic, condition, topics } = options;

	let label = '';
	if (topic) {
		const left = condition.left as FactorValue;
		// eslint-disable-next-line
		if (left.topicId != topic.topicId) {
			// topic changed
			left.topicId = topic.topicId;
			delete left.factorId;
		}
		label += `${topic.name}.`;
		if (left.factorId) {
			// eslint-disable-next-line
			const factor = topic.factors.find(factor => factor.factorId == left.factorId);
			label += factor ? factor.label : '?';
		} else {
			label += '?';
		}
	}
	label += ` ${asDisplayOperator(condition.operator)} `;

	let right = '';
	if (isFactorValue(condition.right)) {
		const topicId = condition.right.topicId;
		// eslint-disable-next-line
		const topic = topicId ? topics.find(topic => topic.topicId == topicId) : null;
		if (topic) {
			right += `${topic.name}.`;
			const factorId = condition.right.factorId;
			// eslint-disable-next-line
			const factor = factorId ? topic.factors.find(factor => factor.factorId == factorId) : null;
			if (factor) {
				right += factor.label;
			} else {
				right += '?';
			}
		} else {
			right += '?.?';
		}
	} else if (isMemoryValue(condition.right)) {
		right += `Memory Context.${condition.right.name || '?'}`;
	}

	const arithmetic = asDisplayArithmetic(condition.right.arithmetic);
	if (arithmetic) {
		right = `${arithmetic}(${right})`;
	}

	return label + right;
};

const Statement = (props: {
	topic?: QueriedTopicForPipeline;
	condition: PlainCondition;
}) => {
	const { topic, condition } = props;

	const { store: { topics } } = usePipelineContext();
	const { addPropertyChangeListener, removePropertyChangeListener } = usePipelineUnitActionContext();
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addPropertyChangeListener(PipelineUnitActionEvent.FILTER_CHANGED, forceUpdate);
		return () => removePropertyChangeListener(PipelineUnitActionEvent.FILTER_CHANGED, forceUpdate);
	});

	return <div>{buildLabel({ topic, condition, topics })}</div>;
};

const fillCondition = (options: {
	condition: PlainCondition;
	topic?: QueriedTopicForPipeline,
	selectedTopic?: QueriedTopicForPipeline
}) => {
	const { condition, topic, selectedTopic } = options;

	if (!condition.left) {
		condition.left = { arithmetic: NoArithmetic.NO_FUNC };
		if (topic) {
			condition.left.type = SomeValueType.FACTOR;
			(condition.left as FactorValue).topicId = topic.topicId;
		} else {
			condition.left.type = SomeValueType.IN_MEMORY;
		}
	}
	if (!condition.right) {
		// right part comes from memory or pipeline source target
		condition.right = {
			type: SomeValueType.FACTOR,
			topicId: selectedTopic?.topicId,
			arithmetic: NoArithmetic.NO_FUNC
		} as FactorValue;
	}
};

export const PlainConditionRow = (props: {
	left?: QueriedTopicForPipeline;
	grandParent?: CompositeCondition;
	parent: CompositeCondition;
	condition: PlainCondition;
}) => {
	const { left: topic, grandParent: grandParentCondition, parent: parentCondition, condition } = props;

	const { store: { selectedTopic } } = usePipelineContext();
	const { firePropertyChange } = usePipelineUnitActionContext();

	const topContainerRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [ expanded, setExpanded ] = useState(false);
	const [ dropdownRect, setDropdownRect ] = useState<DropdownRect>({ top: 0, left: 0, width: 0, atTop: false });
	useCollapseFixedThing(topContainerRef, () => setExpanded(false));

	fillCondition({ condition, topic, selectedTopic });

	const onExpandClick = () => {
		if (!expanded) {
			const rect = containerRef.current!.getBoundingClientRect();
			const top = rect.top + rect.height + 2;
			const bottom = top + DropdownHeight;
			if (bottom > window.innerHeight) {
				setDropdownRect({
					top: rect.top - DropdownHeight - 2,
					left: rect.left,
					width: rect.width,
					atTop: true
				});
			} else {
				setDropdownRect({ top, left: rect.left, width: rect.width, atTop: false });
			}
			setExpanded(true);
		}
	};
	const onOutdentClicked = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
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
		event.preventDefault();
		event.stopPropagation();
		const newParent: CompositeCondition = { mode: CompositeMode.AND, children: [ condition ] };
		const mode = parentCondition.mode;
		if (mode === CompositeMode.AND) {
			newParent.mode = CompositeMode.OR;
		}
		const index = parentCondition.children.findIndex(child => child === condition);
		parentCondition.children.splice(index, 1, newParent);
		firePropertyChange(PipelineUnitActionEvent.FILTER_INDENT);
	};
	const onRemoveClicked = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		if (!parentCondition) {
			return;
		}
		const index = parentCondition.children.findIndex(child => child === condition);
		parentCondition.children.splice(index, 1);
		firePropertyChange(PipelineUnitActionEvent.FILTER_REMOVED);
	};
	const onFilterChange = () => firePropertyChange(PipelineUnitActionEvent.FILTER_CHANGED);

	return <Container ref={topContainerRef}>
		<DisplayLabel ref={containerRef} tabIndex={0} data-expanded={expanded}
		              onClick={onExpandClick}>
			<Statement topic={topic} condition={condition}/>
			<div><FontAwesomeIcon icon={expanded ? faCompressAlt : faExpandAlt}/></div>
			{!!grandParentCondition ?
				<div onClick={onOutdentClicked}><FontAwesomeIcon icon={faLongArrowAltLeft}/></div> : null}
			<div onClick={onIndentClicked}><FontAwesomeIcon icon={faLongArrowAltRight}/></div>
			<div onClick={onRemoveClicked}><FontAwesomeIcon icon={faTrashAlt}/></div>
		</DisplayLabel>
		<Dropdown ref={dropdownRef} data-expanded={expanded} {...dropdownRect}>
			<div>Expression Setting</div>
			{isFactorValue(condition.left)
				? <LeftAsFactorContainer>
					<div>Topic: {topic?.name}</div>
					<FactorFinder holder={condition.left} onChange={onFilterChange}/>
				</LeftAsFactorContainer>
				: null}
			<OperatorAndRightContainer>
				<ConditionOperatorSelect condition={condition} onChange={onFilterChange}/>
			</OperatorAndRightContainer>
			<FacterValueFinder holder={condition.right}
			                   onTopicChange={onFilterChange} onFactorChange={onFilterChange}
			                   onVariableChange={onFilterChange}
			                   onArithmeticChange={onFilterChange}
			                   aggregate={false}/>
		</Dropdown>
	</Container>;
};

