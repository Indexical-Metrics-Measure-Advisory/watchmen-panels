import React from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { UnitAction, UnitActionReadRow } from '../../../../../services/admin/pipeline-types';
import { ActionInput } from '../components/action-input';
import { TopicFilter } from '../components/topic-filter';
import { TopicFinder } from '../components/topic-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const ReadTopicFindRow = (props: { action: UnitAction }) => {
	const { action } = props;
	const read = action as UnitActionReadRow;

	const forceUpdate = useForceUpdate();
	const onTargetNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		read.targetName = event.target.value;
		forceUpdate();
	};

	return <ActionBody2Columns>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<TopicFinder holder={read}/>
		<ActionBodyItemLabel>By:</ActionBodyItemLabel>
		<TopicFilter holder={read}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<ActionInput value={read.targetName || ''} onChange={onTargetNameChanged}
		             placeholder='Variable name...'/>
	</ActionBody2Columns>;
};