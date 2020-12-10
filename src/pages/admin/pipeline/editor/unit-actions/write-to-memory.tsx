import React, { useReducer } from 'react';
import styled from 'styled-components';
import { UnitAction, UnitActionCopyToMemory } from '../../../../../services/admin/pipeline-types';
import { ActionInput } from '../components/action-input';
import { FacterValueFinder } from '../components/facter-value-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

const Container = styled(ActionBody2Columns)`
`;

export const WriteToMemory = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionCopyToMemory;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const onTargetNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		write.targetName = event.target.value;
		forceUpdate();
	};

	return <Container>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<FacterValueFinder holder={write}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<ActionInput value={write.targetName || ''} onChange={onTargetNameChanged}
		             placeholder='Variable name...'/>
	</Container>;
};