import React, { useReducer } from 'react';
import { UnitAction, UnitActionAlarm, UnitActionAlarmGrade } from '../../../../../services/admin/pipeline-types';
import { HorizontalOptions } from '../components/horizontal-options';
import { ActionBody } from './action-body';

const asDisplayGrade = (grade: UnitActionAlarmGrade): string => {
	return grade.split('-').map(word => {
		if ([ 'or', 'and', 'to', 'from' ].includes(word)) {
			return word;
		} else {
			return word.substr(0, 1).toUpperCase() + word.substr(1);
		}
	}).join(' ');
};

export const Alarm = (props: { action: UnitAction }) => {
	const { action } = props;
	const alarm = action as UnitActionAlarm;
	const { grade } = alarm;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const onGradeChanged = (grade: UnitActionAlarmGrade) => {
		alarm.grade = grade;
		forceUpdate();
	};

	return <ActionBody>
		<HorizontalOptions label={asDisplayGrade(grade)}
		                   options={Object.values(UnitActionAlarmGrade).filter(candidate => candidate !== grade)}
		                   toLabel={(grade) => asDisplayGrade(grade)}
		                   onSelect={onGradeChanged}/>
	</ActionBody>;
};