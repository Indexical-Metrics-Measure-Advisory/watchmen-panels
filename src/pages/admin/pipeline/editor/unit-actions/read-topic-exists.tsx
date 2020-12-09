import React from 'react';
import { UnitAction, UnitActionExists } from '../../../../../services/admin/pipeline-types';
import { TopicFinder } from '../components/topic-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const ReadTopicExists = (props: { action: UnitAction }) => {
	const { action } = props;
	const read = action as UnitActionExists;

	return <ActionBody2Columns>
		<ActionBodyItemLabel>Exists In:</ActionBodyItemLabel>
		<TopicFinder holder={read}/>
	</ActionBody2Columns>;
};