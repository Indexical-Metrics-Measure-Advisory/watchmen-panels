import React, { Fragment, useReducer, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { ProcessUnit, UnitAction } from '../../../../services/admin/pipeline-types';
import { HorizontalOptions } from './components/horizontal-options';
import { UnitActionNodes } from './pipeline-unit-actions';
import { ActionLead } from './unit-actions/action-lead';
import { ActionSelect } from './unit-actions/action-select';

const UnitContainer = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	font-size: 0.8em;
	&:before {
		content: '';
		display: block;
		position: absolute;
		left: calc(var(--margin) / 2);
		bottom: 0;
		width: calc(100% - var(--margin));
		height: 1px;
		border-bottom: 1px dashed var(--border-color);
		z-index: -1;
	}
`;
const UnitSection = styled.div`
	display: grid;
	grid-template-columns: 120px 1fr;
	padding: 0 calc(var(--margin) / 2);
`;
const UnitSectionLabel = styled.div`
	white-space: nowrap;
	font-weight: var(--font-demi-bold);
	height: 32px;
	line-height: 32px;
	align-self: start;
`;
const UnitCondition = styled(UnitSection)`
	> div:nth-child(2) {
		align-self: center;
	}
`;
const UnitActions = styled(UnitSection)`
	> div:nth-child(2n) {
		display: flex;
		flex-direction: column;
		> div:first-child {
			margin: 4px 0;
		}
		> div[data-role='action-not-impl'] {
			height: 32px;
			line-height: 32px;
			font-family: var(--console-title-font-family);
			opacity: 0.5;
		}
	}
`;

const UnitActionNode = (props: { action: UnitAction }) => {
	const { action } = props;
	const { type } = action;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const UnitNode = UnitActionNodes[type];

	return <Fragment>
		<ActionLead/>
		<div>
			<ActionSelect action={action} onTypeChanged={forceUpdate}/>
			{
				// @ts-ignore
				UnitNode ? <UnitNode action={action} key={v4()}/> :
					<div key={v4()} data-role='action-not-impl'>[{type}] Not implemented yet</div>
			}
		</div>
	</Fragment>;
};

export const PipelineUnit = (props: { unit: ProcessUnit }) => {
	const { unit } = props;

	const [ conditional, setConditional ] = useState(!!unit.on);
	const toLabel = (withCondition: boolean) => withCondition ? 'Conditional' : 'Anyway';
	const onTypeChanged = (withCondition: boolean) => setConditional(withCondition);

	const conditionLabel = toLabel(conditional);

	return <UnitContainer>
		<UnitCondition>
			<UnitSectionLabel>When:</UnitSectionLabel>
			<HorizontalOptions label={conditionLabel}
			                   options={[ !conditional ]} toLabel={toLabel}
			                   onSelect={onTypeChanged}/>
		</UnitCondition>
		<UnitActions>
			{unit.do.map(action => <UnitActionNode action={action} key={v4()}/>)}
		</UnitActions>
	</UnitContainer>;
};