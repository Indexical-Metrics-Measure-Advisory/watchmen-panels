import React from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { UnitAction, UnitActionReadFactor } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { ActionInput } from '../components/action-input';
import { TopicFactorFinder } from '../components/topic-factor-finder';
import { TopicRowMatcher } from '../components/topic-row-matcher';
import { unitActionTypeAsDisplay } from '../utils';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const ReadTopicFindFactor = (props: { action: UnitAction }) => {
	const { action } = props;
	const read = action as UnitActionReadFactor;

	const forceUpdate = useForceUpdate();
	const onTargetNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		read.targetName = event.target.value;
		forceUpdate();
	};
	const asMatcherLabel = (topic: QueriedTopicForPipeline) => `${unitActionTypeAsDisplay(action.type)} from ${topic.name}`;

	return <ActionBody2Columns>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<TopicFactorFinder holder={read}/>
		<ActionBodyItemLabel>By:</ActionBodyItemLabel>
		<TopicRowMatcher label={asMatcherLabel} holder={read}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<ActionInput value={read.targetName || ''} onChange={onTargetNameChanged}
		             placeholder='Variable name...'/>
	</ActionBody2Columns>;
};