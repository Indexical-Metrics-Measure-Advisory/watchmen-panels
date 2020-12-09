import React from 'react';
import { UnitAction, UnitActionMergeRow } from '../../../../../services/admin/pipeline-types';
import { TopicFinder } from '../components/topic-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const WriteTopicMergeRow = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionMergeRow;

	return <ActionBody2Columns>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<TopicFinder holder={write}/>
	</ActionBody2Columns>;
};