import React, { useReducer } from 'react';
import styled from 'styled-components';
import { Pipeline, PipelineTriggerType } from '../../../../services/admin/pipeline-types';
import { HorizontalOptions } from './horizontal-options';

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
`;

const TriggerTypeOptions: { [key in PipelineTriggerType]: string } = {
	[PipelineTriggerType.INSERT]: 'Insert',
	[PipelineTriggerType.MERGE]: 'Merge',
	[PipelineTriggerType.INSERT_OR_MERGE]: 'Insert or Merge',
	[PipelineTriggerType.DELETE]: 'Delete'
};

export const PipelineTrigger = (props: { pipeline: Pipeline }) => {
	const { pipeline } = props;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const onTypeChanged = (newType: PipelineTriggerType) => {
		// TODO pipeline type changed, notify & save?
		pipeline.type = newType;
		forceUpdate();
	};

	return <Trigger>
		<div>Trigger On:</div>
		<HorizontalOptions label={TriggerTypeOptions[pipeline.type]}
		                   options={Object.values(PipelineTriggerType).filter(type => type !== pipeline.type)}
		                   toLabel={(type) => TriggerTypeOptions[type as PipelineTriggerType]}
		                   onSelect={onTypeChanged}/>
	</Trigger>;
};