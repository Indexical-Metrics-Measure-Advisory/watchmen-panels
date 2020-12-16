import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {
	faCompressArrowsAlt,
	faEraser,
	faExpandArrowsAlt,
	faMicrochip,
	faPencilRuler
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../common/utils';
import Button, { ButtonType } from '../../../component/button';
import { DialogContext, useDialog } from '../../../context/dialog';
import { ArrangedProcessUnit, ArrangedStage, ArrangedUnitAction } from '../types';
import { DangerObjectButton, DropdownButton, PrimaryObjectButton, WaiveObjectButton } from './components/object-button';
import { PipelineUnitActionContextProvider } from './pipeline-unit-action-context';
import { UnitActionNodes } from './pipeline-unit-actions';
import { PipelineUnitCondition } from './pipeline-unit-condition';
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
		background-color: var(--console-primary-color);
		border-radius: 0 calc(var(--margin) / 4) var(--margin) 0;
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
		&:after {
			opacity: 0.1;
		}
	}
`;
const ToggleExpandButton = styled(WaiveObjectButton)`
	&[data-expanded=false] {
		> svg {
			transform: rotateZ(180deg);
		}
	}
`;
const UnitActions = styled.div.attrs({
	'data-widget': 'stage-unit-actions'
})`
	display: flex;
	flex-direction: column;
	padding: 0 calc(var(--margin) / 2);
	&[data-expanded=false] {
		display: none;
	}
`;
const UnitActionContainer = styled.div.attrs({
	'data-widget': 'stage-unit-action'
})`
	display: grid;
	position: relative;
	grid-template-columns: calc(120px - var(--margin) / 2) 1fr auto;
	grid-column-gap: calc(var(--margin) / 2);
	&:first-child {
		margin: 4px 0;
	}
	&:before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: calc(var(--margin) / -2);
		width: var(--margin);
		height: 100%;
		background-color: var(--console-waive-color);
		border-radius: 0 calc(var(--margin) / 4) var(--margin) 0;
		opacity: 0;
		z-index: -1;
		transition: all 300ms ease-in-out;
	}
	&:hover {
		&:before {
			opacity: 0.25;
		}
		> button:nth-child(3) {
			opacity: 1;
			pointer-events: auto;
		}
	}
	> div:nth-child(2) {
		align-self: center;
	}
	> button:nth-child(3) {
		align-self: center;
		opacity: 0;
		pointer-events: none;
	}
	> *:nth-child(4) {
		grid-column: span 3;
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
	const forceUpdate = useForceUpdate();

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

	return <PipelineUnitActionContextProvider>
		<UnitActionContainer>
			<ActionLead/>
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
		</UnitActionContainer>
	</PipelineUnitActionContextProvider>;
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
	const forceUpdate = useForceUpdate();

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

	return <UnitContainer>
		<PipelineUnitCondition unit={unit} expanded={expanded}>
			<ToggleExpandButton onClick={onExpandClicked} data-expanded={expanded}>
				<FontAwesomeIcon icon={expanded ? faCompressArrowsAlt : faExpandArrowsAlt}/>
				<span>{expanded ? 'Hide This Process Unit' : 'Show This Process Unit'}</span>
			</ToggleExpandButton>
		</PipelineUnitCondition>
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