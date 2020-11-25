import { faGlobe, faTags, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import styled from 'styled-components';
import { listReports } from '../../../services/admin/report';
import { QueriedReport } from '../../../services/admin/types';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PlainNarrowContainer } from '../../component/console/page-container';
import { SingleSearch } from '../component/single-search';

const Item = styled.div`
	display: flex;
	flex-direction: column;
	padding: calc(var(--margin) / 2) var(--margin);
	position: relative;
	border-radius: calc(var(--border-radius) * 2);
	box-shadow: var(--console-shadow);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-hover-shadow);
	}
	> div:first-child {
		display: flex;
		align-items: center;
		font-family: var(--console-title-font-family);
		font-size: 1.4em;
	}
	> div:nth-child(2) {
		display: flex;
		flex-grow: 1;
		position: relative;
		word-break: break-word;
		font-size: 0.8em;
		opacity: 0.8;
		margin-top: calc(var(--margin) / 2);
		min-height: 3.5em;
		line-height: 1.5em;
	}
	> div:nth-child(3) {
		display: flex;
		justify-content: space-around;
		line-height: 1.2em;
		opacity: 0.7;
		margin-top: calc(var(--margin) / 2);
		> button {
			font-size: 0.8em;
			color: var(--console-font-color);
			svg {
				margin-right: calc(var(--margin) / 4);
			}
		}
	}
`;

export const Reports = () => {
	const renderItem = (item: QueriedReport) => {
		return <Item key={item.reportId}>
			<div>{item.name}</div>
			<div>{item.description}</div>
			<div>
				<TooltipCarvedButton tooltip='Topics Count' center={true}>
					<FontAwesomeIcon icon={faTags}/>
					<span>{item.topicCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In User Groups' center={true}>
					<FontAwesomeIcon icon={faUsers}/>
					<span>{item.groupCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In Spaces' center={true}>
					<FontAwesomeIcon icon={faGlobe}/>
					<span>{item.spaceCount}</span>
				</TooltipCarvedButton>
			</div>
		</Item>;
	};
	const getKeyOfItem = (item: QueriedReport) => item.reportId;

	return <PlainNarrowContainer>
		<NarrowPageTitle title='Reports'/>
		<SingleSearch searchPlaceholder='Search by report name, topic name, description, etc.'
		              listData={listReports}
		              renderItem={renderItem} getKeyOfItem={getKeyOfItem}/>
	</PlainNarrowContainer>;
};