import React from 'react';
import { UnitAction, UnitActionMergeRow } from '../../../../../services/admin/pipeline-types';
import { TopicFinder } from '../components/topic-finder';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';
import { TopicMapper } from './topic-mapper';
import { TopicRowMatcher } from './topic-row-matcher';

export const WriteTopicMergeRow = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionMergeRow;

	const { firePropertyChange } = usePipelineUnitActionContext();

	return <ActionBody2Columns>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<TopicFinder holder={write} onChange={() => firePropertyChange(PipelineUnitActionEvent.TOPIC_CHANGED)}/>
		<ActionBodyItemLabel>On:</ActionBodyItemLabel>
		<TopicRowMatcher holder={write}/>
		<ActionBodyItemLabel>Use:</ActionBodyItemLabel>
		<TopicMapper holder={write}/>
	</ActionBody2Columns>;
};