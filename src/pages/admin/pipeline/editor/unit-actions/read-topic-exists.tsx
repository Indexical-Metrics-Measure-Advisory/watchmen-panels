import React from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { UnitAction, UnitActionExists } from '../../../../../services/admin/pipeline-types';
import { ActionInput } from '../components/action-input';
import { TopicFinder } from '../components/topic-finder';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';
import { TopicRowMatcher } from './topic-row-matcher';

export const ReadTopicExists = (props: { action: UnitAction }) => {
	const { action } = props;
	const read = action as UnitActionExists;

	const { firePropertyChange } = usePipelineUnitActionContext();
	const forceUpdate = useForceUpdate();
	const onTargetNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		read.targetName = event.target.value;
		firePropertyChange(PipelineUnitActionEvent.VARIABLE_CHANGED);
		forceUpdate();
	};

	return <ActionBody2Columns>
		<ActionBodyItemLabel>Exists In:</ActionBodyItemLabel>
		<TopicFinder holder={read} onChange={() => firePropertyChange(PipelineUnitActionEvent.TOPIC_CHANGED)}/>
		<ActionBodyItemLabel>By:</ActionBodyItemLabel>
		<TopicRowMatcher holder={read}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<ActionInput value={read.targetName || ''} onChange={onTargetNameChanged}
		             placeholder='Variable name...'/>
	</ActionBody2Columns>;
};