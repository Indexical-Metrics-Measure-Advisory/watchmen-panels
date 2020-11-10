import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import ProcessDataImage1 from '../../assets/process-data-1.png';
import ProcessDataImage2 from '../../assets/process-data-2.png';
import ProcessDataImage3 from '../../assets/process-data-3.png';
import Path from '../../common/path';
import { BigButton, ButtonType } from '../component/button';
import Page from '../component/page';
import { ConceptSVG } from './concept';

const HomePage = styled(Page)`
	> main {
		padding: calc(var(--margin) * 4) 0;
	}
`;
const Slide = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	min-height: 400px;
	padding: 0 var(--margin);
	&:not(:last-child) {
		padding-bottom: calc(var(--margin) * 4);
	}
	> img {
		margin: 0 150px;
		&:first-child {
			margin-left: 50px;
		}
		&:last-child {
			margin-right: 50px;
		}
	}
	@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
		> img {
			order: 1;
			margin: 0 0 calc(var(--margin) * 2) 0;
			height: 130px;
		}
		> div {
			order: 2;
		}
	}
`;
const SlideContent = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 500px;
`;
const Title = styled.div`
	font-size: var(--title-font-size);
	line-height: var(--title-line-height);
	font-weight: var(--font-boldest);
	margin-bottom: 20px;
`;
const Description = styled.div`
	font-size: 1.3em;
	line-height: 1.5em;
	opacity: 0.7;
	margin-bottom: 56px;
`;

export default () => {
	const history = useHistory();

	const onStartGuideClicked = () => {
		history.push(Path.GUIDE);
	};
	const onStartConsoleClicked = () => {
		history.push(Path.CONSOLE);
	};

	return <HomePage>
		<Slide>
			<SlideContent>
				<Title>
					Measure Your Business<br/>for Free
				</Title>
				<Description>
					Measure your business with our beginner-friendly step-by-step guide. Import data, try metrics,
					choose indicators, and measure your business.
				</Description>
				<BigButton inkType={ButtonType.PRIMARY} onClick={onStartGuideClicked}>Try Chart Guide</BigButton>
			</SlideContent>
			<img src={ProcessDataImage1} alt=''/>
		</Slide>
		<Slide>
			<img src={ProcessDataImage2} alt=''/>
			<SlideContent>
				<Title>
					Domain Oriented Perspectives
				</Title>
				<Description>
					Dedicated groups of experts continually working to create domain oriented indicators and reports
					that are accurate and easier to use.
				</Description>
				<BigButton inkType={ButtonType.PRIMARY} onClick={onStartGuideClicked}>Try Chart Guide</BigButton>
			</SlideContent>
		</Slide>
		<ConceptSVG/>
		<Slide>
			<SlideContent>
				<Title>
					Sustainability made easy<br/>
					on Enterprise Edition
				</Title>
				<Description>
					Pipelines on data lake or stream, continuous investigating constructive and valuable indicators
					extracting and recognizing dynamically.
				</Description>
				<BigButton inkType={ButtonType.PRIMARY} onClick={onStartConsoleClicked}>Try Console</BigButton>
			</SlideContent>
			<img src={ProcessDataImage3} alt=''/>
		</Slide>
	</HomePage>;
}