import React, { useReducer } from 'react';
import { TopicHolder } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { ItemFinder } from './item-finder';
import { filterTopic } from './utils';

export const TopicFinder = (props: {
	holder: TopicHolder
}) => {
	const { holder } = props;
	const { topicId: currentTopicId } = holder;

	const { store: { topics } } = usePipelineContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	// eslint-disable-next-line
	const topic = currentTopicId ? topics.find(topic => topic.topicId == currentTopicId) : (void 0);

	const asLabel = (topic?: QueriedTopicForPipeline) => topic ? topic.name : '';
	const filterItems = (searchText: string) => filterTopic(topics, searchText);
	const onSelect = (topic: QueriedTopicForPipeline) => {
		holder.topicId = topic.topicId;
		forceUpdate();
	};

	return <ItemFinder typeChar='Topic' item={topic} asLabel={asLabel} filterItems={filterItems} onSelect={onSelect}/>;
};