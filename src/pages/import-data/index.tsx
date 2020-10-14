import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { toReadableFileSize } from '../../common/utils';
import Button, { BigButton, ButtonType } from '../component/button';

interface SelectedFile {
	name: string;
	size: string;
	file: File;
}

const SelectedFiles = styled.div<{ itemCount: number }>`
	margin: var(--margin) var(--margin) 0;
	display: flex;
	flex-direction: column;
	border-top-left-radius: calc(var(--border-radius) * 2);
	border-top-right-radius: calc(var(--border-radius) * 2);
	height: 0;
	overflow: hidden;
	transition: all 300ms ease-in-out;
	&[data-visible=true] {
		height: calc(1px + 32px * ${({ itemCount }) => itemCount});
		border: var(--border);
		border-bottom: 0;
		& + div {
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			min-height: ${({ itemCount }) => Math.max(100, 200 - itemCount * 32)}px;
			&:after {
				opacity: 0.7;
			}
		}
	}
`;
const SelectedFileRow = styled.div`
	display: flex;
	padding: 0 var(--margin);
	height: 32px;
	align-items: center;
	transition: all 300ms ease-in-out;
	&:not(:last-child) {
		border-bottom: var(--border);
	}
	&:hover {
		background-color: var(--hover-color);
	}
	> div:nth-child(2) {
		flex-grow: 1;
		font-size: 0.8em;
		padding-left: calc(var(--margin) / 2);
		transform-origin: bottom left;
	    transform: scale(0.7);
	    opacity: 0.7;
	}
	> div:last-child {
		> button {
			border: 0;
			margin-right: calc(var(--margin) * -0.5);
			&:hover {
				color: var(--danger-hover-color);
			}
		}
	}
`;
const Files = styled.div`
	margin: 0 var(--margin);
	display: grid;
	position: relative;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: calc(var(--margin) * 2);
	grid-row-gap: calc(var(--margin));
	border: var(--border);
	border-radius: calc(var(--border-radius) * 2);
	min-height: 200px;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
		grid-template-columns: 1fr;
	}
	&:before {
		content: 'Select data files...';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 1.2em;
		font-weight: var(--font-bold);
	}
	&:after {
		content: 'According to security reason, same file cannot be addressed correctly when it is selected in two or more times, try to avoid this please.';
		transform: scale(0.7);
		transform-origin: right;
		opacity: 0;
		display: block;
		position: absolute;
		top: 0;
		right: 0;
		padding-right: var(--margin);
		transition: all 300ms ease-in-out;
	}
	> input[type=file] {
		opacity: 0;
		display: block;
		position: absolute;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}
`;

const Operations = styled.div`
	display: flex;
	margin-top: var(--margin);
	padding: 0 var(--margin);
	> button:not(:first-child) {
		margin-left: var(--margin);
	}
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export default () => {
	const history = useHistory();

	const [ files, setFiles ] = useState<Array<SelectedFile>>([]);

	const onFilesSelected = (input: HTMLInputElement) => async () => {
		const selectedFiles = input.files || [];
		const data = [];
		for (let index = 0, count = selectedFiles.length; index < count; index++) {
			data.push(selectedFiles[index]);
		}
		const existsFileNames = files.map(file => file.name);
		setFiles([ ...files, ...data.map(file => {
			let name = file.name, originalName = name;
			let index = 1;
			while (existsFileNames.includes(name)) {
				name = originalName.replace(/(.*)\.(json|csv)$/, `$1_${index}.$2`);
				index += 1;
			}
			existsFileNames.push(name);
			return {
				name,
				size: toReadableFileSize(file.size),
				file
			};
		}) ]);
	};
	const onFilesShouldSelect = () => {
		// to avoid the following scenario
		// 1. select a file,
		// 2. remove this file
		// 3. select exactly the same file
		// change event will not be invoked if the file element is rendered by react jsx
		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = true;
		input.accept = '.json,.csv';
		input.onchange = onFilesSelected(input);
		input.click();
	};
	const onRemoveClicked = (removeFile: SelectedFile) => () => {
		setFiles(files.filter(file => file !== removeFile));
	};
	const onChangeDomainClicked = () => {
		history.push(Path.GUIDE_DOMAIN_SELECT);
	};
	const onNextClicked = () => {
		if (files.length === 0) {

		}
		history.push(Path.GUIDE_MAPPING_FACTOR);
	};

	return <Fragment>
		<SelectedFiles data-visible={files.length !== 0} itemCount={files.length}>
			{files.map((file, index) => {
				return <SelectedFileRow key={`${file.name}-${index}`}>
					<div>{file.name}</div>
					<div>{file.size}</div>
					<div><Button onClick={onRemoveClicked(file)}><FontAwesomeIcon icon={faTimes}/></Button></div>
				</SelectedFileRow>;
			})}
		</SelectedFiles>
		<Files onClick={onFilesShouldSelect}/>
		<Operations>
			<BigButton onClick={onChangeDomainClicked}>Change Domain</BigButton>
			<Placeholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</Operations>
	</Fragment>;
}