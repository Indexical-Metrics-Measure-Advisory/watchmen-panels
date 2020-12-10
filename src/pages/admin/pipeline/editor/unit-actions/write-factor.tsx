import React from 'react';
import { UnitAction, UnitActionWriteFactor } from '../../../../../services/admin/pipeline-types';
import { FacterValueFinder } from '../components/facter-value-finder';
import { TopicFactorFinder } from '../components/topic-factor-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

export const WriteFactor = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionWriteFactor;

	return <ActionBody2Columns>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<FacterValueFinder holder={write}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<TopicFactorFinder holder={write}/>
		<ActionBodyItemLabel>On:</ActionBodyItemLabel>
		<div data-role='action-part-not-impl'>Not implemented yet</div>
	</ActionBody2Columns>;
};