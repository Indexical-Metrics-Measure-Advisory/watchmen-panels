import React from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { FactorHolder, TopicHolder } from '../../../../../services/admin/pipeline-types';
import { QueriedFactorForPipeline, QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { ItemFinder } from './item-finder';
import { filterFactor, filterTopic } from './utils';

const Container = styled.div`
	display: flex;
	> div {
		width: 50%;
	}
	> div:first-child {
		width: calc(50% + 1px);
		border-bottom-right-radius: 0;
		border-top-right-radius: 0;
		> input {
			border-radius: 0;
		}
	}
	> div:last-child {
		border-bottom-left-radius: 0;
		border-top-left-radius: 0;
		box-shadow: 0 1px 0 0 var(--border-color), 0 -1px 0 0 var(--border-color), 1px 0 0 0 var(--border-color);
		&:hover {
			box-shadow: var(--console-primary-hover-shadow);
		}
	}
`;

export const TopicFactorFinder = (props: { holder: TopicHolder & FactorHolder }) => {
	const { holder } = props;

	const { topicId: currentTopicId, factorId: currentFactorId } = holder;

	const { store: { topics } } = usePipelineContext();
	const { firePropertyChange } = usePipelineUnitActionContext();
	const forceUpdate = useForceUpdate();

	// eslint-disable-next-line
	const topic = currentTopicId ? topics.find(topic => topic.topicId == currentTopicId) : (void 0);
	// eslint-disable-next-line
	const factor = currentFactorId ? (topic?.factors.find(factor => factor.factorId == currentFactorId)) : (void 0);

	const asTopicLabel = (topic?: QueriedTopicForPipeline) => topic ? topic.name : '';
	const filterTopics = (searchText: string) => filterTopic(topics, searchText);
	const onTopicSelect = (topic: QueriedTopicForPipeline) => {
		// eslint-disable-next-line
		if (holder.topicId == topic.topicId) {
			return;
		}
		holder.topicId = topic.topicId;
		firePropertyChange(PipelineUnitActionEvent.TOPIC_CHANGED);
		delete holder.factorId;
		firePropertyChange(PipelineUnitActionEvent.FACTOR_CHANGED);
		forceUpdate();
	};

	const asFactorLabel = (factor?: QueriedFactorForPipeline) => factor ? factor.label : '';
	const filterFactors = (searchText: string) => filterFactor(topic?.factors || [], searchText);
	const onFactorSelect = (factor: QueriedFactorForPipeline) => {
		holder.factorId = factor.factorId;
		firePropertyChange(PipelineUnitActionEvent.FACTOR_CHANGED);
		forceUpdate();
	};

	return <Container>
		<ItemFinder typeChar='Topic' item={topic} asLabel={asTopicLabel} filterItems={filterTopics}
		            onSelect={onTopicSelect}/>
		<ItemFinder typeChar='Factor' item={factor} asLabel={asFactorLabel} filterItems={filterFactors}
		            onSelect={onFactorSelect}/>
	</Container>;

};