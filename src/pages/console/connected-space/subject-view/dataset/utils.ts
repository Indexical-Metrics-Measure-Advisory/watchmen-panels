import {
	ConsoleSpaceSubjectDataSetFilter,
	ConsoleSpaceSubjectDataSetFilterExpression,
	ConsoleSpaceSubjectDataSetFilterJoint
} from '../../../../../services/console/types';

export const isJointFilter = (filter: ConsoleSpaceSubjectDataSetFilter): filter is ConsoleSpaceSubjectDataSetFilterJoint => !!(filter as any).jointType;
export const isExpressionFilter = (filter: ConsoleSpaceSubjectDataSetFilter): filter is ConsoleSpaceSubjectDataSetFilterExpression => !(filter as any).jointType;
