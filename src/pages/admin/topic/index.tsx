import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faGlobe, faList, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from "react";
import TopicBackground from '../../../assets/topic-background.png';
import { fetchTopic, listTopics, saveTopic } from '../../../services/admin/topic';
import { QueriedTopic, Topic, TopicType } from '../../../services/admin/types';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { DropdownOption } from '../../component/dropdown';
import { PropDropdown } from '../component/prop-dropdown';
import { PropInput } from '../component/prop-input';
import { PropInputLines } from '../component/prop-input-lines';
import { PropLabel } from '../component/prop-label';
import { SearchAndEditPanel } from '../component/search-and-edit-panel';
import { SingleSearchItemCard } from '../component/single-search';
import { Factors } from './factors';

const TopicTypeOptions = [
	{ value: TopicType.RAW, label: 'Raw' },
	{ value: TopicType.DISTINCT, label: 'Distinct' },
	{ value: TopicType.AGGREGATE, label: 'Aggregate' },
	{ value: TopicType.TIME, label: 'Time Aggregate' },
	{ value: TopicType.RATIO, label: 'Ratio' },
	{ value: TopicType.NOT_DEFINED, label: 'Not Defined' }
];

const renderEditContent = (topic: Topic, onDataChanged: () => void) => {
	const onPropChange = (prop: 'code' | 'name' | 'description') => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (topic[prop] !== event.target.value) {
			topic[prop] = event.target.value;
			onDataChanged();
		}
	};
	const onTypeChange = async (option: DropdownOption) => {
		topic.type = option.value as TopicType;
		onDataChanged();
	};

	return <Fragment>
		<PropLabel>Topic Code:</PropLabel>
		<PropInput value={topic.code || ''} onChange={onPropChange('code')}/>
		<PropLabel>Topic Name:</PropLabel>
		<PropInput value={topic.name || ''} onChange={onPropChange('name')}/>
		<PropLabel>Topic Type:</PropLabel>
		<PropDropdown value={topic.type} options={TopicTypeOptions} onChange={onTypeChange}/>
		<PropLabel>Description:</PropLabel>
		<PropInputLines value={topic.description || ''} onChange={onPropChange('description')}/>
		<PropLabel>Factors:</PropLabel>
		<Factors topic={topic} onDataChanged={onDataChanged}/>
	</Fragment>;
};

export const Topics = () => {
	const createEntity = () => {
		return { type: TopicType.DISTINCT, factors: [] } as Topic;
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