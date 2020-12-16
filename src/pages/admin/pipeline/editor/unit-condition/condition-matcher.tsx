import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { usePipelineContext } from '../../pipeline-context';
import { ArrangedProcessUnit } from '../../types';
import { computeConditionLines } from '../components/utils';
import { PipelineUnitConditionEvent, usePipelineUnitConditionContext } from '../pipeline-unit-condition-context';
import { CompositeConditionRow } from './composite-condition-row';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	grid-column: 2 / span 3;
`;
const FilterContent = styled.div.attrs<{ lines: number }>(({ lines }) => {
	return { style: { maxHeight: lines * 32 } };
})<{ lines: number }>`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	transform-origin: top;
	transition: all 300ms ease-in-out;
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

export const ConditionMatcher = (props: {
	unit: ArrangedProcessUnit;
}) => {
	const { unit } = props;

	const { store: { topics, selectedPipeline } } = usePipelineContext();
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

	// eslint-disable-next-line
	const topic = topics.find(topic => topic.topicId == selectedPipeline?.topicId);

	const linesCount = computeConditionLines(unit.on!);
	return <Container>
		{topic
			? <FilterContent lines={linesCount}>
				<CompositeConditionRow left={topic} condition={unit.on!} removable={false} level={1}/>
			</FilterContent>
			: null}
	</Container>;
};