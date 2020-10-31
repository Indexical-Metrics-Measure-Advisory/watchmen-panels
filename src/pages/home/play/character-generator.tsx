import React from 'react';
import styled from 'styled-components';
import { Scene, ScenesDefs, useDirector } from './director';
import { box } from './producer';

const SubTitle = styled.div`
	flex-grow: 1;
	align-items: center;
	justify-content: center;
	width: ${box.w}px;
	height: ${box.bottom}px;
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
	&[data-visible='${Scene.MASSES_OF_FILES}'] {
		&[data-stage='${Scene.MASSES_OF_FILES}'] {
			opacity: 1;
			transition: opacity ${ScenesDefs.subtitleIn}ms ease-in-out;
		}
		&:not([data-stage='${Scene.MASSES_OF_FILES}']) {
			opacity: 0;
			transition: all ${ScenesDefs.subtitleOut}ms ease-in-out;
			transform: translateY(-50px);
		}
	}
	&[data-visible='${Scene.A_RAW_STORAGE}'] {
		&[data-stage='${Scene.A_RAW_STORAGE}'] {
			opacity: 1;
			transform: translateY(-50px);
			transition: all ${ScenesDefs.subtitleIn}ms ease-in-out;
		}
	}
`;

export const CharacterGenerator = () => {
	const { current } = useDirector();

	return <SubTitle>
		<SubTitleStage data-stage={current()} data-visible={Scene.MASSES_OF_FILES}>
			<div>There are masses of data in different systems,</div>
			<div>Difficult part is how to make them valuable fast and efficient.</div>
		</SubTitleStage>
		<SubTitleStage data-stage={current()} data-visible={Scene.A_RAW_STORAGE}>
			<div>First of all, data and their changes must be collected.</div>
		</SubTitleStage>
	</SubTitle>;
};