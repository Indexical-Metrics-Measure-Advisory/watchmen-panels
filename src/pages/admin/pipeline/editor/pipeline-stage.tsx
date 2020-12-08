import React, { useReducer } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { Stage } from '../../../../services/admin/pipeline-types';
import { AutoSwitchInput } from './components/auto-switch-input';
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
`;
const StageBody = styled.div.attrs({
	'data-widget': 'stage-body'
})`
	flex-grow: 1;
`;

export const StageEditor = (props: {
	stage: Stage;
	index: number
}) => {
	const { stage, index } = props;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onNameChanged = (value: string) => {
		// TODO stage name changed, to notify or save?
		stage.name = value;
		forceUpdate();
	};

	return <StageContainer>
		<StageTitle>
			<AutoSwitchInput onChange={onNameChanged}
			                 prefixLabel={`#${index}`} value={stage.name} placeholder='Untitled Stage'
			                 styles={{ inputFontSize: '0.8em' }}/>
		</StageTitle>
		<StageBody>
			{stage.units.map(unit => {
				return <PipelineUnit unit={unit} key={v4()}/>;
			})}
		</StageBody>
	</StageContainer>;
};
