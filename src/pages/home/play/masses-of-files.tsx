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
import React, { Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import { BaseColors24 } from '../../../charts/color-theme';
import { Scene, ScenesDefs, useDirector } from './director';
import { box } from './producer';

const size = { w: 30, h: 40 };

interface File {
	path: string;
	scale: number;
	translate: { x: number, y: number };
	fill: string;
}

const FileIconAnimation = (scale: number) => keyframes`
	10% {
		opacity: 1;
	}
	100% {
		transform: translate(${box.cx - size.w / 2}px,${box.cy - size.h / 2}px) scale(${scale});
		opacity: 1;
	}
`;

export const FileIcon = styled.g<{ scale: number, translate: { x: number, y: number }, fill: string }>`
	transform: ${({ scale, translate: { x, y } }) => `translate(${x}px, ${y}px) scale(${scale})`};
	fill: ${({ fill }) => fill};
	animation-timing-function: ease-in-out;
	opacity: 0;
	&[data-scene='${Scene.MASSES_OF_FILES}'] {
		opacity: 1;
		transition: opacity ${() => Math.random() * (ScenesDefs[Scene.MASSES_OF_FILES].showFile - 1000) + 1000}ms ease-in-out;
	}
	&[data-scene='${Scene.A_RAW_STORAGE}'] {
		// animation-name: ${({ scale }) => FileIconAnimation(scale)};
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
		animation-duration: ${ScenesDefs[Scene.MASSES_OF_FILES].showFile}ms;
		animation-play-state: paused;
		//animation-play-state: running;
		opacity: 1;
	}
`;

const files: Array<File> = [
	faFile, faFileAlt,
	faFileCode, faFilePrescription,
	faFilePdf, faFileWord, faFilePowerpoint, faFileExcel, faFileCsv,
	faFileImage, faFileAudio, faFileVideo, faFileArchive,
	faFileDownload, faFileUpload, faFileExport, faFileImport,
	faFileContract, faFileInvoiceDollar, faFileInvoice, faFileMedical, faFileMedicalAlt, faFileSignature
].map(file => {
	return {
		path: file.svgPathData,
		scale: size.w / file.width
	};
}).map(file => new Array(Math.ceil(Math.random() * 5)).fill(file))
	.flat()
	.map((file) => {
		return {
			...file,
			fill: BaseColors24[Math.floor(Math.random() * 24)],
			translate: {
				x: Math.random() * (box.w - box.margin * 2 - size.w) + box.margin,
				y: Math.random() * (box.h - box.margin * 2 - size.h) + box.margin
			}
		};
	});

export const MassesOfFiles = (props: {}) => {
	const director = useDirector();
	const { current } = director;

	return <Fragment>
		{
			files.map((file, index) => {
				return <FileIcon {...file} data-scene={current()} key={index}>
					<path d={file.path}/>
				</FileIcon>;
			})
		}
	</Fragment>;
};
