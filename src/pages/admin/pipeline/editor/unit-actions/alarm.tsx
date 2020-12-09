import React, { useReducer } from 'react';
import styled from 'styled-components';
import { UnitAction, UnitActionAlarm, UnitActionAlarmSeverity } from '../../../../../services/admin/pipeline-types';
import { ActionInput } from '../components/action-input';
import { HorizontalOptions } from '../components/horizontal-options';
import { ActionBody, ActionBodyItemLabel } from './action-body';

const AlarmActionBody = styled(ActionBody)`
	grid-template-columns: auto 1fr;
	grid-column-gap: calc(var(--margin) / 2);
`;

const asDisplaySeverity = (severity: UnitActionAlarmSeverity): string => {
	return severity.split('-').map(word => {
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
	const { severity, message = '' } = alarm;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const onSeverityChanged = (severity: UnitActionAlarmSeverity) => {
		alarm.severity = severity;
		forceUpdate();
	};
	const onMessageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		alarm.message = event.target.value;
		forceUpdate();
	};

	return <AlarmActionBody>
		<ActionBodyItemLabel>Severity:</ActionBodyItemLabel>
		<HorizontalOptions label={asDisplaySeverity(severity)}
		                   options={Object.values(UnitActionAlarmSeverity).filter(candidate => candidate !== severity)}
		                   toLabel={(severity) => asDisplaySeverity(severity)}
		                   onSelect={onSeverityChanged}/>
		<ActionBodyItemLabel>Message:</ActionBodyItemLabel>
		<ActionInput value={message} onChange={onMessageChanged}/>
	</AlarmActionBody>;
};