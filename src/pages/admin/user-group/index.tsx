import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faGlobe, faTags, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { QueriedUserGroup } from '../../../services/admin/types';
import { listUserGroups } from '../../../services/admin/user';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PlainNarrowContainer } from '../../component/console/page-container';
import { SingleSearch, SingleSearchItemCard } from '../component/single-search';

export const UserGroups = () => {
	const renderItem = (item: QueriedUserGroup) => {
		return <SingleSearchItemCard key={item.userGroupId}>
			<div>{item.name}</div>
			<div>{item.description}</div>
			<div>
				<TooltipCarvedButton tooltip='Users Count' center={true}>
					<FontAwesomeIcon icon={faUsers}/>
					<span>{item.userCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Spaces Assigned' center={true}>
					<FontAwesomeIcon icon={faGlobe}/>
					<span>{item.spaceCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Topics Available' center={true}>
					<FontAwesomeIcon icon={faTags}/>
					<span>{item.topicCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Reports Created' center={true}>
					<FontAwesomeIcon icon={faChartBar}/>
					<span>{item.reportCount}</span>
				</TooltipCarvedButton>
			</div>
		</SingleSearchItemCard>;
	};
	const getKeyOfItem = (item: QueriedUserGroup) => item.userGroupId;

	return <PlainNarrowContainer>
		<NarrowPageTitle title='User Groups'/>
		<SingleSearch searchPlaceholder='Search by group name, user name, description, etc.'
		              listData={listUserGroups}
		              renderItem={renderItem} getKeyOfItem={getKeyOfItem}/>
	</PlainNarrowContainer>;
};