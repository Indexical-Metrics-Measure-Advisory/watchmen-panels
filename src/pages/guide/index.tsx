import React, { Fragment } from 'react';
import { matchPath, Redirect, Route, Switch, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import BuildMetricsImage from '../../assets/build-metrics.png';
import DomainSelectImage from '../../assets/domain-select.png';
import ExportReportImage from '../../assets/export-report.png';
import ImportDataImage from '../../assets/import-data.png';
import MappingFactorImage from '../../assets/mapping-factor.png';
import MeasureIndicatorImage from '../../assets/measure-indicator.png';
import Path from '../../common/path';
import Page from '../component/page';
import BuildMetrics from './build-metrics';
import DomainSelect from './domain-select';
import { GuideContextProvider, useGuideContext } from './guide-context';
import ImportData from './import-data';
import MappingFactor from './mapping-factor';
import MeasureIndicator from './measure-indicator';
import Steps, { Step } from './steps';

const BackgroundImages = [ DomainSelectImage, ImportDataImage, MappingFactorImage, MeasureIndicatorImage, BuildMetricsImage, ExportReportImage ];
const HomePage = styled(Page)<{ step: Step }>`
	> main {
		width: ${({ step }) => step === Step.BUILD_METRICS ? 'calc(100% - var(--margin) * 2)' : '1000px'};
		overflow: hidden;
		&:before {
			content: '';
			position: absolute;
			left: calc(var(--margin) * 3);
			bottom: calc(var(--margin) * 3);
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
			width: 100vw;
		}
	}
`;

const DomainChecker = (props: { children: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { domain: domainCode } = useParams<{ domain: string }>();
	const guide = useGuideContext();
	if (guide.getDomain().code !== domainCode) {
		return <Redirect to={Path.GUIDE_DOMAIN_SELECT}/>;
	} else {
		const { children } = props;
		return <Fragment>{children}</Fragment>;
	}
};

const Guide = () => {
	let step = Step.DOMAIN_SELECT;
	const location = useLocation();

	if (matchPath(location.pathname, Path.GUIDE_DOMAIN_SELECT)) {
		step = Step.DOMAIN_SELECT;
	} else if (matchPath(location.pathname, Path.GUIDE_IMPORT_DATA)) {
		step = Step.IMPORT_DATA;
	} else if (matchPath(location.pathname, Path.GUIDE_MAPPING_FACTOR)) {
		step = Step.MAPPING_FACTORS;
	} else if (matchPath(location.pathname, Path.GUIDE_MEASURE_INDICATOR)) {
		step = Step.MEASURE_INDICATORS;
	} else if (matchPath(location.pathname, Path.GUIDE_BUILD_METRICS)) {
		step = Step.BUILD_METRICS;
	}

	return <GuideContextProvider>
		<HomePage step={step}>
			<Steps step={step}/>
			<Switch>
				<Route path={Path.GUIDE_DOMAIN_SELECT}><DomainSelect/></Route>
				<Route path={Path.GUIDE_IMPORT_DATA}><DomainChecker><ImportData/></DomainChecker></Route>
				<Route path={Path.GUIDE_MAPPING_FACTOR}><DomainChecker><MappingFactor/></DomainChecker></Route>
				<Route path={Path.GUIDE_MEASURE_INDICATOR}><DomainChecker><MeasureIndicator/></DomainChecker></Route>
				<Route path={Path.GUIDE_BUILD_METRICS}><DomainChecker><BuildMetrics/></DomainChecker></Route>
				<Route><Redirect to={Path.GUIDE_DOMAIN_SELECT}/></Route>
			</Switch>
		</HomePage>
	</GuideContextProvider>;
};
export default Guide;