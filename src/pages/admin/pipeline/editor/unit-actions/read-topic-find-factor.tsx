import React from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { UnitAction, UnitActionReadFactor } from '../../../../../services/admin/pipeline-types';
import { ActionInput } from '../components/action-input';
import { TopicFactorFinder } from '../components/topic-factor-finder';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';
import { TopicRowMatcher } from './topic-row-matcher';

export const ReadTopicFindFactor = (props: { action: UnitAction }) => {
	const { action } = props;
	const read = action as UnitActionReadFactor;

	const { firePropertyChange } = usePipelineUnitActionContext();
	const forceUpdate = useForceUpdate();
	const onTargetNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		read.targetName = event.target.value;
		firePropertyChange(PipelineUnitActionEvent.VARIABLE_CHANGED);
		forceUpdate();
	};
	const onTopicChange = () => firePropertyChange(PipelineUnitActionEvent.TOPIC_CHANGED);
	const onFactorChange = () => firePropertyChange(PipelineUnitActionEvent.FACTOR_CHANGED);

	return <ActionBody2Columns>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<TopicFactorFinder holder={read} onTopicChange={onTopicChange} onFactorChange={onFactorChange}/>
		<ActionBodyItemLabel>By:</ActionBodyItemLabel>
		<TopicRowMatcher holder={read}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<ActionInput value={read.targetName || ''} onChange={onTargetNameChanged}
		             placeholder='Variable name...'/>
	</ActionBody2Columns>;
};