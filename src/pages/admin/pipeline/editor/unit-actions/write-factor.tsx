import React from 'react';
import { UnitAction, UnitActionWriteFactor } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { FacterValueFinder } from '../components/facter-value-finder';
import { TopicFactorFinder } from '../components/topic-factor-finder';
import { TopicRowMatcher } from '../components/topic-row-matcher';
import { unitActionTypeAsDisplay } from '../utils';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const WriteFactor = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionWriteFactor;

	const asMatcherLabel = (topic: QueriedTopicForPipeline) => `${unitActionTypeAsDisplay(action.type)} to ${topic.name}`;

	return <ActionBody2Columns>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<FacterValueFinder holder={write}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<TopicFactorFinder holder={write}/>
		<ActionBodyItemLabel>On:</ActionBodyItemLabel>
		<TopicRowMatcher label={asMatcherLabel} holder={write}/>
	</ActionBody2Columns>;
};