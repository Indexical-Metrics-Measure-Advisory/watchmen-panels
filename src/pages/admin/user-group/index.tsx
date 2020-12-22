import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faGlobe, faTags, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from "react";
import UserGroupBackground from '../../../assets/user-group-background.png';
import {
	QueriedSpaceForUserGroup,
	QueriedUserForUserGroup,
	QueriedUserGroup,
	UserGroup
} from '../../../services/admin/types';
import { fetchUserGroup, listUserGroups, saveUserGroup } from '../../../services/admin/user';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { PropInput } from '../component/prop-input';
import { PropInputLines } from '../component/prop-input-lines';
import { PropLabel } from '../component/prop-label';
import { SearchAndEditPanel } from '../component/search-and-edit-panel';
import { SingleSearchItemCard } from '../component/single-search';
import { SpacePicker } from '../component/space-picker';
import { UserPicker } from '../component/user-picker';

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
		return { userIds: [], spaceIds: [] } as UserGroup;
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