import React from 'react';
import { UnitAction, UnitActionMergeRow } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { TopicFinder } from '../components/topic-finder';
import { TopicRowMatcher } from '../components/topic-row-matcher';
import { unitActionTypeAsDisplay } from '../utils';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const WriteTopicMergeRow = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionMergeRow;

	const asMatcherLabel = (topic: QueriedTopicForPipeline) => `${unitActionTypeAsDisplay(action.type)} to ${topic.name}`;

	return <ActionBody2Columns>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<TopicFinder holder={write}/>
		<ActionBodyItemLabel>On:</ActionBodyItemLabel>
		<TopicRowMatcher label={asMatcherLabel} holder={write}/>
		<ActionBodyItemLabel>Use Mapping:</ActionBodyItemLabel>
		<div data-role='action-part-not-impl'>Not implemented yet</div>
	</ActionBody2Columns>;
};