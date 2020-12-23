import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faGlobe, faList, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from "react";
import TopicBackground from '../../../assets/topic-background.png';
import { fetchTopic, listTopics, saveTopic } from '../../../services/admin/topic';
import { QueriedTopic, Topic, TopicType } from '../../../services/admin/types';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { PropInput } from '../component/prop-input';
import { PropInputLines } from '../component/prop-input-lines';
import { PropLabel } from '../component/prop-label';
import { SearchAndEditPanel } from '../component/search-and-edit-panel';
import { SingleSearchItemCard } from '../component/single-search';

export const Topics = () => {
	const createEntity = () => {
		return { type: TopicType.DISTINCT } as Topic;
	};
	const fetchEntityAndCodes = async (queriedTopic: QueriedTopic) => {
		const { topic } = await fetchTopic(queriedTopic.topicId);
		return { entity: topic };
	};
	const fetchEntityList = listTopics;
	const saveEntity = saveTopic;
	const isEntityOnCreate = (topic: Topic) => !topic.topicId;
	const renderItemInList = (topic: QueriedTopic, onEdit: (topic: QueriedTopic) => (() => void)) => {
		return <SingleSearchItemCard key={topic.topicId} onClick={onEdit(topic)}>
			<div>{topic.name}</div>
			<div>{topic.description}</div>
			<div>
				<TooltipCarvedButton tooltip='Factors Count' center={true}>
					<FontAwesomeIcon icon={faList}/>
					<span>{topic.factorCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In User Groups' center={true}>
					<FontAwesomeIcon icon={faUsers}/>
					<span>{topic.groupCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In Spaces' center={true}>
					<FontAwesomeIcon icon={faGlobe}/>
					<span>{topic.spaceCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In Reports' center={true}>
					<FontAwesomeIcon icon={faChartBar}/>
					<span>{topic.reportCount}</span>
				</TooltipCarvedButton>
			</div>
		</SingleSearchItemCard>;
	};
	const getKeyOfEntity = (item: QueriedTopic) => item.topicId;

	const onPropChange = (topic: Topic, prop: 'code' | 'name' | 'description', onDataChanged: () => void) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (topic[prop] !== event.target.value) {
			topic[prop] = event.target.value;
			onDataChanged();
		}
	};
	const renderEditContent = (topic: Topic, onDataChanged: () => void) => {
		return <Fragment>
			<PropLabel>Topic Code:</PropLabel>
			<PropInput value={topic.code || ''} onChange={onPropChange(topic, 'code', onDataChanged)}/>
			<PropLabel>Topic Name:</PropLabel>
			<PropInput value={topic.name || ''} onChange={onPropChange(topic, 'name', onDataChanged)}/>
			<PropLabel>Description:</PropLabel>
			<PropInputLines value={topic.description || ''}
			                onChange={onPropChange(topic, 'description', onDataChanged)}/>
		</Fragment>;
	};

	return <SearchAndEditPanel title='Topics'
	                           searchPlaceholder='Search by topic name, factor name, description, etc.'
	                           createButtonLabel='Create Topic'
	                           entityLabel='Topic'
	                           entityImage={TopicBackground}
	                           createEntity={createEntity}
	                           fetchEntityAndCodes={fetchEntityAndCodes}
	                           fetchEntityList={fetchEntityList}
	                           saveEntity={saveEntity}
	                           isEntityOnCreate={isEntityOnCreate}
	                           renderEntityInList={renderItemInList}
	                           getKeyOfEntity={getKeyOfEntity}
	                           renderEditContent={renderEditContent}/>;
};