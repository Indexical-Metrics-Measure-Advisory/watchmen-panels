import { ReactNode } from 'react';
import {
	ReadTopicActionType,
	SystemActionType,
	UnitAction,
	UnitActionType,
	WriteTopicActionType
} from '../../../../services/admin/pipeline-types';
import { Alarm } from './unit-actions/alarm';
import { WriteFactor } from './unit-actions/write-factor';
import { WriteTopicInsertRow } from './unit-actions/write-topic-insert-row';

export type UnitActionReactNode = (props: { action: UnitAction }) => ReactNode;

export const UnitActionNodes: { [key in UnitActionType]: UnitActionReactNode | undefined } = {
	[WriteTopicActionType.INSERT_ROW]: WriteTopicInsertRow,
	[WriteTopicActionType.MERGE_ROW]: undefined,
	[WriteTopicActionType.INSERT_OR_MERGE_ROW]: undefined,
	[WriteTopicActionType.WRITE_FACTOR]: WriteFactor,

	[ReadTopicActionType.FIND_ROW]: undefined,
	[ReadTopicActionType.EXISTS]: undefined,

	[SystemActionType.COPY_TO_MEMORY]: undefined,
	[SystemActionType.ALARM]: Alarm
};
