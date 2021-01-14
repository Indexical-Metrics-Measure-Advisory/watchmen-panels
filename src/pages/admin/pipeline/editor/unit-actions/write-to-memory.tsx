import React from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { UnitAction, UnitActionCopyToMemory } from '../../../../../services/admin/pipeline-types';
import { ActionInput } from '../components/action-input';
import { FacterValueFinder } from '../components/facter-value-finder';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const WriteToMemory = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionCopyToMemory;

	const { firePropertyChange } = usePipelineUnitActionContext();
	const forceUpdate = useForceUpdate();
	const onTopicChange = () => firePropertyChange(PipelineUnitActionEvent.TOPIC_CHANGED);
	const onFactorChange = () => firePropertyChange(PipelineUnitActionEvent.FACTOR_CHANGED);
	const onVariableChange = () => firePropertyChange(PipelineUnitActionEvent.VARIABLE_CHANGED);
	const onArithmeticChange = () => firePropertyChange(PipelineUnitActionEvent.ARITHMETIC_CHANGED);
	const onTargetNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		write.targetName = event.target.value;
		firePropertyChange(PipelineUnitActionEvent.VARIABLE_CHANGED);
		forceUpdate();
	};

	return <ActionBody2Columns>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<FacterValueFinder holder={write.value}
		                   onTopicChange={onTopicChange} onFactorChange={onFactorChange}
		                   onVariableChange={onVariableChange} onArithmeticChange={onArithmeticChange}
		                   aggregate={false}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<ActionInput value={write.targetName || ''} onChange={onTargetNameChanged}
		             placeholder='Variable name...'/>
	</ActionBody2Columns>;
};