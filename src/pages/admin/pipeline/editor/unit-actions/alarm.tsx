import React from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { UnitAction, UnitActionAlarm, UnitActionAlarmSeverity } from '../../../../../services/admin/pipeline-types';
import { ActionInput } from '../components/action-input';
import { HorizontalOptions } from '../components/horizontal-options';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

const AlarmContainer = styled(ActionBody2Columns)`
	> div:nth-child(2) {
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
	}
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

	const { firePropertyChange } = usePipelineUnitActionContext();
	const forceUpdate = useForceUpdate();
	const onSeverityChanged = (severity: UnitActionAlarmSeverity) => {
		alarm.severity = severity;
		firePropertyChange(PipelineUnitActionEvent.VARIABLE_CHANGED);
		forceUpdate();
	};
	const onMessageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		alarm.message = event.target.value;
		firePropertyChange(PipelineUnitActionEvent.VARIABLE_CHANGED);
		forceUpdate();
	};

	return <AlarmContainer>
		<ActionBodyItemLabel>Severity:</ActionBodyItemLabel>
		<HorizontalOptions label={asDisplaySeverity(severity)}
		                   options={Object.values(UnitActionAlarmSeverity).filter(candidate => candidate !== severity)}
		                   toLabel={(severity) => asDisplaySeverity(severity)}
		                   onSelect={onSeverityChanged}/>
		<ActionBodyItemLabel>Message:</ActionBodyItemLabel>
		<ActionInput value={message} onChange={onMessageChanged}/>
	</AlarmContainer>;
};