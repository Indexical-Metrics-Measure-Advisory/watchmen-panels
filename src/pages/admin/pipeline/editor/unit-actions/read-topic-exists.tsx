import React from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { UnitAction, UnitActionExists } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { ActionInput } from '../components/action-input';
import { TopicFinder } from '../components/topic-finder';
import { TopicRowMatcher } from '../components/topic-row-matcher';
import { unitActionTypeAsDisplay } from '../utils';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const ReadTopicExists = (props: { action: UnitAction }) => {
	const { action } = props;
	const read = action as UnitActionExists;

	const forceUpdate = useForceUpdate();
	const onTargetNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		read.targetName = event.target.value;
		forceUpdate();
	};
	const asMatcherLabel = (topic: QueriedTopicForPipeline) => `${unitActionTypeAsDisplay(action.type)} Check on ${topic.name}`;

	return <ActionBody2Columns>
		<ActionBodyItemLabel>Exists In:</ActionBodyItemLabel>
		<TopicFinder holder={read}/>
		<ActionBodyItemLabel>By:</ActionBodyItemLabel>
		<TopicRowMatcher label={asMatcherLabel} holder={read}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<ActionInput value={read.targetName || ''} onChange={onTargetNameChanged}
		             placeholder='Variable name...'/>
	</ActionBody2Columns>;
};