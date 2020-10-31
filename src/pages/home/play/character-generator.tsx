import React from 'react';
import styled from 'styled-components';
import { Scene, useDirector } from './director';

const SubTitle = styled.div`
	flex-grow: 1;
	align-items: center;
	justify-content: center;
	width: 800px;
	height: 60px;
	margin: auto;
	padding-top: 6px;
	padding-bottom: 5px;
	border-bottom: 1px solid #222;
	color: var(--invert-color);
	background-color: transparent;
	overflow: hidden;
`;
const SubTitleStage = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	align-items: center;
	justify-content: center;
	height: 50px;
	font-weight: 500;
	opacity: 0;
	&[data-visible='${Scene.STAGE1}'] {
		&[data-stage='${Scene.STAGE1}'] {
			opacity: 1;
			transition: opacity 2s ease-in-out;
		}
		&:not([data-stage='${Scene.STAGE1}']) {
			opacity: 0;
			transition: all 1s ease-in-out;
			transform: translateY(-50px);
		}
	}
	&[data-visible='${Scene.STAGE2}'] {
		&[data-stage='${Scene.STAGE2}'] {
			opacity: 1;
			transform: translateY(-50px);
			transition: all 2s ease-in-out;
		}
	}
`;

export const CharacterGenerator = () => {
	const { current } = useDirector();

	return <SubTitle>
		<SubTitleStage data-stage={current()} data-visible={Scene.STAGE1}>
			<div>There are masses of data in different systems,</div>
			<div>Difficult part is how to make them valuable fast and efficient.</div>
		</SubTitleStage>
		<SubTitleStage data-stage={current()} data-visible={Scene.STAGE2}>
			<div>First of all, data and their changes must be collected.</div>
		</SubTitleStage>
	</SubTitle>;
};