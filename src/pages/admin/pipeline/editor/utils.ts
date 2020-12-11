import { v4 } from 'uuid';
import { SystemActionType, UnitActionAlarmSeverity } from '../../../../services/admin/pipeline-types';
import { ArrangedProcessUnit, ArrangedStage, ArrangedUnitAction } from '../types';

export const createStage = (): ArrangedStage => {
	return {
		uuid: v4(),
		name: '',
		units: [ createAlarmUnit() ]
	};
};

export const createAlarmUnit = (): ArrangedProcessUnit => {
	return {
		uuid: v4(),
		do: [ createAlarmAction() ]
	};
};

export const createAlarmAction = (): ArrangedUnitAction => {
	return {
		uuid: v4(),
		type: SystemActionType.ALARM,
		severity: UnitActionAlarmSeverity.MEDIUM
	} as ArrangedUnitAction;
};