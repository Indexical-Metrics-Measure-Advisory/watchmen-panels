import React from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { Stage } from '../../../../services/admin/pipeline-types';
import { PipelineUnit } from './pipeline-unit';

const StageContainer = styled.div`
	display: flex;
	flex-direction: column;
`;
const StageTitle = styled.div`
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
	> span {
		background-color: var(--bg-color);
		border-top-right-radius: 1em;
		border-bottom-right-radius: 1em;
		padding: 4px calc(var(--margin) / 2);
		margin-left: calc(var(--margin) / -4);
	}
`;
const StageBody = styled.div`
	flex-grow: 1;
`;

export const StageEditor = (props: {
	stage: Stage;
	index: number
}) => {
	const { stage, index } = props;

	return <StageContainer>
		<StageTitle>
			<span>Stage #{index}</span>
		</StageTitle>
		<StageBody>
			{stage.units.map(unit => {
				return <PipelineUnit unit={unit} key={v4()}/>;
			})}
		</StageBody>
	</StageContainer>;
};
