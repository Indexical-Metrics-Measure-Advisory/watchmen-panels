import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { BigButton, ButtonType } from '../component/button';

const Files = styled.div`
	margin: var(--page-margin) var(--page-margin) 0;
	display: grid;
	position: relative;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: calc(var(--page-margin) * 2);
	grid-row-gap: calc(var(--page-margin));
	border: var(--border);
	border-radius: calc(var(--border-radius) * 2);
	min-height: 200px;
	@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
		grid-template-columns: 1fr;
	}
	&:before {
		content: 'Select data files...';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%);
		font-size: 1.2em;
		font-weight: var(--font-bold);
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
	margin-top: var(--page-margin);
	padding: 0 var(--page-margin);
	> button:not(:first-child) {
		margin-left: var(--page-margin);
	}
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export default () => {
	const history = useHistory();

	const onChangeDomainClicked = () => {
		history.push(Path.GUIDE_DOMAIN_SELECT);
	};
	const onNextClicked = () => {
		history.push(Path.GUIDE_MAPPING_FACTORS);
	};

	return <Fragment>
		<Files>
			<input type="file" multiple/>
		</Files>
		<Operations>
			<BigButton onClick={onChangeDomainClicked}>Change Domain</BigButton>
			<Placeholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</Operations>
	</Fragment>;
}