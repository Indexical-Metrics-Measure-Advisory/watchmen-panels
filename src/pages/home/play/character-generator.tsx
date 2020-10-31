import React from 'react';
import styled from 'styled-components';
import { Scene, ScenesDefs, useDirector } from './director';
import { box } from './producer';

const height = 50;

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
	height: ${height}px;
	font-weight: 500;
	&[data-visible='${Scene.MASSES_OF_FILES}'] {
		transition: all ${ScenesDefs.subtitleIn}ms ease-in-out;
		&[data-scene='${Scene.NOT_START}'] {
			margin-top: ${height}px;
		}
		&[data-scene='${Scene.MASSES_OF_FILES}'] {
			margin-top: 0;
		}
		&[data-scene='${Scene.A_RAW_STORAGE_1}'] {
			margin-top: -${height}px;
		}
		&[data-scene='${Scene.A_RAW_STORAGE_2}'] {
			margin-top: -${height * 2}px;
		}
		&[data-scene='${Scene.A_RAW_STORAGE_3}'] {
			margin-top: -${height * 3}px;
		}
	}
`;

export const CharacterGenerator = () => {
	const { current } = useDirector();

	const currentScene = current();

	return <SubTitle data-scene={currentScene}>
		<SubTitleStage data-scene={currentScene} data-visible={Scene.MASSES_OF_FILES}>
			<div>There are masses of data in different systems,</div>
			<div>Difficult part is how to make them valuable fast and efficient.</div>
		</SubTitleStage>
		<SubTitleStage data-scene={currentScene} data-visible={Scene.A_RAW_STORAGE_1}>
			<div>First of all, data and their changes need to be collected.</div>
		</SubTitleStage>
		<SubTitleStage data-scene={currentScene} data-visible={Scene.A_RAW_STORAGE_2}>
			<div>A raw data storage is placed.</div>
		</SubTitleStage>
		<SubTitleStage data-scene={currentScene} data-visible={Scene.A_RAW_STORAGE_3}>
			<div>Send all data to this storage.</div>
		</SubTitleStage>
	</SubTitle>;
};