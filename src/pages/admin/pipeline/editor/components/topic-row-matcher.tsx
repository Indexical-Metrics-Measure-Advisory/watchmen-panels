import { faCompressArrowsAlt, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { CompositeMode, FindBy, TopicHolder } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { CompositeConditionRow } from './composite-condition-row';
import { computeConditionCount, computeConditionLines } from './utils';

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;
const ToggleLine = styled.div`
	display: flex;
	align-items: center;
	height: 32px;
`;
const ToggleButton = styled.div`
	display: flex;
	align-items: center;
	justify-self: start;
	height: 22px;
	border-radius: 11px;
	background-color: var(--pipeline-bg-color);
	cursor: pointer;
	box-shadow: 0 0 0 1px var(--border-color);
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	&[data-expanded=true] > svg {
		transform: rotateZ(180deg);
	}
	> span {
		padding-left: calc(var(--margin) / 2);
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
	}
	> svg {
		font-size: 0.9em;
		margin: 0 calc(var(--margin) / 3);
		transition: all 300ms ease-in-out;
	}
`;
const FilterContent = styled.div.attrs<{ lines: number, count: number, expanded: boolean }>(
	({ lines, expanded }) => {
		return {
			style: {
				maxHeight: expanded ? lines * 32 : 0,
				transform: expanded ? 'none' : 'rotateX(90deg)'
			}
		};
	})<{ lines: number, expanded: boolean }>`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	transform-origin: top;
	transition: all 300ms ease-in-out;
	margin-left: -10px;
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
`;

const FilterLabel = (props: { topic?: QueriedTopicForPipeline, count: number }) => {
	const { topic, count } = props;

	if (topic) {
		if (count === 0) {
			return <span>No Filter Defined</span>;
		} else if (count === 1) {
			return <span>1 Filter</span>;
		} else {
			return <span>{count} Filters</span>;
		}
	} else {
		return <span>Pick Topic First</span>;
	}
};

export const TopicRowMatcher = (props: {
	holder: TopicHolder & FindBy,
}) => {
	const { holder } = props;

	const { store: { topics } } = usePipelineContext();
	const { addPropertyChangeListener, removePropertyChangeListener } = usePipelineUnitActionContext();
	const [ expanded, setExpanded ] = useState(false);
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addPropertyChangeListener(PipelineUnitActionEvent.TOPIC_CHANGED, forceUpdate);
		addPropertyChangeListener(PipelineUnitActionEvent.FILTER_ADDED, forceUpdate);
		addPropertyChangeListener(PipelineUnitActionEvent.FILTER_REMOVED, forceUpdate);
		return () => {
			removePropertyChangeListener(PipelineUnitActionEvent.TOPIC_CHANGED, forceUpdate);
			removePropertyChangeListener(PipelineUnitActionEvent.FILTER_ADDED, forceUpdate);
			removePropertyChangeListener(PipelineUnitActionEvent.FILTER_REMOVED, forceUpdate);
		};
	});

	// eslint-disable-next-line
	const topic = topics.find(topic => topic.topicId == holder.topicId);

	const onToggleFilterSettingsClicked = () => setExpanded(!expanded);

	if (!holder.by) {
		holder.by = { mode: CompositeMode.AND, children: [] };
	}

	const linesCount = computeConditionLines(holder.by);
	const filtersCount = computeConditionCount(holder.by);

	return <Container>
		<ToggleLine>
			<ToggleButton data-expanded={expanded} onClick={onToggleFilterSettingsClicked}>
				<FilterLabel topic={topic} count={filtersCount}/>
				<FontAwesomeIcon icon={expanded ? faCompressArrowsAlt : faExpandArrowsAlt}/>
			</ToggleButton>
		</ToggleLine>
		{topic
			? <FilterContent lines={linesCount} expanded={expanded}>
				<CompositeConditionRow left={topic} condition={holder.by} removable={false}/>
			</FilterContent>
			: null}
	</Container>;
};