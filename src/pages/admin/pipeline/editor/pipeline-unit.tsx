import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {
	faCompressArrowsAlt,
	faEraser,
	faExpandArrowsAlt,
	faMicrochip,
	faPencilRuler
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useReducer, useState } from 'react';
import styled from 'styled-components';
import Button, { ButtonType } from '../../../component/button';
import { DialogContext, useDialog } from '../../../context/dialog';
import { ArrangedProcessUnit, ArrangedStage, ArrangedUnitAction } from '../types';
import { HorizontalOptions } from './components/horizontal-options';
import { DangerObjectButton, DropdownButton, PrimaryObjectButton, WaiveObjectButton } from './components/object-button';
import { UnitActionNodes } from './pipeline-unit-actions';
import { ActionLead } from './unit-actions/action-lead';
import { ActionSelect } from './unit-actions/action-select';
import { createAlarmAction } from './utils';

const UnitContainer = styled.div.attrs({
	'data-widget': 'stage-unit'
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
	&:first-child:after {
		top: 0;
		height: 100%;
	}
	&:after {
		content: '';
		display: block;
		position: absolute;
		top: 8px;
		left: 0;
		width: var(--margin);
		height: calc(100% - 8px);
		background-color: var(--console-favorite-color);
		border-top-right-radius: calc(var(--margin) / 4);
		border-bottom-right-radius: var(--margin);
		opacity: 0;
		z-index: -1;
		transition: all 300ms ease-in-out;
	}
	&:hover {
		div[data-widget='stage-unit-label'] {
			background-color: var(--bg-color);
			border-radius: var(--border-radius);
			margin-left: calc(var(--margin) / -4);
			padding-left: calc(var(--margin) / 4);
		}
		:after {
			opacity: 0.4;
		}
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
	height: 24px;
	line-height: 24px;
	margin-top: 4px;
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
		div[data-role='action-part-not-impl'],
		div[data-role='action-not-impl'] {
			height: 32px;
			line-height: 32px;
			font-family: var(--console-title-font-family);
			opacity: 0.5;
		}
		div[data-role='action-not-impl'] {
			grid-column: span 2;
		}
	}
`;
const UnitButtons = styled.div.attrs({
	'data-widget': 'stage-unit-buttons'
})`
	grid-column: span 2;
	display: grid;
	grid-template-columns: 1fr auto auto auto;
	grid-column-gap: calc(var(--margin) / 4);
	align-items: center;
	padding: calc(var(--margin) / 4) 0;
`;

const UnitActionNode = (props: {
	unit: ArrangedProcessUnit;
	action: ArrangedUnitAction;
	deleteAction: (action: ArrangedUnitAction) => void;
}) => {
	const { unit, action, deleteAction } = props;
	const { type } = action;

	const dialog = useDialog();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onActionDeleteConfirmClicked = () => {
		deleteAction(action);
		dialog.hide();
	};
	const onClearSettingsConfirmClicked = () => {
		unit.do.length = 0;
		unit.do.push(createAlarmAction());
		dialog.hide();
	};
	const onDeleteActionClicked = () => {
		if (unit.do.length !== 1) {
			dialog.show(
				<div data-widget='dialog-console-delete'>
					<span>Are you sure to delete this action?</span>
				</div>,
				buildDialogButtons(dialog, onActionDeleteConfirmClicked)
			);
		} else {
			dialog.show(
				<div data-widget='dialog-console-delete'>
					<span>This is the last one in process unit, are you sure to clear all settings?</span>
				</div>,
				buildDialogButtons(dialog, onClearSettingsConfirmClicked)
			);
		}
	};

	const UnitNode = UnitActionNodes[type];

	return <Fragment>
		<ActionLead/>
		<div data-widget='pipeline-unit-action'>
			<ActionSelect action={action} onTypeChanged={forceUpdate}/>
			<DangerObjectButton onClick={onDeleteActionClicked}>
				<FontAwesomeIcon icon={faTrashAlt}/>
				<span>Delete This Action</span>
			</DangerObjectButton>
			{
				UnitNode
					// @ts-ignore
					? <UnitNode action={action}/>
					: <div data-role='action-not-impl'>[{type}] Not implemented yet</div>
			}
		</div>
	</Fragment>;
};

const buildDialogButtons = (dialog: DialogContext, onConfirm: () => void) => {
	return <Fragment>
		<div style={{ flexGrow: 1 }}/>
		<Button inkType={ButtonType.PRIMARY} onClick={onConfirm}>Yes</Button>
		<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
	</Fragment>;
};

export const PipelineUnit = (props: {
	stage: ArrangedStage;
	unit: ArrangedProcessUnit;
	appendUnit: () => void;
	prependUnit: (on: ArrangedProcessUnit) => void;
	deleteUnit: (unit: ArrangedProcessUnit) => void;
}) => {
	const { stage, unit, appendUnit, prependUnit, deleteUnit } = props;

	const dialog = useDialog();
	const [ expanded, setExpanded ] = useState(true);
	const [ conditional, setConditional ] = useState(!!unit.on);
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const toLabel = (withCondition: boolean) => withCondition ? 'Conditional' : 'Anyway';
	const onTypeChanged = (withCondition: boolean) => setConditional(withCondition);
	const onExpandClicked = () => setExpanded(!expanded);
	const onDeleteAction = (action: ArrangedUnitAction) => {
		const index = unit.do.findIndex(exists => exists === action);
		if (index !== -1) {
			unit.do.splice(index, 1);
			forceUpdate();
		}
	};
	const onAppendActionClicked = () => {
		unit.do.push(createAlarmAction());
		forceUpdate();
	};
	const onUnitDeleteConfirmClicked = () => {
		deleteUnit(unit);
		dialog.hide();
	};
	const onClearActionsConfirmClicked = () => {
		unit.do = [ createAlarmAction() ];
		dialog.hide();
	};
	const onUnitDeleteClicked = () => {
		if (stage.units.length !== 1) {
			dialog.show(
				<div data-widget='dialog-console-delete'>
					<span>Are you sure to delete this unit?</span>
				</div>,
				buildDialogButtons(dialog, onUnitDeleteConfirmClicked)
			);
		} else {
			dialog.show(
				<div data-widget='dialog-console-delete'>
					<span>This is the last one in stage, are you sure to clear all actions?</span>
				</div>,
				buildDialogButtons(dialog, onClearActionsConfirmClicked)
			);
		}
	};
	const onClearActionsClicked = () => {
		dialog.show(
			<div data-widget='dialog-console-delete'>
				<span>Are you sure to clear all actions?</span>
			</div>,
			buildDialogButtons(dialog, onClearActionsConfirmClicked)
		);
	};

	const conditionLabel = toLabel(conditional);

	return <UnitContainer data-expanded={expanded}>
		<UnitCondition data-expanded={expanded}>
			<UnitSectionLabel>When:</UnitSectionLabel>
			<HorizontalOptions label={conditionLabel}
			                   options={[ !conditional ]} toLabel={toLabel}
			                   onSelect={onTypeChanged}/>
			<WaiveObjectButton onClick={onExpandClicked}>
				<FontAwesomeIcon icon={expanded ? faCompressArrowsAlt : faExpandArrowsAlt}/>
				<span>{expanded ? 'Hide This Process Unit' : 'Show This Process Unit'}</span>
			</WaiveObjectButton>
		</UnitCondition>
		<UnitActions data-expanded={expanded}>
			{unit.do.map(action => {
				return <UnitActionNode unit={unit} action={action}
				                       deleteAction={onDeleteAction}
				                       key={action.uuid}/>;
			})}
			<UnitButtons>
				<div/>
				<PrimaryObjectButton onClick={onAppendActionClicked}>
					<FontAwesomeIcon icon={faPencilRuler}/>
					<span>Append Action</span>
				</PrimaryObjectButton>
				<DropdownButton icon={faMicrochip} type={ButtonType.PRIMARY} label='Append Process Unit'
				                onClick={appendUnit}
				                menus={[ {
					                icon: faMicrochip,
					                label: 'Prepend Process Unit',
					                onClick: () => prependUnit(unit)
				                } ]}/>
				<DropdownButton icon={faTrashAlt} type={ButtonType.DANGER} label='Delete This Unit'
				                onClick={onUnitDeleteClicked}
				                menus={[ {
					                icon: faEraser,
					                label: 'Clear Actions',
					                onClick: onClearActionsClicked
				                } ]}/>
			</UnitButtons>
		</UnitActions>
	</UnitContainer>;
};