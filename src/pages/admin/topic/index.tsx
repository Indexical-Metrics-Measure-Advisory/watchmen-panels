import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faGlobe, faList, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { listTopics } from '../../../services/admin/topic';
import { QueriedTopic } from '../../../services/admin/types';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PlainNarrowContainer } from '../../component/console/page-container';
import { SingleSearch, SingleSearchItemCard } from '../component/single-search';

export const Topics = () => {
	const renderItem = (item: QueriedTopic) => {
		return <SingleSearchItemCard key={item.topicId}>
			<div>{item.name}</div>
			<div>{item.description}</div>
			<div>
				<TooltipCarvedButton tooltip='Factors Count' center={true}>
					<FontAwesomeIcon icon={faList}/>
					<span>{item.factorCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In User Groups' center={true}>
					<FontAwesomeIcon icon={faUsers}/>
					<span>{item.groupCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In Spaces' center={true}>
					<FontAwesomeIcon icon={faGlobe}/>
					<span>{item.spaceCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In Reports' center={true}>
					<FontAwesomeIcon icon={faChartBar}/>
					<span>{item.reportCount}</span>
				</TooltipCarvedButton>
			</div>
		</SingleSearchItemCard>;
	};
	const getKeyOfItem = (item: QueriedTopic) => item.topicId;

	return <PlainNarrowContainer>
		<NarrowPageTitle title='Topics'/>
		<SingleSearch searchPlaceholder='Search by topic name, factor name, description, etc.'
		              listData={listTopics}
		              renderItem={renderItem} getKeyOfItem={getKeyOfItem}/>
	</PlainNarrowContainer>;
};