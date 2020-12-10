import { ReactNode } from 'react';
import {
	ReadTopicActionType,
	SystemActionType,
	UnitAction,
	UnitActionType,
	WriteTopicActionType
} from '../../../../services/admin/pipeline-types';
import { Alarm } from './unit-actions/alarm';
import { ReadTopicExists } from './unit-actions/read-topic-exists';
import { ReadTopicFindFactor } from './unit-actions/read-topic-find-factor';
import { ReadTopicFindRow } from './unit-actions/read-topic-find-row';
import { WriteFactor } from './unit-actions/write-factor';
import { WriteToMemory } from './unit-actions/write-to-memory';
import { WriteTopicInsertRow } from './unit-actions/write-topic-insert-row';
import { WriteTopicMergeRow } from './unit-actions/write-topic-merge-row';

export type UnitActionReactNode = (props: { action: UnitAction }) => ReactNode;

export const UnitActionNodes: { [key in UnitActionType]: UnitActionReactNode | undefined } = {
	[WriteTopicActionType.INSERT_ROW]: WriteTopicInsertRow,
	[WriteTopicActionType.MERGE_ROW]: WriteTopicMergeRow,
	[WriteTopicActionType.INSERT_OR_MERGE_ROW]: WriteTopicMergeRow,
	[WriteTopicActionType.WRITE_FACTOR]: WriteFactor,

	[ReadTopicActionType.READ_ROW]: ReadTopicFindRow,
	[ReadTopicActionType.READ_FACTOR]: ReadTopicFindFactor,
	[ReadTopicActionType.EXISTS]: ReadTopicExists,

	[SystemActionType.COPY_TO_MEMORY]: WriteToMemory,
	[SystemActionType.ALARM]: Alarm
};
