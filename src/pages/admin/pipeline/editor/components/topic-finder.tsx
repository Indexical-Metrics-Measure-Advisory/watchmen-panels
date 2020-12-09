import React, { useReducer } from 'react';
import { TopicHolder } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { ItemFinder } from './item-finder';

interface FilteredTopic {
	item: QueriedTopicForPipeline;
	parts: Array<string>;
}

const filterTopic = (topics: Array<QueriedTopicForPipeline>, text: string): Array<FilteredTopic> => {
	text = text.trim();
	if (!text) {
		return [];
	} else {
		text = text.toUpperCase();
		return topics.map(topic => {
			const segments = topic.name.toUpperCase().split(text);
			if (segments.length === 1) {
				return null;
			} else {
				const length = text.length;
				const count = segments.length;
				let pos = 0;
				return {
					item: topic,
					parts: segments.reduce((all, segment, index) => {
						const len = segment.length;
						all.push(topic.name.substr(pos, len));
						pos += len;
						if (index !== count - 1) {
							all.push(topic.name.substr(pos, length));
							pos += length;
						}
						return all;
					}, [] as Array<string>)
				};
			}
		}).filter(x => x) as Array<FilteredTopic>;
	}
};

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

	return <ItemFinder item={topic} asLabel={asLabel} filterItems={filterItems} onSelect={onSelect}/>;
};