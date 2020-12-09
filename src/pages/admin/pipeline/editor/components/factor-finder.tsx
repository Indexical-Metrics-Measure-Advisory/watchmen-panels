import React, { useReducer } from 'react';
import { FactorHolder } from '../../../../../services/admin/pipeline-types';
import { QueriedFactorForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { ItemFinder } from './item-finder';

interface FilteredFactor {
	item: QueriedFactorForPipeline;
	parts: Array<string>;
}

const filterFactor = (factors: Array<QueriedFactorForPipeline>, text: string): Array<FilteredFactor> => {
	text = text.trim();
	if (!text) {
		return [];
	} else {
		text = text.toUpperCase();
		return factors.map(factor => {
			const name = `${factor.label} (${factor.name})`;
			const segments = name.toUpperCase().split(text);
			if (segments.length === 1) {
				return null;
			} else {
				const length = text.length;
				const count = segments.length;
				let pos = 0;
				return {
					item: factor,
					parts: segments.reduce((all, segment, index) => {
						const len = segment.length;
						all.push(name.substr(pos, len));
						pos += len;
						if (index !== count - 1) {
							all.push(name.substr(pos, length));
							pos += length;
						}
						return all;
					}, [] as Array<string>)
				};
			}
		}).filter(x => x) as Array<FilteredFactor>;
	}
};

export const FactorFinder = (props: {
	holder: FactorHolder
}) => {
	const { holder } = props;
	const { topicId: currentTopicId, factorId: currentFactorId } = holder;

	const { store: { topics } } = usePipelineContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	// eslint-disable-next-line
	const topic = currentTopicId ? topics.find(topic => topic.topicId == currentTopicId) : (void 0);
	const factor = currentFactorId ? (topic?.factors.find(factor => factor.factorId == currentFactorId)) : (void 0);

	const asLabel = (factor?: QueriedFactorForPipeline) => factor ? `${factor.label} (${factor.name})` : '';
	const filterItems = (searchText: string) => filterFactor(topic?.factors || [], searchText);
	const onSelect = (factor: QueriedFactorForPipeline) => {
		holder.factorId = factor.factorId;
		forceUpdate();
	};

	return <ItemFinder item={factor} asLabel={asLabel} filterItems={filterItems} onSelect={onSelect}/>;
};