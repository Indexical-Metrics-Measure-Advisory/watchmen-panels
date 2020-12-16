import {
	CompositeCondition,
	Condition,
	FactorValue,
	InMemoryValue,
	PlainCondition,
	SomeValue,
	SomeValueType
} from '../../../../../services/admin/pipeline-types';
import { QueriedFactorForPipeline, QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { FilteredFactor, FilteredTopic } from './types';

const filterByText = <X extends any, Y extends any>(all: Array<Y>, text: string, asLabel: (x: Y) => string): Array<X> => {
	return all.map(item => {
		const label = asLabel(item);
		const segments = label.toUpperCase().split(text);
		if (segments.length === 1) {
			return null;
		} else {
			const length = text.length;
			const count = segments.length;
			let pos = 0;
			return {
				item,
				name: label.toUpperCase(),
				parts: segments.reduce((all, segment, index) => {
					const len = segment.length;
					all.push(label.substr(pos, len));
					pos += len;
					if (index !== count - 1) {
						all.push(label.substr(pos, length));
						pos += length;
					}
					return all;
				}, [] as Array<string>)
			};
		}
	})
		.filter(x => x)
		.sort((a, b) => {
			if (!a || !b) {
				return -1;
			} else {
				return a.name.localeCompare(b.name);
			}
		}) as Array<X>;
};

export const filterTopic = (topics: Array<QueriedTopicForPipeline>, text: string): Array<FilteredTopic> => {
	text = text.trim();
	if (!text) {
		return topics.map(topic => ({ item: topic, parts: [ topic.name ] }));
	} else {
		return filterByText(topics, text.toUpperCase(), (topic: QueriedTopicForPipeline) => topic.name);
	}
};

export const filterFactor = (factors: Array<QueriedFactorForPipeline>, text: string): Array<FilteredFactor> => {
	text = text.trim();
	if (!text) {
		return factors.map(factor => {
			return {
				item: factor,
				parts: [ factor.label ]
			};
		}).sort((a, b) => {
			return a.parts[0].localeCompare(b.parts[0]);
		});
	} else {
		return filterByText(factors, text.toUpperCase(), (factor: QueriedFactorForPipeline) => factor.label);
	}
};

export const isCompositeCondition = (condition: Condition): condition is CompositeCondition => !!(condition as any).mode;
export const isPlainCondition = (condition: Condition): condition is PlainCondition => !isCompositeCondition(condition);
export const computeConditionLines = (condition: CompositeCondition): number => {
	if (condition.children.length === 0) {
		// me and no child line
		return 2;
	}
	return condition.children.reduce((count: number, child) => {
		if (isPlainCondition(child)) {
			count += 1;
		} else if (isCompositeCondition(child)) {
			count += computeConditionLines(child);
		}
		return count;
	}, 1);
};
/**
 * only plain conditions are counted
 */
export const computeConditionCount = (condition: CompositeCondition): number => {
	return condition.children.reduce((count: number, child) => {
		if (isPlainCondition(child)) {
			count += 1;
		} else if (isCompositeCondition(child)) {
			count += computeConditionCount(child);
		}
		return count;
	}, 0);
};

export const isFactorValue = (value: SomeValue): value is FactorValue => value.type === SomeValueType.FACTOR;
export const isMemoryValue = (value: SomeValue): value is InMemoryValue => value.type === SomeValueType.IN_MEMORY;