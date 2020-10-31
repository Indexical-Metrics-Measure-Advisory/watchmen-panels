import React from 'react';
import styled from 'styled-components';
import { Announcer } from './announcer';
import { CharacterGenerator } from './character-generator';
import { DirectorProvider } from './director';
import { MassesOfFiles } from './masses-of-files';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 540px;
	width: 100vw;
	padding-top: 30px;
	margin-bottom: 64px;
	background-color: #222;
`;
const SVG = styled.svg`
	width: 800px;
	height: 450px;
	margin: auto;
	border-radius: var(--border-radius);
	background-color: var(--bg-color);
	background-position: -1px -1px;
	background-size: 10px 10px;
	//background-image: linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px);
`;

export const StagePlay = () => {
	return <DirectorProvider>
		<Container>
			<SVG xmlns='http://www.w3.org/2000/svg' viewBox={`0 0 800 450`}>
				<MassesOfFiles/>
				<Announcer/>
			</SVG>
			<CharacterGenerator/>
		</Container>
	</DirectorProvider>;
};