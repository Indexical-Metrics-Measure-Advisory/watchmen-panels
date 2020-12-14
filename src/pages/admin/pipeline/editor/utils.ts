import { v4 } from 'uuid';
import { SystemActionType, UnitActionAlarmSeverity, UnitActionType } from '../../../../services/admin/pipeline-types';
import { ArrangedProcessUnit, ArrangedStage, ArrangedUnitAction } from '../types';

export const unitActionTypeAsDisplay = (type: UnitActionType): string => {
	return type.split('-').map(word => {
		if ([ 'or', 'and', 'to', 'from' ].includes(word)) {
			return word;
		} else {
			return word.substr(0, 1).toUpperCase() + word.substr(1);
		}
	}).join(' ');
};

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