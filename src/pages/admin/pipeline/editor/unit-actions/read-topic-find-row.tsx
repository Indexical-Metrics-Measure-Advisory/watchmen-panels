import React from 'react';
import { UnitAction, UnitActionReadRow } from '../../../../../services/admin/pipeline-types';
import { TopicFinder } from '../components/topic-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const ReadTopicFindRow = (props: { action: UnitAction }) => {
	const { action } = props;
	const read = action as UnitActionReadRow;

	return <ActionBody2Columns>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<TopicFinder holder={read}/>
	</ActionBody2Columns>;
};