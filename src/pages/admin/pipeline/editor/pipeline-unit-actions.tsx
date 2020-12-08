import { ReactNode } from 'react';
import {
	ReadTopicActionType,
	SystemActionType,
	UnitAction,
	UnitActionType,
	WriteTopicActionType
} from '../../../../services/admin/pipeline-types';
import { WriteFactor } from './unit-actions/write-factor';

export type UnitActionReactNode = (props: { action: UnitAction }) => ReactNode;

export const UnitActionNodes: { [key in UnitActionType]: UnitActionReactNode | undefined } = {
	[WriteTopicActionType.INSERT_ROW]: undefined,
	[WriteTopicActionType.MERGE_ROW]: undefined,
	[WriteTopicActionType.INSERT_OR_MERGE_ROW]: undefined,
	[WriteTopicActionType.WRITE_FACTOR]: WriteFactor,

	[ReadTopicActionType.FIND_ROW]: undefined,
	[ReadTopicActionType.EXISTS]: undefined,

	[SystemActionType.ALARM]: undefined
};
