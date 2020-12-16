import React from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { TopicHolder } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { ItemFinder } from './item-finder';
import { filterTopic } from './utils';

export const TopicFinder = (props: {
	holder: TopicHolder;
	onChange: () => void;
}) => {
	const { holder, onChange } = props;
	const { topicId: currentTopicId } = holder;

	const { store: { topics } } = usePipelineContext();
	const forceUpdate = useForceUpdate();

	// eslint-disable-next-line
	const topic = currentTopicId ? topics.find(topic => topic.topicId == currentTopicId) : (void 0);

	const asLabel = (topic?: QueriedTopicForPipeline) => topic ? topic.name : '';
	const filterItems = (searchText: string) => filterTopic(topics, searchText);
	const onSelect = (topic: QueriedTopicForPipeline) => {
		holder.topicId = topic.topicId;
		onChange();
		forceUpdate();
	};

	return <ItemFinder typeChar='Topic' item={topic} asLabel={asLabel} filterItems={filterItems} onSelect={onSelect}/>;
};