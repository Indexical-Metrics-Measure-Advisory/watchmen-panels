import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Pipeline, PipelineTriggerType } from '../../../../services/admin/pipeline-types';

const Trigger = styled.div`
	display: grid;
	grid-template-columns: 120px 1fr;
	align-items: center;
	padding: 0 calc(var(--margin) / 4);
	height: 36px;
	font-size: 0.8em;
	> div:first-child {
		white-space: nowrap;
		font-weight: var(--font-demi-bold);
	}
	> div:nth-child(2) {
		display: flex;
		position: relative;
		justify-self: start;
		border: var(--border);
		border-color: var(--pipeline-bg-color);
		background-color: var(--pipeline-bg-color);
		height: 24px;
		line-height: 22px;
		border-radius: 12px;
		outline: none;
		appearance: none;
		overflow: hidden;
		cursor: pointer;
		transition: all 300ms ease-in-out;
		&:hover {
			box-shadow: var(--console-primary-hover-shadow);
		}
		&[data-expanded=true] {
			> div:first-child {
				padding-right: calc(var(--margin) / 2);
			}
			> div:not(:first-child):not(:last-child) {
				padding: 0 calc(var(--margin) / 2);
			}
			> div:not(:first-child):not(:last-child) {
				width: unset;
				background-color: var(--bg-color);
				overflow: unset;
			}
			> div:last-child,
			> div:not(:first-child):not(:last-child) {
				&:hover {
					color: var(--invert-color);
					background-color: var(--console-favorite-color);
				}
			}
			> div:not(:first-child) {
				&:before {
					content: '';
					display: block;
					position: absolute;
					top: 20%;
					left: 0;
					width: 1px;
					height: 60%;
					background-color: var(--console-primary-color);
					border-radius: 1px;
					opacity: 0.5;
					transform: translateX(-50%);
				}
			}
			> div:last-child {
				padding-right: calc(var(--margin) / 2);
				background-color: var(--bg-color);
				> svg {
					transform: rotateZ(180deg);
				}
			}
		}
		> div:first-child {
			padding-left: calc(var(--margin) / 2);
			border-top-left-radius: 12px;
			border-bottom-left-radius: 12px;
		}
		> div:not(:first-child):not(:last-child) {
			position: relative;
			text-align: center;
			padding: 0;
			width: 0;
			white-space: nowrap;
			overflow: hidden;
			transition: all 300ms ease-in-out;
		}
		> div:last-child {
			position: relative;
			padding: 0 calc(var(--margin) / 3);
			> svg {
				transition: all 300ms ease-in-out;
			}
		}
	}
`;

const TriggerTypeOptions: { [key in PipelineTriggerType]: string } = {
	[PipelineTriggerType.INSERT]: 'Insert',
	[PipelineTriggerType.MERGE]: 'Merge',
	[PipelineTriggerType.INSERT_OR_MERGE]: 'Insert or Merge',
	[PipelineTriggerType.DELETE]: 'Delete'
};

export const PipelineTrigger = (props: { pipeline: Pipeline }) => {
	const { pipeline } = props;

	const [ expanded, setExpanded ] = useState(false);

	const onExpandClick = () => {
		if (!expanded) {
			setExpanded(true);
		}
	};
	const collapse = () => setExpanded(false);
	const onTypeChanged = (newType: PipelineTriggerType) => (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		pipeline.type = newType;
		// TODO pipeline type changed, notify & save?
		setExpanded(false);
	};
	const onCaretClicked = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setExpanded(!expanded);
	};

	return <Trigger>
		<div>Trigger On:</div>
		<div data-expanded={expanded} onClick={onExpandClick} tabIndex={0} onBlur={collapse}>
			<div>{TriggerTypeOptions[pipeline.type]}</div>
			{Object.values(PipelineTriggerType).filter(type => type !== pipeline.type).map(type => {
				return <div key={type} onClick={onTypeChanged(type)}>
					{TriggerTypeOptions[type as PipelineTriggerType]}
				</div>;
			})}
			<div onClick={onCaretClicked}><FontAwesomeIcon icon={expanded ? faTimes : faEdit}/></div>
		</div>
	</Trigger>;
};