import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import DomainSelectImage from '../../assets/domain-select.png';
import ImportDataImage from '../../assets/import-data.png';
import Path from '../../common/path';
import Page from '../component/page';
import Steps, { Step } from '../component/steps';
import DomainSelect from '../domain-select';
import ImportData from '../import-data';

const BackgroundImages = [ DomainSelectImage, ImportDataImage ];
const HomePage = styled(Page)<{ step: Step }>`
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
			background-repeat: no-repeat;
			background-position: left bottom;
			background-size: 200px;
			background-image: url(${({ step }) => BackgroundImages[step]});
		}
		@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
			width: 100%;
		}
	}
`;

export default () => {
	let step = Step.DOMAIN_SELECT;
	if (useRouteMatch(Path.GUIDE_DOMAIN_SELECT)) {
		step = Step.DOMAIN_SELECT;
	} else if (useRouteMatch(Path.GUIDE_IMPORT_DATA)) {
		step = Step.IMPORT_DATA;
	}

	return <HomePage step={step}>
		<Steps step={step}/>
		<Switch>
			<Route path={Path.GUIDE_DOMAIN_SELECT}><DomainSelect/></Route>
			<Route path={Path.GUIDE_IMPORT_DATA}><ImportData/></Route>
			<Route><Redirect to={Path.GUIDE_DOMAIN_SELECT}/></Route>
		</Switch>
	</HomePage>;
}