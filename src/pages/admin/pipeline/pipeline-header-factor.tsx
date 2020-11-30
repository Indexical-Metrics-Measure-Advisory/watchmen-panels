import React, { useEffect, useReducer, useState } from 'react';
import { listFactorsByTopic } from '../../../services/admin/topic';
import { QueriedFactorForPipeline, QueriedTopicForPipeline } from '../../../services/admin/types';
import { PipelineHeaderSearchSection } from './components';
import { usePipelineContext } from './pipeline-context';

export const PipelineHeaderFactor = () => {
	const {
		store: { topic, factor },
		addTopicChangedListener, removeTopicChangedListener,
		changeFactor
	} = usePipelineContext();
	const [ factors, setFactors ] = useState<Array<QueriedFactorForPipeline>>([]);
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		const topicChanged = async (topic: QueriedTopicForPipeline) => {
			forceUpdate();
			const factors = await listFactorsByTopic(topic.topicId);
			setFactors(factors);
		};
		addTopicChangedListener(topicChanged);
		return () => {
			removeTopicChangedListener(topicChanged);
		};
	});

	const onFactorClicked = (factor: QueriedFactorForPipeline, hideSearchPanel: () => void) => (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		changeFactor(factor);
		hideSearchPanel();
		forceUpdate();
	};
	const fetchData = (searchText: string): Promise<Array<QueriedFactorForPipeline>> => {
		return new Promise(resolve => {
			if (factors.length !== 0) {
				resolve(factors.filter(factor => factor.label.toUpperCase().includes(searchText.toUpperCase())));
			} else {
				resolve([]);
			}
		});
	};
	const renderCandidate = (item: QueriedFactorForPipeline, hideSearchPanel: () => void) => {
		return <div key={item.factorId} onClick={onFactorClicked(item, hideSearchPanel)}>{item.label}</div>;
	};

	return <PipelineHeaderSearchSection visible={topic != null}
	                                    title={(factor?: QueriedFactorForPipeline) => factor ? factor.label : 'Choose Factor'}
	                                    searchPlaceholder='Factor name...'
	                                    nonMatchLabel='No matched factor.'
	                                    selection={factor}
	                                    doSearch={fetchData}
	                                    renderCandidate={renderCandidate}/>;
};