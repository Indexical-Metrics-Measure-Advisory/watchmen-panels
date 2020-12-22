import React from 'react';
import { QueriedUserForUserGroup, UserGroup } from '../../../services/admin/types';
import { listUsersForUserGroup } from '../../../services/admin/user';
import { PropItemPicker } from './prop-items-picker';

const initUserArray = (group: UserGroup) => group.userIds = group.userIds || [];
const addUserToGroup = (group: UserGroup, user: QueriedUserForUserGroup) => group.userIds!.push(user.userId);
// eslint-disable-next-line
const removeUserFromGroup = (group: UserGroup, user: QueriedUserForUserGroup) => group.userIds = (group.userIds || []).filter(userId => userId != user.userId);
// eslint-disable-next-line
const isUserSelected = (group: UserGroup, user: QueriedUserForUserGroup) => !!group.userIds && group.userIds.findIndex(userId => userId == user.userId) !== -1;
const addUserToCodes = (codes: Array<QueriedUserForUserGroup>, user: QueriedUserForUserGroup) => {
	// eslint-disable-next-line
	const exists = codes.findIndex(exists => exists.userId == user.userId) !== -1;
	if (!exists) {
		codes.push(user);
	}
};
const removeUserFromCodes = (codes: Array<QueriedUserForUserGroup>, user: QueriedUserForUserGroup) => {
	// eslint-disable-next-line
	const index = codes.findIndex(exists => exists.userId == user.userId);
	if (index !== -1) {
		codes.splice(index, 1);
	}
};
const getUserId = (user: QueriedUserForUserGroup) => user.userId;
const getUserName = (user: QueriedUserForUserGroup) => user.name;
const getUserNickName = (user: QueriedUserForUserGroup) => user.nickName;

export const UserPicker = (props: {
	group: UserGroup;
	codes: { users: Array<QueriedUserForUserGroup> };
	onDataChanged: () => void;
}) => {
	const { group, codes, onDataChanged } = props;

	return <PropItemPicker label='Include User'
	                       entity={group}
	                       codes={codes.users}
	                       initPropArray={initUserArray}
	                       addItemToProp={addUserToGroup}
	                       removeItemFromProp={removeUserFromGroup}
	                       isItemPicked={isUserSelected}
	                       addItemToCodes={addUserToCodes}
	                       removeItemFromCodes={removeUserFromCodes}
	                       getKeyOfItem={getUserId}
	                       getNameOfItem={getUserName}
	                       getMinorNameOfItem={getUserNickName}
	                       listItems={listUsersForUserGroup}
	                       onDataChanged={onDataChanged}/>;
};
