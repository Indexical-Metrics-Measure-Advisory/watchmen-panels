import { faGlobe, faTags, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from "react";
import styled from 'styled-components';
import ReportBackground from '../../../assets/report-background.png';
import { listReports } from '../../../services/admin/report';
import { QueriedReport, Report } from '../../../services/admin/types';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { SearchAndEditPanel } from '../component/search-and-edit-panel';
import { SingleSearchItemCard } from '../component/single-search';

const Explanation = styled.div`
	grid-column: span 2;
	font-variant: petite-caps;
	font-weight: var(--font-demi-bold);
	font-size: 1.2em;
	+ ol {
		grid-column: span 2;
		counter-reset: item;
		> li {
			list-style: none;
			line-height: 2em;
			font-size: 0.9em;
			&:before {
				display: inline-block;
				content: counters(item, ".") ". ";
				counter-increment: item;
				width: 20px;
			}
		}
	}
	+ ol + ul {
		grid-column: span 2;
		font-size: 0.9em;
		line-height: 1.6em;
		margin-top: 10px;
		> li {
			list-style: none;
			font-weight: var(--font-demi-bold);
		}
	}
`;

export const Reports = () => {
	const createEntity = () => {
		return {} as Report;
	};
	const fetchEntityAndCodes = async () => {
		// no report created here, report should be create in connected space
		return { entity: {} as Report };
	};
	const fetchEntityList = listReports;
	const isEntityOnCreate = (report: Report) => !report.reportId;
	const renderItemInList = (report: QueriedReport, onEdit: (report: QueriedReport) => (() => void)) => {
		return <SingleSearchItemCard key={report.reportId} onClick={onEdit(report)}>
			<div>{report.name}</div>
			<div>{report.description}</div>
			<div>
				<TooltipCarvedButton tooltip='Topics Count' center={true}>
					<FontAwesomeIcon icon={faTags}/>
					<span>{report.topicCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In User Groups' center={true}>
					<FontAwesomeIcon icon={faUsers}/>
					<span>{report.groupCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In Spaces' center={true}>
					<FontAwesomeIcon icon={faGlobe}/>
					<span>{report.spaceCount}</span>
				</TooltipCarvedButton>
			</div>
		</SingleSearchItemCard>;
	};
	const getKeyOfEntity = (item: QueriedReport) => item.reportId;

	const renderEditContent = () => {
		return <Fragment>
			<Explanation>Guide to Create Predefined Report:</Explanation>
			<ol>
				<li>Create an user group, include yourself into this group,</li>
				<li>Create a new space or pick an existed one,</li>
				<li>Grant space to user group in step (1),</li>
				<li>Open client console and sign-in,</li>
				<li>Find space in step (3), and connect,</li>
				<li>Create reports in connected space, and set as predefined.</li>
			</ol>
			<ul>
				<li>Unlike user-defined reports, predefined reports are shared following space assignment.</li>
				<li>Only administrators are empowered to create predefined reports.</li>
			</ul>
		</Fragment>;
	};

	return <SearchAndEditPanel title='Reports'
	                           searchPlaceholder='Search by report name, topic name, description, etc.'
	                           createButtonLabel='Create Report'
	                           entityLabel='Report'
	                           entityImage={ReportBackground}
	                           createEntity={createEntity}
	                           fetchEntityAndCodes={fetchEntityAndCodes}
	                           fetchEntityList={fetchEntityList}
	                           isEntityOnCreate={isEntityOnCreate}
	                           renderEntityInList={renderItemInList}
	                           getKeyOfEntity={getKeyOfEntity}
	                           renderEditContent={renderEditContent}/>;
};