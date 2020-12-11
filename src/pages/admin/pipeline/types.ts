import { Pipeline, ProcessUnit, Stage, UnitAction } from '../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../services/admin/types';

export interface ArrangedPipeline extends Pipeline {
	targetTopicIds: Array<string>;
	origin: Pipeline;
	uuid: string;

	stages: Array<ArrangedStage>;
}

export interface ArrangedStage extends Stage {
	uuid: string;
	units: Array<ArrangedProcessUnit>
}

export interface ArrangedProcessUnit extends ProcessUnit {
	uuid: string;
	do: Array<ArrangedUnitAction>;
}

export interface ArrangedUnitAction extends UnitAction {
	uuid: string;
}

export interface ArrangedPipelines {
	starts: Map<string, Array<ArrangedPipeline>>;
	ends: Map<string, Array<ArrangedPipeline>>;
}

export interface PipelinesTopicNode {
	topic: QueriedTopicForPipeline;
	toMe?: Array<ArrangedPipeline>;
	fromMe?: Array<ArrangedPipeline>;
	toNext?: ArrangedPipeline;
	previous?: QueriedTopicForPipeline;
	next?: QueriedTopicForPipeline;
	current?: boolean;
}