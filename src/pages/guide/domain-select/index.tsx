import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path, { toDomain } from '../../../common/path';
import { listTopDomains, TopDomains } from '../../../services/domain';
import { Domain } from '../../../services/types';
import { BigButton, ButtonType } from '../../component/button';
import { useNotImplemented } from '../../context/not-implemented';
import { OperationBar, OperationBarPlaceholder } from '../component/operations-bar';
import { useGuideContext } from '../guide-context';

const Domains = styled.div`
	padding: var(--margin) var(--margin) 0;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: calc(var(--margin) * 2);
	grid-row-gap: calc(var(--margin));
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
	@media (min-width: ${({ theme }) => theme.minDeskWidth}px) {
		&:hover {
			transform: scale(1.05);
		}
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
		opacity: 0.7;
	}
`;

export default () => {
	const history = useHistory();
	const notImpl = useNotImplemented();
	const guide = useGuideContext();

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
		// noinspection JSIgnoredPromiseFromCall
		fetchDomains();
	}, []);

	const selectedDomain = guide.getDomain();
	const equals = (domain: Domain) => selectedDomain && domain.code === selectedDomain.code;
	const onDomainClicked = (domain: Domain) => () => {
		if (equals(domain)) {
			guide.clearDomain();
		} else {
			guide.setDomain(domain);
		}
	};
	const onNextClicked = () => {
		history.push(toDomain(Path.GUIDE_IMPORT_DATA, guide.getDomain().code));
	};

	const buttonLabel = !!selectedDomain ? 'Next' : 'Ignore';
	const buttonType = !!selectedDomain ? ButtonType.PRIMARY : ButtonType.DEFAULT;

	return <Fragment>
		<Domains>
			{data.domains.map(domain => {
				return <DomainButton key={domain.code} data-selected={equals(domain)}
				                     onClick={onDomainClicked(domain)}>
					<span>{domain.label}</span>
					<FontAwesomeIcon icon={faCheck}/>
				</DomainButton>;
			})}
			{data.hasMore ?
				<MoreDomainsButton onClick={notImpl.show}>Explore More...</MoreDomainsButton> : null}
		</Domains>
		<OperationBar>
			<OperationBarPlaceholder/>
			<BigButton inkType={buttonType} onClick={onNextClicked}>{buttonLabel}</BigButton>
		</OperationBar>
	</Fragment>;
}