import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faGlobe, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import styled from 'styled-components';
import { QueriedUser } from '../../../services/admin/types';
import { listUsers } from '../../../services/admin/user';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PlainNarrowContainer } from '../../component/console/page-container';
import { UserAvatar } from '../../component/console/user-avatar';
import { SingleSearch, SingleSearchItemCard } from '../component/single-search';

const ItemCard = styled(SingleSearchItemCard)`
	> div:nth-child(2) {
		position: absolute;
		top: calc(var(--margin) / 2);
		right: var(--margin);
		margin-top: 0;
		font-size: 1.3em;
		opacity: 1;
		min-height: unset;
		line-height: unset;
		transform: unset;
	}
	> div:nth-child(3) {
		margin-top: var(--margin);
	}
`;

export const Users = () => {
	const renderItem = (item: QueriedUser) => {
		return <ItemCard key={item.userId}>
			<div>{item.name}</div>
			<UserAvatar name={item.name}/>
			<div>
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
		</ItemCard>;
	};
	const getKeyOfItem = (item: QueriedUser) => item.userId;

	return <PlainNarrowContainer>
		<NarrowPageTitle title='Users'/>
		<SingleSearch searchPlaceholder='Search by user name, group name, etc.'
		              listData={listUsers}
		              renderItem={renderItem} getKeyOfItem={getKeyOfItem}/>
	</PlainNarrowContainer>;
};