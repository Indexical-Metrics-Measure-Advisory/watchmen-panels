import React from 'react';
import { UnitAction, UnitActionWriteFactor } from '../../../../../services/admin/pipeline-types';
import { ActionBody } from './action-body';

export const WriteFactor = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionWriteFactor;

	console.log(write);

	return <ActionBody>
	</ActionBody>;
};