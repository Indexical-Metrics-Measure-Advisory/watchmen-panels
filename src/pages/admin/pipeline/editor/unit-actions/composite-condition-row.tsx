import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons';
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
import { DangerObjectButton, PrimaryObjectButton } from '../components/object-button';
import { isCompositeCondition } from '../components/utils';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { PlainConditionRow } from './plain-condition-row';

const Container = styled.div.attrs({
	'data-widget': 'composite-condition'
})`
	display: flex;
	flex-direction: column;
`;
const Title = styled.div.attrs({
	'data-widget': 'composite-condition-title'
})`
	display: grid;
	grid-template-columns: auto 1fr auto;
	height: 32px;
	min-height: 32px;
	align-items: center;
	transition: all 300ms ease-in-out;
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
		margin-left: calc(var(--margin) / 3);
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
				height: visible ? count * 32 : 0,
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
	condition: CompositeCondition;
	visible: boolean;
}) => {
	const { left: topic, condition, visible } = props;

	return <ChildConditionsNode visible={visible} count={condition.children.length}>
		{condition.children.map((child, index) => {
			if (isCompositeCondition(child)) {
				return <CompositeConditionRow left={topic} condition={child} removable={true} key={index}/>;
			} else {
				const plain = child as PlainCondition;
				return <PlainConditionRow left={topic} condition={plain} key={index}/>;
			}
		})}
	</ChildConditionsNode>;
};

export const CompositeConditionRow = (props: {
	left?: QueriedTopicForPipeline;
	condition: CompositeCondition;
	removable: boolean;
}) => {
	const { left: topic, condition, removable } = props;

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

	return <Container data-expanded={expanded}>
		<Title data-expanded={expanded}>
			<div onClick={onToggleExpandedClicked}><FontAwesomeIcon icon={faChevronDown}/></div>
			<HorizontalOptions label={label}
			                   options={[ CompositeMode.AND, CompositeMode.OR ].filter(x => x !== condition.mode)}
			                   toLabel={(mode: CompositeMode) => mode}
			                   onSelect={onSelect}/>
			<div>
				<PrimaryObjectButton onClick={onAddSubFilterClicked}>
					<FontAwesomeIcon icon={faPlus}/>
					<span>Add Sub Filter</span>
				</PrimaryObjectButton>
				{removable
					? <DangerObjectButton>
						<FontAwesomeIcon icon={faTrashAlt}/>
						<span>Remove This Filter</span>
					</DangerObjectButton>
					: null}
			</div>
		</Title>
		{condition.children.length === 0
			? <NoChild>No Child Defined.</NoChild>
			: <ChildConditions left={topic} condition={condition} visible={expanded}/>}
	</Container>;
};
