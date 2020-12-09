import React from 'react';
import { UnitAction, UnitActionWriteFactor } from '../../../../../services/admin/pipeline-types';
import { TopicFinder } from '../components/topic-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const WriteFactor = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionWriteFactor;

	return <ActionBody2Columns>
		<ActionBodyItemLabel>Target Topic:</ActionBodyItemLabel>
		<TopicFinder holder={write}/>
	</ActionBody2Columns>;
};