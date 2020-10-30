import * as faFile from '@fortawesome/free-regular-svg-icons/faFile';
import * as faFileAlt from '@fortawesome/free-regular-svg-icons/faFileAlt';
import * as faFileArchive from '@fortawesome/free-regular-svg-icons/faFileArchive';
import * as faFileAudio from '@fortawesome/free-regular-svg-icons/faFileAudio';
import * as faFileCode from '@fortawesome/free-regular-svg-icons/faFileCode';
import * as faFileExcel from '@fortawesome/free-regular-svg-icons/faFileExcel';
import * as faFileImage from '@fortawesome/free-regular-svg-icons/faFileImage';
import * as faFilePdf from '@fortawesome/free-regular-svg-icons/faFilePdf';
import * as faFilePowerpoint from '@fortawesome/free-regular-svg-icons/faFilePowerpoint';
import * as faFileVideo from '@fortawesome/free-regular-svg-icons/faFileVideo';
import * as faFileWord from '@fortawesome/free-regular-svg-icons/faFileWord';
import * as faFileContract from '@fortawesome/free-solid-svg-icons/faFileContract';
import * as faFileCsv from '@fortawesome/free-solid-svg-icons/faFileCsv';
import * as faFileDownload from '@fortawesome/free-solid-svg-icons/faFileDownload';
import * as faFileExport from '@fortawesome/free-solid-svg-icons/faFileExport';
import * as faFileImport from '@fortawesome/free-solid-svg-icons/faFileImport';
import * as faFileInvoice from '@fortawesome/free-solid-svg-icons/faFileInvoice';
import * as faFileInvoiceDollar from '@fortawesome/free-solid-svg-icons/faFileInvoiceDollar';
import * as faFileMedical from '@fortawesome/free-solid-svg-icons/faFileMedical';
import * as faFileMedicalAlt from '@fortawesome/free-solid-svg-icons/faFileMedicalAlt';
import * as faFilePrescription from '@fortawesome/free-solid-svg-icons/faFilePrescription';
import * as faFileSignature from '@fortawesome/free-solid-svg-icons/faFileSignature';
import * as faFileUpload from '@fortawesome/free-solid-svg-icons/faFileUpload';
import * as faPlay from '@fortawesome/free-solid-svg-icons/faPlay';
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { BaseColors24 } from '../../charts/color-theme';

const box = { w: 800, h: 450, cx: 400, cy: 225, margin: 30 };
const playBtn = { r: 150 };
const fileIcon = { w: 30, h: 40 };

enum PlayState {
	NOT_START,
	STAGE1
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 540px;
	width: 100vw;
	background-color: #222;
	padding-top: 30px;
	margin-bottom: 128px;
`;
const SubTitle = styled.div`
	display: flex;
	flex-grow: 1;
	align-items: center;
	justify-content: center;
	background-color: transparent;
	width: 800px;
	margin: auto;
	color: var(--invert-color);
	//font-weight: var(--font-bold);
	padding-top: 6px;
	padding-bottom: 5px;
	border-bottom: 1px solid #222;
	> div {
		display: flex;
		align-items: center;
		flex-grow: 1;
	}
`;
const SubTitleStage = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	//font-size: calc(var(--font-size) * 0.93);
	font-weight: 500;
	opacity: 0;
	&[data-visible='${PlayState.STAGE1}'][data-stage='${PlayState.STAGE1}'] {
		opacity: 1;
		transition: opacity 2s ease-in-out;
	}
`;
const SVG = styled.svg`
	//width: 100%;
	background-color: var(--bg-color);
	width: 800px;
	height: 450px;
	margin: auto;
	border-radius: var(--border-radius);
	background-position: -1px -1px;
	background-size: 10px 10px;
	//background-image: linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px);
`;
const FileIconAnimation = (scale: number) => keyframes`
	10% {
		opacity: 1;
	}
	100% {
		transform: translate(385px,205px) scale(${scale});
		opacity: 1;
	}
`;
const FileIcon = styled.g<{ scale: number }>`
	transform: translate(${() => `${Math.random() * (box.w - box.margin * 2 - fileIcon.w) + box.margin}px, \
			${Math.random() * (box.h - box.margin * 2 - fileIcon.h) + box.margin}px`}) scale(${({ scale }) => scale});
	fill: ${() => BaseColors24[Math.floor(Math.random() * 24)]};
	animation-timing-function: ease-in-out;
	// animation-name: ${({ scale }) => FileIconAnimation(scale)};
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
	animation-duration: 3s;
	animation-play-state: paused;
	opacity: 0;
	&[data-start='${PlayState.STAGE1}'] {
		//animation-play-state: running;
		opacity: 1;
		transition: opacity ${() => Math.random() * 2 + 1}s ease-in-out;
	}
`;
const PlayButtonContainer = styled.g`
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-start='${PlayState.STAGE1}'] {
		opacity: 0;
		pointer-events: none;
	}
	&:hover {
		transform: scale(1.05) translate(-${box.cx * 0.05}px, -${box.cy * 0.05}px);
		> circle {
			stroke: var(--primary-color);
		}
		> path {
			fill: var(--primary-color);
		}
	}
	> circle {
		fill: transparent;
		stroke: #999;
		stroke-width: 32px;
		transition: all 300ms ease-in-out;
	}
`;
// for balance the visual effect, let coefficient of x-axis to be more than 2, now it is 2.45.
const PlayButton = styled.path<{ scale: number }>`
	fill: #999;
	transform: scale(${({ scale }) => scale}) translate(${({ scale }) => box.cx / scale - faPlay.width / 2.45}px, ${({ scale }) => box.cy / scale - faPlay.height / 2}px);
	transition: all 300ms ease-in-out;
`;

const files = [
	faFile, faFileAlt,
	faFileCode, faFilePrescription,
	faFilePdf, faFileWord, faFilePowerpoint, faFileExcel, faFileCsv,
	faFileImage, faFileAudio, faFileVideo, faFileArchive,
	faFileDownload, faFileUpload, faFileExport, faFileImport,
	faFileContract, faFileInvoiceDollar, faFileInvoice, faFileMedical, faFileMedicalAlt, faFileSignature ].map(file => {
	return {
		path: file.svgPathData,
		scale: fileIcon.w / file.width
	};
});

export const ConceptSVG = () => {
	const [ playState, setPlayState ] = useState(PlayState.NOT_START);
	const onStartPlayClicked = () => {
		setPlayState(PlayState.STAGE1);
	};

	return <Container>
		<SVG xmlns='http://www.w3.org/2000/svg' viewBox={`0 0 800 450`}>
			{
				files.map(file => new Array(Math.ceil(Math.random() * 5)).fill(file))
					.flat()
					.map((file, index) => {
						return <FileIcon scale={file.scale} data-start={playState} key={index}>
							<path d={file.path}/>
						</FileIcon>;
					})
			}
			<PlayButtonContainer onClick={onStartPlayClicked} data-start={playState}>
				<circle cx={box.cx} cy={box.cy} r={playBtn.r}/>
				<PlayButton d={faPlay.svgPathData} scale={playBtn.r / faPlay.width}/>
			</PlayButtonContainer>
		</SVG>
		<SubTitle>
			<SubTitleStage data-stage={playState} data-visible={PlayState.STAGE1}>
				<div>There are masses of data in different systems,</div>
				<div>Difficult part is how to make them valuable fast and efficient.</div>
			</SubTitleStage>
		</SubTitle>
	</Container>;
};