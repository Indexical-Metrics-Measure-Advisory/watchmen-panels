import React, { useReducer } from 'react';
import { listTopicsForPipeline } from '../../../services/admin/topic';
import { QueriedTopicForPipeline } from '../../../services/admin/types';
import { PipelineHeaderSearchSection } from './components';
import { usePipelineContext } from './pipeline-context';

export const PipelineHeaderTopic = () => {
	const { store: { topic }, changeTopic } = usePipelineContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onTopicClicked = (topic: QueriedTopicForPipeline, hideSearchPanel: () => void) => (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		changeTopic(topic);
		hideSearchPanel();
		forceUpdate();
	};
	const renderCandidate = (item: QueriedTopicForPipeline, hideSearchPanel: () => void) => {
		return <div key={item.topicId} onClick={onTopicClicked(item, hideSearchPanel)}>{item.name}</div>;
	};

	return <PipelineHeaderSearchSection visible={true}
	                                    title={(topic?: QueriedTopicForPipeline) => topic ? topic.name : 'Choose Topic'}
	                                    searchPlaceholder='Topic name...'
	                                    nonMatchLabel='No matched topic.'
	                                    selection={topic}
	                                    doSearch={listTopicsForPipeline}
	                                    renderCandidate={renderCandidate}/>;
};