import { Pipeline } from '../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../services/admin/types';

export interface WellKnownPipeline extends Pipeline {
	targetTopicIds: Array<string>;
	origin: Pipeline;
}

export interface ArrangedPipelines {
	starts: Map<string, Array<WellKnownPipeline>>;
	ends: Map<string, Array<WellKnownPipeline>>;
}

export interface PipelinesTopicNode {
	topic: QueriedTopicForPipeline;
	toMe?: Array<WellKnownPipeline>;
	fromMe?: Array<WellKnownPipeline>;
	toNext?: WellKnownPipeline;
	previous?: QueriedTopicForPipeline;
	next?: QueriedTopicForPipeline;
	current?: boolean;
}