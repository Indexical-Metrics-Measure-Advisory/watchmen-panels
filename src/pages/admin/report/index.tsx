import { faGlobe, faTags, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { listReports } from '../../../services/admin/report';
import { QueriedReport } from '../../../services/admin/types';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PlainNarrowContainer } from '../../component/console/page-container';
import { SingleSearch, SingleSearchItemCard } from '../component/single-search';

export const Reports = () => {
	const renderItem = (item: QueriedReport) => {
		return <SingleSearchItemCard key={item.reportId}>
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
		</SingleSearchItemCard>;
	};
	const getKeyOfItem = (item: QueriedReport) => item.reportId;

	return <PlainNarrowContainer>
		<NarrowPageTitle title='Reports'/>
		<SingleSearch searchPlaceholder='Search by report name, topic name, description, etc.'
		              listData={listReports}
		              renderItem={renderItem} getKeyOfItem={getKeyOfItem}/>
	</PlainNarrowContainer>;
};