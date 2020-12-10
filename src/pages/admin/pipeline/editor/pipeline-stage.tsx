import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faCompressArrowsAlt, faExpandArrowsAlt, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useReducer, useRef, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { Stage } from '../../../../services/admin/pipeline-types';
import { AutoSwitchInput } from './components/auto-switch-input';
import { DangerObjectButton, PrimaryObjectButton, WaiveObjectButton } from './components/object-button';
import { PipelineUnit } from './pipeline-unit';

const StageContainer = styled.div.attrs({
	'data-widget': 'stage'
})`
	display: flex;
	flex-direction: column;
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
		border: var(--border);
		border-style: dashed;
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
	padding: calc(var(--margin) / 4) calc(var(--margin) / 2);
	font-size: 0.8em;
`;

export const StageEditor = (props: {
	stage: Stage;
	index: number
}) => {
	const { stage, index } = props;

	const bodyRef = useRef<HTMLDivElement>(null);
	const [ expanded, setExpanded ] = useState(true);
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onNameChanged = (value: string) => {
		// TODO stage name changed, to notify or save?
		stage.name = value;
		forceUpdate();
	};
	const onExpandClicked = () => setExpanded(!expanded);

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
				return <PipelineUnit unit={unit} key={v4()}/>;
			})}
			<StageFooter>
				<div/>
				<PrimaryObjectButton>
					<FontAwesomeIcon icon={faWaveSquare}/>
					<span>Append Process Unit</span>
				</PrimaryObjectButton>
				<DangerObjectButton>
					<FontAwesomeIcon icon={faTrashAlt}/>
					<span>Delete Above Stage</span>
				</DangerObjectButton>
			</StageFooter>
		</StageBody>
	</StageContainer>;
};
