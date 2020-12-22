import React from 'react';
import { GroupsHolder, QueriedUserGroupForGroupsHolder } from '../../../services/admin/types';
import { PropItemPicker } from './prop-items-picker';

const initGroupArray = (holder: GroupsHolder) => holder.groupIds = holder.groupIds || [];
const addGroupToHolder = (holder: GroupsHolder, group: QueriedUserGroupForGroupsHolder) => holder.groupIds!.push(group.userGroupId);
// eslint-disable-next-line
const removeGroupFromHolder = (holder: GroupsHolder, group: QueriedUserGroupForGroupsHolder) => holder.groupIds = (holder.groupIds || []).filter(groupId => groupId != group.userGroupId);
// eslint-disable-next-line
const isGroupSelected = (holder: GroupsHolder, group: QueriedUserGroupForGroupsHolder) => !!holder.groupIds && holder.groupIds.findIndex(groupId => groupId == group.userGroupId) !== -1;
const addGroupToCodes = (codes: Array<QueriedUserGroupForGroupsHolder>, group: QueriedUserGroupForGroupsHolder) => {
	// eslint-disable-next-line
	const exists = codes.findIndex(exists => exists.userGroupId == group.userGroupId) !== -1;
	if (!exists) {
		codes.push(group);
	}
};
const removeGroupFromCodes = (codes: Array<QueriedUserGroupForGroupsHolder>, group: QueriedUserGroupForGroupsHolder) => {
	// eslint-disable-next-line
	const index = codes.findIndex(exists => exists.userGroupId == group.userGroupId);
	if (index !== -1) {
		codes.splice(index, 1);
	}
};
const getGroupId = (group: QueriedUserGroupForGroupsHolder) => group.userGroupId;
const getGroupName = (group: QueriedUserGroupForGroupsHolder) => group.name;
const getGroupDescription = (group: QueriedUserGroupForGroupsHolder) => group.description;

export const GroupPicker = (props: {
	label: string;
	holder: GroupsHolder;
	codes: { groups: Array<QueriedUserGroupForGroupsHolder> };
	listGroups: (searchText: string) => Promise<Array<QueriedUserGroupForGroupsHolder>>;
	onDataChanged: () => void;
}) => {
	const { label, holder, codes, listGroups, onDataChanged } = props;

	return <PropItemPicker label={label}
	                       entity={holder}
	                       codes={codes.groups}
	                       initPropArray={initGroupArray}
	                       addItemToProp={addGroupToHolder}
	                       removeItemFromProp={removeGroupFromHolder}
	                       isItemPicked={isGroupSelected}
	                       addItemToCodes={addGroupToCodes}
	                       removeItemFromCodes={removeGroupFromCodes}
	                       getKeyOfItem={getGroupId}
	                       getNameOfItem={getGroupName}
	                       getMinorNameOfItem={getGroupDescription}
	                       listItems={listGroups}
	                       onDataChanged={onDataChanged}/>;
};
