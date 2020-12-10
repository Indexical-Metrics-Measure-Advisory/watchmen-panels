import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faCompressArrowsAlt, faExpandArrowsAlt, faPencilRuler } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useReducer, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { ProcessUnit, UnitAction } from '../../../../services/admin/pipeline-types';
import { HorizontalOptions } from './components/horizontal-options';
import { DangerObjectButton, PrimaryObjectButton, WaiveObjectButton } from './components/object-button';
import { UnitActionNodes } from './pipeline-unit-actions';
import { ActionLead } from './unit-actions/action-lead';
import { ActionSelect } from './unit-actions/action-select';

const UnitContainer = styled.div.attrs({
	'data-widget': 'stage-units'
})`
	display: flex;
	position: relative;
	flex-direction: column;
	font-size: 0.8em;
	&:not(:first-child) {
		padding-top: calc(var(--margin) / 4);
	}
	&:not(:last-child) {
		padding-bottom: calc(var(--margin) / 4);
	}
	&:not(:last-child):before {
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
const UnitSectionLabel = styled.div.attrs({
	'data-widget': 'stage-unit-label'
})`
	white-space: nowrap;
	font-weight: var(--font-demi-bold);
	font-variant: petite-caps;
	height: 32px;
	line-height: 32px;
	align-self: start;
`;
const UnitCondition = styled(UnitSection).attrs({
	'data-widget': 'stage-unit-condition'
})`
	grid-template-columns: 120px 1fr auto;
	&[data-expanded=false] {
		> button {
			> svg {
				transform: rotateZ(180deg);
			}
		}
	}
	> div:nth-child(2) {
		align-self: center;
	}
	> button {
		align-self: center;
		> svg {
			transition: all 300ms ease-in-out;
		}
	}
`;
const UnitActions = styled(UnitSection).attrs({
	'data-widget': 'stage-unit-actions'
})`
	&[data-expanded=false] {
		display: none;
	}
	> div:nth-child(2n):not(:last-child) {
		display: grid;
		grid-template-columns: 1fr auto;
		&:hover {
			> button:nth-child(2) {
				opacity: 1;
				pointer-events: auto;
			}
		}
		> div:first-child {
			margin: 4px 0;
		}
		> div:not(:first-child) {
			grid-column: span 2;
		}
		> button:nth-child(2) {
			align-self: center;
			opacity: 0;
			pointer-events: none;
		}
		> div[data-role='action-not-impl'] {
			grid-column: span 2;
			height: 32px;
			line-height: 32px;
			font-family: var(--console-title-font-family);
			opacity: 0.5;
		}
	}
`;
const UnitButtons = styled.div.attrs({
	'data-widget': 'stage-unit-buttons'
})`
	grid-column: span 2;
	display: grid;
	grid-template-columns: 1fr auto auto;
	grid-column-gap: calc(var(--margin) / 4);
	align-items: center;
	padding: calc(var(--margin) / 4) 0;
`;

const UnitActionNode = (props: { action: UnitAction }) => {
	const { action } = props;
	const { type } = action;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const UnitNode = UnitActionNodes[type];

	return <Fragment>
		<ActionLead/>
		<div data-widget='pipeline-unit-action'>
			<ActionSelect action={action} onTypeChanged={forceUpdate}/>
			<DangerObjectButton>
				<FontAwesomeIcon icon={faTrashAlt}/>
				<span>Delete This Action</span>
			</DangerObjectButton>
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

	const [ expanded, setExpanded ] = useState(true);
	const [ conditional, setConditional ] = useState(!!unit.on);

	const toLabel = (withCondition: boolean) => withCondition ? 'Conditional' : 'Anyway';
	const onTypeChanged = (withCondition: boolean) => setConditional(withCondition);
	const onExpandClicked = () => setExpanded(!expanded);

	const conditionLabel = toLabel(conditional);

	return <UnitContainer data-expanded={expanded}>
		<UnitCondition data-expanded={expanded}>
			<UnitSectionLabel>When:</UnitSectionLabel>
			<HorizontalOptions label={conditionLabel}
			                   options={[ !conditional ]} toLabel={toLabel}
			                   onSelect={onTypeChanged}/>
			<WaiveObjectButton onClick={onExpandClicked}>
				<FontAwesomeIcon icon={expanded ? faCompressArrowsAlt : faExpandArrowsAlt}/>
				<span>{expanded ? 'Hide This Unit' : 'Show This Unit'}</span>
			</WaiveObjectButton>
		</UnitCondition>
		<UnitActions data-expanded={expanded}>
			{unit.do.map(action => <UnitActionNode action={action} key={v4()}/>)}
			<UnitButtons>
				<div/>
				<PrimaryObjectButton>
					<FontAwesomeIcon icon={faPencilRuler}/>
					<span>Append Action</span>
				</PrimaryObjectButton>
				<DangerObjectButton>
					<FontAwesomeIcon icon={faTrashAlt}/>
					<span>Delete This Unit</span>
				</DangerObjectButton>
			</UnitButtons>
		</UnitActions>
	</UnitContainer>;
};