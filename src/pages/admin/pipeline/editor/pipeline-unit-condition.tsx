import { faCompressArrowsAlt, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../common/utils';
import { CompositeMode } from '../../../../services/admin/pipeline-types';
import { ArrangedProcessUnit } from '../types';
import { HorizontalOptions } from './components/horizontal-options';
import { computeConditionCount } from './components/utils';
import {
	PipelineUnitConditionContextProvider,
	PipelineUnitConditionEvent,
	usePipelineUnitConditionContext
} from './pipeline-unit-condition-context';
import { ConditionMatcher } from './unit-condition/condition-matcher';

const UnitCondition = styled.div.attrs({
	'data-widget': 'stage-unit-condition'
})`
	display: grid;
	padding: 0 calc(var(--margin) / 2);
	grid-template-columns: calc(120px - var(--margin) / 2) auto auto 1fr;
	grid-column-gap: calc(var(--margin) / 2);
	&[data-conditional=true] {
		> div:nth-child(2) {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		> div:nth-child(3) {
			opacity: 1;
			pointer-events: auto;
		}
	}
	> div:nth-child(2) {
		align-self: center;
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
	}
	> div:nth-child(3) {
		display: flex;
		align-self: center;
		align-items: center;
		height: 22px;
		background-color: var(--pipeline-bg-color);
		padding: 0 calc(var(--margin) / 3);
		margin-left: calc(var(--margin) / -2);
		box-shadow: 1px 0 0 0 var(--border-color), 0 1px 0 0 var(--border-color), 0 -1px 0 0 var(--border-color);
		opacity: 0;
		pointer-events: none;
		transition: all 300ms ease-in-out;
		border-top-right-radius: 11px;
		border-bottom-right-radius: 11px;
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
		cursor: pointer;
		&:hover {
			box-shadow: var(--console-primary-hover-shadow);
		}
		&[data-condition-expanded=true] {
			> svg {
				transform: rotateZ(180deg);
			}
		}
		> svg {
			margin-left: calc(var(--margin) / 3);
			font-size: 0.9em;
			transition: all 300ms ease-in-out;
		}
	}
	> button {
		align-self: center;
		justify-self: end;
		> svg {
			transition: all 300ms ease-in-out;
		}
	}
`;
const UnitSectionLabel = styled.div.attrs({
	'data-widget': 'stage-unit-label'
})`
	white-space: nowrap;
	font-weight: var(--font-demi-bold);
	font-variant: petite-caps;
	height: 24px;
	line-height: 24px;
	margin-top: 4px;
	align-self: start;
`;

const FilterLabel = (props: { unit: ArrangedProcessUnit; visible: boolean }) => {
	const { unit, visible } = props;

	const { addPropertyChangeListener, removePropertyChangeListener } = usePipelineUnitConditionContext();
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addPropertyChangeListener(PipelineUnitConditionEvent.FILTER_ADDED, forceUpdate);
		addPropertyChangeListener(PipelineUnitConditionEvent.FILTER_REMOVED, forceUpdate);
		addPropertyChangeListener(PipelineUnitConditionEvent.FILTER_INDENT, forceUpdate);
		addPropertyChangeListener(PipelineUnitConditionEvent.FILTER_OUTDENT, forceUpdate);
		return () => {
			removePropertyChangeListener(PipelineUnitConditionEvent.FILTER_ADDED, forceUpdate);
			removePropertyChangeListener(PipelineUnitConditionEvent.FILTER_REMOVED, forceUpdate);
			removePropertyChangeListener(PipelineUnitConditionEvent.FILTER_INDENT, forceUpdate);
			removePropertyChangeListener(PipelineUnitConditionEvent.FILTER_OUTDENT, forceUpdate);
		};
	});

	if (!visible) {
		return <span/>;
	}

	const filtersCount = computeConditionCount(unit.on!);
	if (filtersCount === 0) {
		return <span>No Filter Defined</span>;
	} else if (filtersCount === 1) {
		return <span>1 Filter</span>;
	} else {
		return <span>{filtersCount} Filters</span>;
	}
};

export const PipelineUnitCondition = (props: {
	unit: ArrangedProcessUnit;
	expanded: boolean;
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { unit, expanded, children } = props;

	const [ conditional, setConditional ] = useState(!!unit.on);
	const [ conditionExpanded, setConditionExpanded ] = useState(false);

	const toLabel = (withCondition: boolean) => withCondition ? 'Conditional' : 'Anyway';
	const onConditionExpandClicked = () => setConditionExpanded(!conditionExpanded);
	const onTypeChanged = (withCondition: boolean) => {
		if (withCondition) {
			unit.on = unit.on || { mode: CompositeMode.AND, children: [] };
		} else {
			delete unit.on;
		}
		setConditional(withCondition);
	};

	const conditionLabel = toLabel(conditional);
	if (conditional) {
		if (!unit.on) {
			unit.on = { mode: CompositeMode.AND, children: [] };
		}
	}

	return <PipelineUnitConditionContextProvider>
		<UnitCondition data-conditional={conditional}>
			<UnitSectionLabel>When:</UnitSectionLabel>
			<HorizontalOptions label={conditionLabel}
			                   options={[ !conditional ]} toLabel={toLabel}
			                   onSelect={onTypeChanged}/>
			<div data-visible={conditional} onClick={onConditionExpandClicked}
			     data-condition-expanded={conditionExpanded}>
				<FilterLabel unit={unit} visible={conditional}/>
				<FontAwesomeIcon icon={conditionExpanded ? faCompressArrowsAlt : faExpandArrowsAlt}/>
			</div>
			{children}
			{conditional && expanded ? <ConditionMatcher unit={unit} expanded={conditionExpanded}/> : null}
		</UnitCondition>
	</PipelineUnitConditionContextProvider>;
};