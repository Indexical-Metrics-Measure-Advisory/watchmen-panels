import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faCompressArrowsAlt, faEraser, faExpandArrowsAlt, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useRef, useState } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../common/utils';
import Button, { ButtonType } from '../../../component/button';
import { DialogContext, useDialog } from '../../../context/dialog';
import { ArrangedPipeline, ArrangedProcessUnit, ArrangedStage } from '../types';
import { AutoSwitchInput } from './components/auto-switch-input';
import { DropdownButton, WaiveObjectButton } from './components/object-button';
import { PipelineUnit } from './pipeline-unit';
import { createAlarmUnit } from './utils';

const StageContainer = styled.div.attrs({
	'data-widget': 'stage'
})`
	display: flex;
	position: relative;
	flex-direction: column;
	&:before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: var(--margin);
		height: 100%;
		background-color: var(--console-waive-color);
		border-top-right-radius: calc(var(--margin) / 4);
		border-bottom-right-radius: var(--margin);
		opacity: 0;
		z-index: -1;
		transition: all 300ms ease-in-out;
	}
	&:hover:before {
		opacity: 0.25;
	}
`;
const StageTitle = styled.div.attrs({
	'data-widget': 'stage-title'
})`
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	font-size: 0.8em;
	padding: 0 calc(var(--margin) / 4);
	font-family: var(--console-title-font-family);
	height: 32px;
	line-height: 32px;
	&:before {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: -1px;
		width: calc(100% + 2px);
		height: 50%;
		border: 1px dashed var(--border-color);
		border-bottom: 0;
		z-index: -1;
	}
	&[data-expanded=false] {
		> button {
			> svg {
				transform: rotateZ(180deg);
			}
		}
	}
	> div:first-child {
		margin-right: calc(var(--margin) / 4);
	}
	> button {
		margin-right: calc(var(--margin) / 4);
		> svg {
			transition: all 300ms ease-in-out;
		}
	}
`;
const StageBody = styled.div.attrs({
	'data-widget': 'stage-body'
})`
	flex-grow: 1;
	&[data-expanded=false] {
		display: none;
	}
`;
const StageFooter = styled.div.attrs({
	'data-widget': 'stage-footer'
})`
	display: grid;
	grid-template-columns: 1fr auto auto;
	grid-column-gap: calc(var(--margin) / 4);
	align-items: center;
	padding: calc(var(--margin) / 2) calc(var(--margin) / 2);
	font-size: 0.8em;
	border-bottom: 1px dashed var(--border-color);
	margin-bottom: calc(var(--margin) / 2);
`;

const buildDialogButtons = (dialog: DialogContext, onConfirm: () => void) => {
	return <Fragment>
		<div style={{ flexGrow: 1 }}/>
		<Button inkType={ButtonType.PRIMARY} onClick={onConfirm}>Yes</Button>
		<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
	</Fragment>;
};

export const StageEditor = (props: {
	pipeline: ArrangedPipeline;
	stage: ArrangedStage;
	index: number;
	appendStage: () => void;
	prependStage: (on: ArrangedStage) => void;
	deleteStage: (stage: ArrangedStage) => void;
}) => {
	const { pipeline, stage, index, appendStage, prependStage, deleteStage } = props;

	const dialog = useDialog();
	const bodyRef = useRef<HTMLDivElement>(null);
	const [ expanded, setExpanded ] = useState(true);
	const forceUpdate = useForceUpdate();

	const onNameChanged = (value: string) => {
		stage.name = value;
		forceUpdate();
	};
	const onExpandClicked = () => setExpanded(!expanded);
	const onAppendUnit = () => {
		stage.units.push(createAlarmUnit());
		forceUpdate();
	};
	const onPrependUnit = (on: ArrangedProcessUnit) => {
		const index = stage.units.findIndex(exists => exists === on);
		if (index === -1) {
			stage.units.unshift(createAlarmUnit());
		} else {
			stage.units.splice(index, 0, createAlarmUnit());
		}
		forceUpdate();
	};
	const onStageDeleteConfirmClicked = () => {
		deleteStage(stage);
		dialog.hide();
	};
	const onClearUnitsConfirmClicked = () => {
		stage.units = [ createAlarmUnit() ];
		dialog.hide();
	};
	const onStageDeleteClicked = () => {
		if (pipeline.stages.length !== 1) {
			dialog.show(
				<div data-widget='dialog-console-delete'>
					<span>
						<span>Are you sure to delete stage </span>
						<span data-widget='dialog-console-object'>{stage.name || 'Untitled Stage'}</span>
						<span>?</span>
					</span>
				</div>,
				buildDialogButtons(dialog, onStageDeleteConfirmClicked)
			);
		} else {
			dialog.show(
				<div data-widget='dialog-console-delete'>
					<span>
						<span data-widget='dialog-console-object'>{stage.name || 'Untitled Stage'}</span>
						<span> is the last one in pipeline, are you sure to clear all process units?</span>
					</span>
				</div>,
				buildDialogButtons(dialog, onClearUnitsConfirmClicked)
			);
		}
	};
	const onClearUnitsClicked = () => {
		dialog.show(
			<div data-widget='dialog-console-delete'>
				<span>Are you sure to clear all process units?</span>
			</div>,
			buildDialogButtons(dialog, onClearUnitsConfirmClicked)
		);
	};
	const onDeleteUnit = (unit: ArrangedProcessUnit) => {
		const index = stage.units.findIndex(exists => exists === unit);
		if (index !== -1) {
			stage.units.splice(index, 1);
			forceUpdate();
		}
	};

	return <StageContainer data-expanded={expanded}>
		<StageTitle data-expanded={expanded}>
			<AutoSwitchInput onChange={onNameChanged}
			                 prefixLabel={`#${index}`} value={stage.name} placeholder='Untitled Stage'
			                 styles={{ inputFontSize: '0.8em' }}/>
			<WaiveObjectButton onClick={onExpandClicked}>
				<FontAwesomeIcon icon={expanded ? faCompressArrowsAlt : faExpandArrowsAlt}/>
				<span>{expanded ? 'Hide This Stage' : 'Show This Stage'}</span>
			</WaiveObjectButton>
		</StageTitle>
		<StageBody data-expanded={expanded} ref={bodyRef}>
			{stage.units.map(unit => {
				return <PipelineUnit stage={stage} unit={unit}
				                     appendUnit={onAppendUnit} prependUnit={onPrependUnit} deleteUnit={onDeleteUnit}
				                     key={unit.uuid}/>;
			})}
			<StageFooter>
				<div/>
				<DropdownButton icon={faProjectDiagram} type={ButtonType.PRIMARY} label='Append Stage'
				                onClick={appendStage}
				                menus={[ {
					                icon: faProjectDiagram,
					                label: 'Prepend Stage',
					                onClick: () => prependStage(stage)
				                } ]}/>
				<DropdownButton icon={faTrashAlt} type={ButtonType.DANGER} label='Delete Above Stage'
				                onClick={onStageDeleteClicked}
				                menus={[ {
					                icon: faEraser,
					                label: 'Clear Process Units',
					                onClick: onClearUnitsClicked
				                } ]}/>
			</StageFooter>
		</StageBody>
	</StageContainer>;
};
