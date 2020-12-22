import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faGlobe, faTags, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from "react";
import UserGroupBackground from '../../../assets/user-group-background.png';
import { listSpacesForUserGroup } from '../../../services/admin/space';
import {
	QueriedSpaceForUserGroup,
	QueriedUserForUserGroup,
	QueriedUserGroup,
	User,
	UserGroup
} from '../../../services/admin/types';
import { fetchUserGroup, listUserGroups, listUsersForUserGroup, saveUserGroup } from '../../../services/admin/user';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { PropInput } from '../component/prop-input';
import { PropInputLines } from '../component/prop-input-lines';
import { PropItemPicker } from '../component/prop-items-picker';
import { PropLabel } from '../component/prop-label';
import { SearchAndEditPanel } from '../component/search-and-edit-panel';
import { SingleSearchItemCard } from '../component/single-search';

// space related
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

// user related
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

export const UserGroups = () => {
	const createCodes = () => {
		return {
			users: [] as Array<QueriedUserForUserGroup>,
			spaces: [] as Array<QueriedSpaceForUserGroup>
		};
	};

	const [ codes, setCodes ] = useState(createCodes());

	const createEntity = (fake: boolean) => {
		if (!fake) {
			setCodes({ users: [], spaces: [] });
		}
		return { groupIds: [] } as User;
	};
	const fetchEntityAndCodes = async (queriedGroup: QueriedUserGroup) => {
		const { group, users, spaces } = await fetchUserGroup(queriedGroup.userGroupId);
		setCodes({ users, spaces });
		return { entity: group };
	};
	const fetchEntityList = listUserGroups;
	const saveEntity = saveUserGroup;
	const isEntityOnCreate = (group: UserGroup) => !group.userGroupId;
	const renderItemInList = (userGroup: QueriedUserGroup, onEdit: (entity: QueriedUserGroup) => (() => void)) => {
		return <SingleSearchItemCard key={userGroup.userGroupId} onClick={onEdit(userGroup)}>
			<div>{userGroup.name}</div>
			<div>{userGroup.description}</div>
			<div>
				<TooltipCarvedButton tooltip='Users Count' center={true}>
					<FontAwesomeIcon icon={faUsers}/>
					<span>{userGroup.userCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Spaces Assigned' center={true}>
					<FontAwesomeIcon icon={faGlobe}/>
					<span>{userGroup.spaceCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Topics Available' center={true}>
					<FontAwesomeIcon icon={faTags}/>
					<span>{userGroup.topicCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Reports Created' center={true}>
					<FontAwesomeIcon icon={faChartBar}/>
					<span>{userGroup.reportCount}</span>
				</TooltipCarvedButton>
			</div>
		</SingleSearchItemCard>;
	};
	const getKeyOfEntity = (item: QueriedUserGroup) => item.userGroupId;

	const onPropChange = (group: UserGroup, prop: 'name' | 'description', onDataChanged: () => void) => {
		return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			if (group[prop] !== event.target.value) {
				group[prop] = event.target.value;
				onDataChanged();
			}
		};
	};
	const renderEditContent = (group: UserGroup, onDataChanged: () => void) => {
		return <Fragment>
			<PropLabel>Group Name:</PropLabel>
			<PropInput value={group.name || ''} onChange={onPropChange(group, 'name', onDataChanged)}/>
			<PropLabel>Description:</PropLabel>
			<PropInputLines onChange={onPropChange(group, 'description', onDataChanged)}
			                value={group.description || ''}/>
			<PropLabel>Spaces:</PropLabel>
			<SpacePicker group={group} codes={codes} onDataChanged={onDataChanged}/>
			<PropLabel>Users:</PropLabel>
			<UserPicker group={group} codes={codes} onDataChanged={onDataChanged}/>
		</Fragment>;
	};

	return <SearchAndEditPanel title='User Groups'
	                           searchPlaceholder='Search by group name, user name, description, etc.'
	                           createButtonLabel='Create User Group'
	                           entityLabel='User Group'
	                           entityImage={UserGroupBackground}
	                           createEntity={createEntity}
	                           fetchEntityAndCodes={fetchEntityAndCodes}
	                           fetchEntityList={fetchEntityList}
	                           saveEntity={saveEntity}
	                           isEntityOnCreate={isEntityOnCreate}
	                           renderEntityInList={renderItemInList}
	                           getKeyOfEntity={getKeyOfEntity}
	                           renderEditContent={renderEditContent}/>;
};