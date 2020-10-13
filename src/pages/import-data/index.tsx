import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import ImportDataImage from '../../assets/import-data.png';
import Path from '../../common/path';
import { BigButton, ButtonType } from '../component/button';
import Page from '../component/page';
import Steps, { Step } from '../component/steps';

const HomePage = styled(Page)`
	& > main {
		width: 1000px;
		&:before {
			content: '';
			position: absolute;
			left: calc(var(--page-margin) * 3);
			bottom: calc(var(--page-margin) * 3);
			width: 100%;
			height: 100%;
			z-index: -1;
			pointer-events: none;
			user-select: none;
			filter: brightness(1.5) opacity(0.1);
			background-image: url(${ImportDataImage});
			background-repeat: no-repeat;
			background-position: left bottom;
			background-size: 200px;
		}
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
		history.push(Path.DOMAIN_SELECT);
	};

	return <HomePage>
		<Steps step={Step.IMPORT_DATA}/>
		<Operations>
			<BigButton onClick={onChangeDomainClicked}>Change Domain</BigButton>
			<Placeholder/>
			<BigButton inkType={ButtonType.PRIMARY}>Next</BigButton>
		</Operations>
	</HomePage>;
}