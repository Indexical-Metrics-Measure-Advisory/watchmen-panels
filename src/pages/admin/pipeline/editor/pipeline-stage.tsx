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
	font-weight: var(--font-demi-bold);
	padding: 0 calc(var(--margin) / 4);
	font-family: var(--console-title-font-family);
	height: 32px;
	line-height: 32px;
	background-color: var(--pipeline-bg-color);
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
