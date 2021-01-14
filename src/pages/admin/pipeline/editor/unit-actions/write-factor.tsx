import React from 'react';
import { UnitAction, UnitActionWriteFactor } from '../../../../../services/admin/pipeline-types';
import { FacterValueFinder } from '../components/facter-value-finder';
import { TopicFactorFinder } from '../components/topic-factor-finder';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';
import { TopicRowMatcher } from './topic-row-matcher';

export const WriteFactor = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionWriteFactor;

	const { firePropertyChange } = usePipelineUnitActionContext();
	const onTopicChange = () => firePropertyChange(PipelineUnitActionEvent.TOPIC_CHANGED);
	const onFactorChange = () => firePropertyChange(PipelineUnitActionEvent.FACTOR_CHANGED);
	const onVariableChange = () => firePropertyChange(PipelineUnitActionEvent.VARIABLE_CHANGED);
	const onArithmeticChange = () => firePropertyChange(PipelineUnitActionEvent.ARITHMETIC_CHANGED);

	return <ActionBody2Columns>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<FacterValueFinder holder={write.value}
		                   onTopicChange={onTopicChange} onFactorChange={onFactorChange}
		                   onVariableChange={onVariableChange} onArithmeticChange={onArithmeticChange}
		                   aggregate={true}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<TopicFactorFinder holder={write} onTopicChange={onTopicChange} onFactorChange={onFactorChange}/>
		<ActionBodyItemLabel>On:</ActionBodyItemLabel>
		<TopicRowMatcher holder={write}/>
	</ActionBody2Columns>;
};