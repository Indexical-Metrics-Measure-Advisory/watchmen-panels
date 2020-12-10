import React from 'react';
import { UnitAction, UnitActionInsertRow } from '../../../../../services/admin/pipeline-types';
import { TopicFinder } from '../components/topic-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const WriteTopicInsertRow = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionInsertRow;

	return <ActionBody2Columns>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<TopicFinder holder={write}/>
		<ActionBodyItemLabel>Use Mapping:</ActionBodyItemLabel>
		<div data-role='action-part-not-impl'>Not implemented yet</div>
	</ActionBody2Columns>;
};