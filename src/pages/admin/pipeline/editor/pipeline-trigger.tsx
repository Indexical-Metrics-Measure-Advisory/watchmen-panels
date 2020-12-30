import React from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../common/utils';
import { Pipeline, PipelineTriggerType } from '../../../../services/admin/pipeline-types';
import { TopicType } from '../../../../services/admin/types';
import { usePipelineContext } from '../pipeline-context';
import { HorizontalOptions } from './components/horizontal-options';

const Trigger = styled.div`
	display: grid;
	grid-template-columns: 120px 1fr;
	align-items: center;
	padding: 0 calc(var(--margin) / 2);
	height: 36px;
	font-size: 0.8em;
	> div:first-child {
		white-space: nowrap;
		font-weight: var(--font-demi-bold);
	}
	> div:nth-child(2) {
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
	}
`;

const TriggerTypeOptions: { [key in PipelineTriggerType]: string } = {
	[PipelineTriggerType.INSERT]: 'Insert',
	[PipelineTriggerType.MERGE]: 'Merge',
	[PipelineTriggerType.INSERT_OR_MERGE]: 'Insert or Merge',
	[PipelineTriggerType.DELETE]: 'Delete'
};

export const PipelineTrigger = (props: { pipeline: Pipeline }) => {
	const { pipeline } = props;

	const { store: { topics } } = usePipelineContext();

	const forceUpdate = useForceUpdate();
	const onTypeChanged = (newType: PipelineTriggerType) => {
		// TODO pipeline trigger type changed, notify & save?
		pipeline.type = newType;
		forceUpdate();
	};

	let availableTypes = Object.values(PipelineTriggerType);
	// eslint-disable-next-line
	const topic = topics.find(topic => topic.topicId == pipeline.topicId);
	if (topic?.type === TopicType.RAW) {
		availableTypes = availableTypes.filter(type => [ PipelineTriggerType.INSERT, PipelineTriggerType.DELETE ].includes(type));
	}

	return <Trigger>
		<div>Trigger On:</div>
		<HorizontalOptions label={TriggerTypeOptions[pipeline.type]}
		                   options={availableTypes.filter(type => type !== pipeline.type)}
		                   toLabel={(type) => TriggerTypeOptions[type as PipelineTriggerType]}
		                   onSelect={onTypeChanged}/>
	</Trigger>;
};