import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faLink, faTags, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { listSpaces } from '../../../services/admin/space';
import { QueriedSpace } from '../../../services/admin/types';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PlainNarrowContainer } from '../../component/console/page-container';
import { SingleSearch, SingleSearchItemCard } from '../component/single-search';

export const Spaces = () => {
	const renderItem = (item: QueriedSpace) => {
		return <SingleSearchItemCard key={item.spaceId}>
			<div>{item.name}</div>
			<div>{item.description}</div>
			<div>
				<TooltipCarvedButton tooltip='Topics Count' center={true}>
					<FontAwesomeIcon icon={faTags}/>
					<span>{item.topicCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Reports Count' center={true}>
					<FontAwesomeIcon icon={faChartBar}/>
					<span>{item.reportCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In User Groups' center={true}>
					<FontAwesomeIcon icon={faUsers}/>
					<span>{item.groupCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Connections Count' center={true}>
					<FontAwesomeIcon icon={faLink}/>
					<span>{item.connectionCount}</span>
				</TooltipCarvedButton>
			</div>
		</SingleSearchItemCard>;
	};
	const getKeyOfItem = (item: QueriedSpace) => item.spaceId;

	return <PlainNarrowContainer>
		<NarrowPageTitle title='Spaces'/>
		<SingleSearch searchPlaceholder='Search by space name, topic name, report name, description, etc.'
		              listData={listSpaces}
		              renderItem={renderItem} getKeyOfItem={getKeyOfItem}/>
	</PlainNarrowContainer>;
};