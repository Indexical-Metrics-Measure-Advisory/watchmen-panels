import React from 'react';
import { UnitAction, UnitActionInsertRow } from '../../../../../services/admin/pipeline-types';
import { TopicFinder } from '../components/topic-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const WriteTopicInsertRow = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionInsertRow;

	return <ActionBody2Columns>
		<ActionBodyItemLabel>Target Topic:</ActionBodyItemLabel>
		<TopicFinder holder={write}/>
	</ActionBody2Columns>;
};