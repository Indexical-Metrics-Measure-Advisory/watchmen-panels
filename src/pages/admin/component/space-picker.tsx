import React from 'react';
import { listSpacesForUserGroup } from '../../../services/admin/space';
import { QueriedSpaceForUserGroup, UserGroup } from '../../../services/admin/types';
import { PropItemPicker } from './prop-items-picker';

const initSpaceArray = (group: UserGroup) => group.spaceIds = group.spaceIds || [];
const addSpaceToGroup = (group: UserGroup, space: QueriedSpaceForUserGroup) => group.spaceIds!.push(space.spaceId);
// eslint-disable-next-line
const removeSpaceFromGroup = (group: UserGroup, space: QueriedSpaceForUserGroup) => group.spaceIds = (group.spaceIds || []).filter(spaceId => spaceId != space.spaceId);
// eslint-disable-next-line
const isSpaceSelected = (group: UserGroup, space: QueriedSpaceForUserGroup) => !!group.spaceIds && group.spaceIds.findIndex(spaceId => spaceId == space.spaceId) !== -1;
const addSpaceToCodes = (codes: Array<QueriedSpaceForUserGroup>, space: QueriedSpaceForUserGroup) => {
	// eslint-disable-next-line
	const exists = codes.findIndex(exists => exists.spaceId == space.spaceId) !== -1;
	if (!exists) {
		codes.push(space);
	}
};
const removeSpaceFromCodes = (codes: Array<QueriedSpaceForUserGroup>, space: QueriedSpaceForUserGroup) => {
	// eslint-disable-next-line
	const index = codes.findIndex(exists => exists.spaceId == space.spaceId);
	if (index !== -1) {
		codes.splice(index, 1);
	}
};
const getSpaceId = (space: QueriedSpaceForUserGroup) => space.spaceId;
const getSpaceName = (space: QueriedSpaceForUserGroup) => space.name;
const getSpaceDescription = (space: QueriedSpaceForUserGroup) => space.description;

export const SpacePicker = (props: {
	group: UserGroup;
	codes: { spaces: Array<QueriedSpaceForUserGroup> };
	onDataChanged: () => void;
}) => {
	const { group, codes, onDataChanged } = props;

	return <PropItemPicker label='Assign Space'
	                       entity={group}
	                       codes={codes.spaces}
	                       initPropArray={initSpaceArray}
	                       addItemToProp={addSpaceToGroup}
	                       removeItemFromProp={removeSpaceFromGroup}
	                       isItemPicked={isSpaceSelected}
	                       addItemToCodes={addSpaceToCodes}
	                       removeItemFromCodes={removeSpaceFromCodes}
	                       getKeyOfItem={getSpaceId}
	                       getNameOfItem={getSpaceName}
	                       getMinorNameOfItem={getSpaceDescription}
	                       listItems={listSpacesForUserGroup}
	                       onDataChanged={onDataChanged}/>;
};
