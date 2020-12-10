import { QueriedFactorForPipeline, QueriedTopicForPipeline } from '../../../../../services/admin/types';

export interface FilteredTopic {
	item: QueriedTopicForPipeline;
	parts: Array<string>;
}

export interface FilteredFactor {
	item: QueriedFactorForPipeline;
	parts: Array<string>;
}
