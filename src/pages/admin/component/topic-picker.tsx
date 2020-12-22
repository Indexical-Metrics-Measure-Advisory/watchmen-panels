import React from 'react';
import { listTopicsForSpace } from '../../../services/admin/topic';
import { QueriedTopicForSpace, Space } from '../../../services/admin/types';
import { PropItemPicker } from './prop-items-picker';

const initTopicArray = (space: Space) => space.topicIds = space.topicIds || [];
const addTopicToSpace = (space: Space, topic: QueriedTopicForSpace) => space.topicIds!.push(topic.topicId);
// eslint-disable-next-line
const removeTopicFromSpace = (space: Space, topic: QueriedTopicForSpace) => space.topicIds = (space.topicIds || []).filter(topicId => topicId != topic.topicId);
// eslint-disable-next-line
const isTopicSelected = (space: Space, topic: QueriedTopicForSpace) => !!space.topicIds && space.topicIds.findIndex(topicId => topicId == topic.topicId) !== -1;
const addTopicToCodes = (codes: Array<QueriedTopicForSpace>, topic: QueriedTopicForSpace) => {
	// eslint-disable-next-line
	const exists = codes.findIndex(exists => exists.topicId == topic.topicId) !== -1;
	if (!exists) {
		codes.push(topic);
	}
};
const removeTopicFromCodes = (codes: Array<QueriedTopicForSpace>, topic: QueriedTopicForSpace) => {
	// eslint-disable-next-line
	const index = codes.findIndex(exists => exists.topicId == topic.topicId);
	if (index !== -1) {
		codes.splice(index, 1);
	}
};
const getTopicId = (topic: QueriedTopicForSpace) => topic.topicId;
const getTopicName = (topic: QueriedTopicForSpace) => topic.name;
const getTopicDescription = (topic: QueriedTopicForSpace) => topic.description;

export const TopicPicker = (props: {
	label: string;
	space: Space;
	codes: { topics: Array<QueriedTopicForSpace> };
	onDataChanged: () => void;
}) => {
	const { label, space, codes, onDataChanged } = props;

	return <PropItemPicker label={label}
	                       entity={space}
	                       codes={codes.topics}
	                       initPropArray={initTopicArray}
	                       addItemToProp={addTopicToSpace}
	                       removeItemFromProp={removeTopicFromSpace}
	                       isItemPicked={isTopicSelected}
	                       addItemToCodes={addTopicToCodes}
	                       removeItemFromCodes={removeTopicFromCodes}
	                       getKeyOfItem={getTopicId}
	                       getNameOfItem={getTopicName}
	                       getMinorNameOfItem={getTopicDescription}
	                       listItems={listTopicsForSpace}
	                       onDataChanged={onDataChanged}/>;
};
