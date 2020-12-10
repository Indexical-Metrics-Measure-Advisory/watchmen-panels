import React, { useReducer } from 'react';
import { UnitAction, UnitActionReadFactor } from '../../../../../services/admin/pipeline-types';
import { ActionInput } from '../components/action-input';
import { TopicFactorFinder } from '../components/topic-factor-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const ReadTopicFindFactor = (props: { action: UnitAction }) => {
	const { action } = props;
	const read = action as UnitActionReadFactor;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const onTargetNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		read.targetName = event.target.value;
		forceUpdate();
	};

	return <ActionBody2Columns>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<TopicFactorFinder holder={read}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<ActionInput value={read.targetName || ''} onChange={onTargetNameChanged}
		             placeholder='Variable name...'/>
	</ActionBody2Columns>;
};