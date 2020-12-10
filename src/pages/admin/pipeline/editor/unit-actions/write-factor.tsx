import React from 'react';
import styled from 'styled-components';
import { UnitAction, UnitActionWriteFactor } from '../../../../../services/admin/pipeline-types';
import { FacterValueFinder } from '../components/facter-value-finder';
import { TopicFactorFinder } from '../components/topic-factor-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

const Container = styled(ActionBody2Columns)`
	> div:nth-child(2) > div:nth-child(2) {
		flex-grow: 1;
	}
`;

export const WriteFactor = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionWriteFactor;

	return <Container>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<FacterValueFinder holder={write}/>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<TopicFactorFinder holder={write}/>
	</Container>;
};