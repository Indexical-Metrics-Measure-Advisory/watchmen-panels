import React from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { TopicHolder } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { ItemFinder } from './item-finder';
import { filterTopic } from './utils';

export const TopicFinder = (props: {
	holder: TopicHolder;
	forFilter: boolean;
}) => {
	const { holder, forFilter } = props;
	const { topicId: currentTopicId } = holder;

	const { store: { topics } } = usePipelineContext();
	const { firePropertyChange } = usePipelineUnitActionContext();
	const forceUpdate = useForceUpdate();

	// eslint-disable-next-line
	const topic = currentTopicId ? topics.find(topic => topic.topicId == currentTopicId) : (void 0);

	const asLabel = (topic?: QueriedTopicForPipeline) => topic ? topic.name : '';
	const filterItems = (searchText: string) => filterTopic(topics, searchText);
	const onSelect = (topic: QueriedTopicForPipeline) => {
		holder.topicId = topic.topicId;
		if (forFilter) {
			firePropertyChange(PipelineUnitActionEvent.FILTER_CHANGED);
		} else {
			firePropertyChange(PipelineUnitActionEvent.TOPIC_CHANGED);
		}
		forceUpdate();
	};

	return <ItemFinder typeChar='Topic' item={topic} asLabel={asLabel} filterItems={filterItems} onSelect={onSelect}/>;
};