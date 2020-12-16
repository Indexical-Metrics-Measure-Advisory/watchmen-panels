import React from 'react';
import { UnitAction, UnitActionInsertRow } from '../../../../../services/admin/pipeline-types';
import { TopicFinder } from '../components/topic-finder';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';
import { TopicMapper } from './topic-mapper';

export const WriteTopicInsertRow = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionInsertRow;

	const { firePropertyChange } = usePipelineUnitActionContext();

	return <ActionBody2Columns>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<TopicFinder holder={write} onChange={() => firePropertyChange(PipelineUnitActionEvent.TOPIC_CHANGED)}/>
		<ActionBodyItemLabel>Use:</ActionBodyItemLabel>
		<TopicMapper holder={write}/>
	</ActionBody2Columns>;
};