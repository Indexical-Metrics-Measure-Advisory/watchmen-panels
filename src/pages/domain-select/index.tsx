import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import DomainSelectImage from '../../assets/domain-select.png';
import Path from '../../common/path';
import { Domain, listTopDomains, TopDomains } from '../../services/domain';
import { BigButton, ButtonType } from '../component/button';
import Page from '../component/page';
import Steps, { Step } from '../component/steps';
import { useNotImplemented } from '../context/not-implemented';

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
		@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
			width: 100%;
		}
	}
`;
const Domains = styled.div`
	padding: var(--page-margin) var(--page-margin) 0;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: calc(var(--page-margin) * 2);
	grid-row-gap: calc(var(--page-margin));
	@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
		grid-template-columns: 1fr;
	}
`;
const DomainButton = styled.div`
	font-size: 1.8em;
	font-weight: var(--font-bold);
	line-height: 2.2em;
	border: var(--border);
	border-radius: calc(var(--border-radius) * 2);
	padding: 16px 32px;
	transition: all 300ms ease-in-out;
	cursor: pointer;
	user-select: none;
	display: flex;
	justify-content: space-between;
	align-items: center;
	&:hover {
		background-color: var(--primary-color);
		border-color: var(--primary-color);
		color: var(--invert-color);
	}
	> svg {
		opacity: 0;
		transition: opacity 300ms ease-in-out;
	}
	&[data-selected=true] > svg {
		opacity: 1;
	}
	@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
		padding: 32px 32px;
		line-height: 1.2em;
	}
`;
const MoreDomainsButton = styled(DomainButton)`
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
	const history = useHistory();
	const notImpl = useNotImplemented();

	const [ data, setData ] = useState<TopDomains>({ domains: [], hasMore: false });
	const [ selectedDomain, setSelectedDomain ] = useState<Domain | null>(null);

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

	const onDomainClicked = (domain: Domain) => () => {
		if (domain === selectedDomain) {
			setSelectedDomain(null);
		} else {
			setSelectedDomain(domain);
		}
	};
	const onNextClicked = () => {
		if (selectedDomain) {
			history.push(Path.IMPORT_DATA);
		} else {
			history.push(Path.IMPORT_DATA);
		}
	};

	const buttonLabel = !!selectedDomain ? 'Next' : 'Ignore';
	const buttonType = !!selectedDomain ? ButtonType.PRIMARY : ButtonType.DEFAULT;

	return <HomePage>
		<Steps step={Step.DOMAIN_SELECT}/>
		<Domains>
			{data.domains.map(domain => {
				return <DomainButton key={domain.code} data-selected={domain === selectedDomain}
				                     onClick={onDomainClicked(domain)}>
					<span>{domain.label}</span>
					<FontAwesomeIcon icon={faCheck}/>
				</DomainButton>;
			})}
			{data.hasMore ?
				<MoreDomainsButton onClick={notImpl.show}>Explore More...</MoreDomainsButton> : null}
		</Domains>
		<Operations>
			<Placeholder/>
			<BigButton inkType={buttonType} onClick={onNextClicked}>{buttonLabel}</BigButton>
		</Operations>
	</HomePage>;
}