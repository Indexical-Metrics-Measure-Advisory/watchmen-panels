import React from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { FactorHolder } from '../../../../../services/admin/pipeline-types';
import { QueriedFactorForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { ItemFinder } from './item-finder';
import { filterFactor } from './utils';

export const FactorFinder = (props: { holder: FactorHolder, onChange: () => void }) => {
	const { holder, onChange } = props;
	const { topicId: currentTopicId, factorId: currentFactorId } = holder;

	const { store: { topics } } = usePipelineContext();
	const forceUpdate = useForceUpdate();

	// eslint-disable-next-line
	const topic = currentTopicId ? topics.find(topic => topic.topicId == currentTopicId) : (void 0);
	// eslint-disable-next-line
	const factor = currentFactorId ? (topic?.factors.find(factor => factor.factorId == currentFactorId)) : (void 0);

	const asLabel = (factor?: QueriedFactorForPipeline) => factor ? factor.label : '';
	const filterItems = (searchText: string) => filterFactor(topic?.factors || [], searchText);
	const onSelect = (factor: QueriedFactorForPipeline) => {
		holder.factorId = factor.factorId;
		onChange();
		forceUpdate();
	};

	return <ItemFinder typeChar='Factor' item={factor} asLabel={asLabel} filterItems={filterItems}
	                   onSelect={onSelect}/>;
};