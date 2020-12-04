import { Pipeline } from '../../../services/admin/pipeline-types';

export interface WellKnownPipeline extends Pipeline {
	targetTopicIds: Array<string>;
	origin: Pipeline;
}

export interface ArrangedPipelines {
	starts: Map<string, Array<WellKnownPipeline>>;
	ends: Map<string, Array<WellKnownPipeline>>;
}

