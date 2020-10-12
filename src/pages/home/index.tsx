import React from 'react';
import styled from 'styled-components';
import ProcessDataImage from '../../assets/process-data.png';
import Button, { ButtonType } from '../component/button';
import Page from '../component/page';

const HomePage = styled(Page)`
	> div {
		padding: calc(var(--page-margin) * 2) 0;
	}
`;
const Slide = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	min-height: 400px;
	padding: 0 var(--page-margin);
	& > img {
		margin: 0 150px;
	}
	@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
		& > img {
			order: 1;
			margin: 0 0 calc(var(--page-margin) * 2) 0;
			height: 130px;
		}
		& > div {
			order: 2;
		}
	}
`;
const SlideContent = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 450px;
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
const StartButton = styled(Button)`
	align-self: center;
	min-width: 230px;
	font-weight: var(--font-boldest);
	font-size: 1.15em;
	line-height: 2.2em;
`;
export default () => {
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
				<StartButton type={ButtonType.PRIMARY}>Try Online</StartButton>
			</SlideContent>
			<img src={ProcessDataImage} alt=""/>
		</Slide>
	</HomePage>;
}