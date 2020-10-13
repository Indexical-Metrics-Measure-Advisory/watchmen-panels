import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DomainSelectImage from '../../assets/domain-select.png';
import { listTopDomains, TopDomains } from '../../services/domain';
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
			background-image: url(${DomainSelectImage});
			background-repeat: no-repeat;
			background-position: left bottom;
			background-size: 200px;
		}
	}
`;
const Domains = styled.div`
	padding: var(--page-margin) var(--page-margin) 0;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: calc(var(--page-margin) * 2);
	grid-row-gap: calc(var(--page-margin));
`;
const Domain = styled.div`
	font-size: 1.8em;
	font-weight: var(--font-bold);
	line-height: 2.2em;
	border: var(--border);
	border-radius: calc(var(--border-radius) * 2);
	padding: 16px 32px;
	transition: all 300ms ease-in-out;
	cursor: pointer;
	&:hover {
		background-color: var(--primary-color);
		border-color: var(--primary-color);
		color: var(--invert-color);
	}
`;
const MoreDomains = styled(Domain)`
	opacity: 0.5;
	&:hover {
		opacity: 1;
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
	const [ data, setData ] = useState<TopDomains>({ domains: [], hasMore: false });

	const fetchDomains = async () => {
		try {
			const data = await listTopDomains();
			setData(data);
		} catch {
			// do nothing
		}
	};

	useEffect(() => {
		fetchDomains();
	}, []);

	return <HomePage>
		<Steps step={Step.DOMAIN_SELECT}/>
		<Domains>
			{data.domains.map(domain => {
				return <Domain key={domain.code}>{domain.label}</Domain>;
			})}
			{data.hasMore ? <MoreDomains>Explore More...</MoreDomains> : null}
		</Domains>
		<Operations>

			<Placeholder/>
			<BigButton>Not Sure Now</BigButton>
			<BigButton inkType={ButtonType.PRIMARY}>Next</BigButton>
		</Operations>
	</HomePage>;
}