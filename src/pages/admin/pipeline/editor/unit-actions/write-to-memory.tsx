import React from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { UnitAction, UnitActionCopyToMemory } from '../../../../../services/admin/pipeline-types';
import { ActionInput } from '../components/action-input';
import { FacterValueFinder } from '../components/facter-value-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const WriteToMemory = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionCopyToMemory;

	const forceUpdate = useForceUpdate();
	const onTargetNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		write.targetName = event.target.value;
		forceUpdate();
	};

	return <ActionBody2Columns>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<FacterValueFinder holder={write}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<ActionInput value={write.targetName || ''} onChange={onTargetNameChanged}
		             placeholder='Variable name...'/>
	</ActionBody2Columns>;
};