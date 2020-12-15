import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useCollapseFixedThing, useForceUpdate } from '../../../../../common/utils';
import {
	ConditionOperator,
	DatePartArithmetic,
	FactorValue,
	FactorValueHolder,
	NoArithmetic,
	NumericArithmetic,
	PlainCondition,
	SimpleFuncArithmetic,
	SomeValueType
} from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { ConditionOperatorSelect } from './condition-operator-select';
import { FacterValueFinder } from './facter-value-finder';
import { FactorFinder } from './factor-finder';
import { isFactorValue, isMemoryValue } from './utils';

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
	border: var(--border);
	border-color: transparent;
	border-radius: 12px;
	background-color: transparent;
	height: 24px;
	line-height: 22px;
	outline: none;
	appearance: none;
	white-space: nowrap;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-expanded=true],
	&:hover {
		border-color: transparent;
		background-color: var(--pipeline-bg-color);
		box-shadow: var(--console-primary-hover-shadow);
		> div:first-child {
			padding-left: calc(var(--margin) / 2);
		}
		> div:last-child {
			opacity: 1;
			pointer-events: auto;
		}
	}
	&[data-expanded=true] > div:last-child > svg {
		transform: rotateZ(180deg);
	}
	> div:first-child {
		position: relative;
		font-weight: var(--font-bold);
		font-variant: petite-caps;
		border-top-left-radius: 12px;
		border-bottom-left-radius: 12px;
		transition: all 300ms ease-in-out;
	}
	> div:last-child {
		position: relative;
		padding: 0 calc(var(--margin) / 3);
		opacity: 0;
		pointer-events: none;
		transition: all 300ms ease-in-out;
		> svg {
			transition: all 300ms ease-in-out;
		}
	}
`;
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
	height: 88px;
	transform: scaleY(0);
	transition: transform 300ms ease-in-out;
	pointer-events: none;
	background-color: var(--bg-color);
	border-radius: 12px;
	box-shadow: var(--console-primary-hover-shadow);
	&[data-expanded=true] {
		transform: none;
		pointer-events: auto;
	}
	> div {
		height: 28px;
		min-height: 28px;
		padding: 0 calc(var(--margin) / 2);
		&:first-child {
			margin-top: 2px;
		}
		&:last-child > div:last-child {
			align-self: unset;
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

const OperatorLabels: { [key in ConditionOperator]: string } = {
	[ConditionOperator.EQUALS]: '=',
	[ConditionOperator.NOT_EQUALS]: '≠',
	[ConditionOperator.LESS]: '<',
	[ConditionOperator.LESS_EQUALS]: '≤',
	[ConditionOperator.MORE]: '>',
	[ConditionOperator.MORE_EQUALS]: '≥',
	[ConditionOperator.IN]: 'In',
	[ConditionOperator.NOT_IN]: 'Not In'
};
const asDisplayOperator = (operator: ConditionOperator): string => OperatorLabels[operator];
const ArithmeticLabels: { [key in SimpleFuncArithmetic]: string } = {
	[NoArithmetic.NO_FUNC]: '',
	[DatePartArithmetic.YEAR_OF]: 'Year',
	[DatePartArithmetic.MONTH_OF]: 'Month',
	[DatePartArithmetic.WEEK_OF]: 'WeekOfYear',
	[DatePartArithmetic.WEEKDAY]: 'Weekday',
	[NumericArithmetic.PERCENTAGE]: 'Percentage',
	[NumericArithmetic.ABSOLUTE_VALUE]: 'Abs',
	[NumericArithmetic.LOGARITHM]: 'Log'
};
const asDisplayArithmetic = (arithmetic: SimpleFuncArithmetic): string => ArithmeticLabels[arithmetic];
const buildLabel = (options: {
	topic?: QueriedTopicForPipeline;
	condition: PlainCondition;
	topics: Array<QueriedTopicForPipeline>;
}) => {
	const { topic, condition, topics } = options;

	let label = '';
	if (topic) {
		const left = condition.left as FactorValue;
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
		right += condition.right.name || '?';
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

export const PlainConditionRow = (props: {
	left?: QueriedTopicForPipeline;
	condition: PlainCondition;
}) => {
	const { left: topic, condition } = props;

	const { store: { selectedTopic } } = usePipelineContext();

	const topContainerRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [ expanded, setExpanded ] = useState(false);
	const [ dropdownRect, setDropdownRect ] = useState<DropdownRect>({ top: 0, left: 0, width: 0, atTop: false });
	useCollapseFixedThing(topContainerRef, () => setExpanded(false));

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

	const onExpandClick = () => {
		if (!expanded) {
			const rect = containerRef.current!.getBoundingClientRect();
			const top = rect.top + rect.height + 2;
			const bottom = top + 88;
			if (bottom > window.innerHeight) {
				setDropdownRect({ top: rect.top - 88 - 2, left: rect.left, width: rect.width, atTop: true });
			} else {
				setDropdownRect({ top, left: rect.left, width: rect.width, atTop: false });
			}
			setExpanded(true);
		}
	};

	return <Container ref={topContainerRef}>
		<DisplayLabel ref={containerRef} tabIndex={0} data-expanded={expanded}
		              onClick={onExpandClick}>
			<Statement topic={topic} condition={condition}/>
			<div><FontAwesomeIcon icon={expanded ? faCompressAlt : faExpandAlt}/></div>
		</DisplayLabel>
		<Dropdown ref={dropdownRef} data-expanded={expanded} {...dropdownRect}>
			{isFactorValue(condition.left)
				? <LeftAsFactorContainer>
					<div>Topic: {topic?.name}</div>
					<FactorFinder holder={condition.left} forFilter={true}/>
				</LeftAsFactorContainer>
				: null}
			<OperatorAndRightContainer>
				<ConditionOperatorSelect condition={condition} forFilter={true}/>
			</OperatorAndRightContainer>
			<FacterValueFinder holder={condition as unknown as FactorValueHolder} propName='right' forFilter={true}/>
		</Dropdown>
	</Container>;
};

