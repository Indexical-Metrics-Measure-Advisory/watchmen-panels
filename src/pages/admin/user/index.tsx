import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faGlobe, faTags, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from "react";
import styled from 'styled-components';
import { QueriedUser, QueriedUserGroupForUser, User } from '../../../services/admin/types';
import { fetchUser, listUserGroupsForUser, listUsers, saveUser } from '../../../services/admin/user';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { UserAvatar } from '../../component/console/user-avatar';
import { PropInput } from '../component/prop-input';
import { PropItemsPicker } from '../component/prop-items-picker';
import { PropLabel } from '../component/prop-label';
import { SearchAndEditPanel } from '../component/search-and-edit-panel';
import { SingleSearchItemCard } from '../component/single-search';

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
const SelectedGroup = styled.div`
	display: flex;
	align-items: center;
	height: 24px;
	padding-left: calc(var(--margin) / 2);
	color: var(--invert-color);
	font-size: 0.8em;
	background-color: var(--console-primary-color);
	border-radius: 12px;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	> span {
		position: relative;
		padding-right: calc(var(--margin) / 4);
		cursor: default;
	}
	> div {
		display: flex;
		position: relative;
		align-items: center;
		height: 24px;
		padding: 0 calc(var(--margin) / 3) 0 calc(var(--margin) / 4);
		border-top-right-radius: 12px;
		border-bottom-right-radius: 12px;
		&:before {
			content: '';
			display: block;
			position: absolute;
			top: 25%;
			left: 0;
			width: 1px;
			height: 50%;
			background-color: var(--invert-color);
			opacity: 0.7;
		}
		> svg {
		}
	}
`;
const CandidateGroup = styled.div`
	display: flex;
	align-items: center;
	min-height: 32px;
	height: 32px;
	cursor: pointer;
	&:hover {
		color: var(--invert-color);
		background-color: var(--console-primary-color);
	}
	> div:first-child {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		&[data-visible=false] {
			opacity: 0;
		}
	}
	> span:nth-child(3) {
		margin-left: calc(var(--margin) / 4);
		transform: scale(0.8);
		transform-origin: left bottom;
		opacity: 0.7;
	}
`;

export const Users = () => {
	const createCodes = () => ({ groups: [] as Array<QueriedUserGroupForUser> });

	const [ codes, setCodes ] = useState(createCodes());

	const createEntity = (fake: boolean) => {
		if (!fake) {
			setCodes({ groups: [] });
		}
		return { groupIds: [] } as User;
	};
	const fetchEntityAndCodes = async (queriedUser: QueriedUser) => {
		const { user, groups } = await fetchUser(queriedUser.userId);
		setCodes({ groups });
		return { entity: user };
	};
	const fetchEntityList = listUsers;
	const saveEntity = saveUser;
	const isEntityOnCreate = (user: User) => !user.userId;
	const renderItemInList = (entity: QueriedUser, onEdit: (entity: QueriedUser) => (() => void)) => {
		return <ItemCard key={entity.userId} onClick={onEdit(entity)}>
			<div>{entity.name}</div>
			<UserAvatar name={entity.name}/>
			<div>
				<TooltipCarvedButton tooltip='Spaces Assigned' center={true}>
					<FontAwesomeIcon icon={faGlobe}/>
					<span>{entity.spaceCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Topics Available' center={true}>
					<FontAwesomeIcon icon={faTags}/>
					<span>{entity.topicCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Reports Created' center={true}>
					<FontAwesomeIcon icon={faChartBar}/>
					<span>{entity.reportCount}</span>
				</TooltipCarvedButton>
			</div>
		</ItemCard>;
	};
	const getKeyOfEntity = (item: QueriedUser) => item.userId;

	const onPropChange = (user: User, prop: 'name' | 'nickName', onDataChanged: () => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (user[prop] !== event.target.value.trim()) {
			user[prop] = event.target.value;
			onDataChanged();
		}
	};
	const onGroupAdd = (user: User, group: QueriedUserGroupForUser, onDataChanged: () => void) => {
		if (!user.groupIds) {
			user.groupIds = [];
		}
		user.groupIds.push(group.userGroupId);
		// eslint-disable-next-line
		const exists = codes.groups.findIndex(exists => exists.userGroupId == group.userGroupId) !== -1;
		if (!exists) {
			codes.groups.push(group);
		}
		onDataChanged();
	};
	const onGroupRemove = (user: User, group: QueriedUserGroupForUser, onDataChanged: () => void) => {
		if (!user.groupIds) {
			return;
		}
		// eslint-disable-next-line
		user.groupIds = user.groupIds.filter(groupId => groupId != group.userGroupId);
		// eslint-disable-next-line
		const index = codes.groups.findIndex(exists => exists.userGroupId == group.userGroupId);
		if (index !== -1) {
			codes.groups.splice(index, 1);
		}
		onDataChanged();
	};
	const renderSelectedGroup = (user: User, onDataChanged: () => void) => (group: QueriedUserGroupForUser) => {
		return <SelectedGroup>
			<span>{group.name}</span>
			<div onClick={() => onGroupRemove(user, group, onDataChanged)}><FontAwesomeIcon icon={faTimes}/></div>
		</SelectedGroup>;
	};
	const renderCandidateGroup = (user: User, onDataChanged: () => void) => (group: QueriedUserGroupForUser) => {
		// eslint-disable-next-line
		const checked = codes.groups.findIndex(exists => exists.userGroupId == group.userGroupId) !== -1;
		const onClicked = () => {
			if (checked) {
				onGroupRemove(user, group, onDataChanged);
			} else {
				onGroupAdd(user, group, onDataChanged);
			}
		};
		return <CandidateGroup onClick={onClicked}>
			<div data-visible={checked}><FontAwesomeIcon icon={faCheck}/></div>
			<span>{group.name}</span>
			<span>{group.description}</span>
		</CandidateGroup>;
	};
	const sortGroup = (groups: Array<QueriedUserGroupForUser>) => {
		groups.sort((g1, g2) => g1.name.toUpperCase().localeCompare(g2.name.toUpperCase()));
	};
	const fetchGroupsBySearch = async (searchText: string): Promise<Array<QueriedUserGroupForUser>> => {
		const groups = await listUserGroupsForUser(searchText);
		sortGroup(groups);
		return groups;
	};
	const getKeyOfGroup = (group: QueriedUserGroupForUser) => group.userGroupId;
	const renderEditContent = (user: User, onDataChanged: () => void) => {
		return <Fragment>
			<PropLabel>User Name:</PropLabel>
			<PropInput value={user.name || ''} onChange={onPropChange(user, 'name', onDataChanged)}/>
			<PropLabel>Nick Name:</PropLabel>
			<PropInput value={user.nickName || ''} onChange={onPropChange(user, 'nickName', onDataChanged)}/>
			<PropLabel>Group:</PropLabel>
			<PropItemsPicker label='Add Group'
			                 selectedItems={codes.groups}
			                 renderSelectedItem={renderSelectedGroup(user, onDataChanged)}
			                 renderCandidateItem={renderCandidateGroup(user, onDataChanged)}
			                 getKeyOfItem={getKeyOfGroup}
			                 fetchItems={fetchGroupsBySearch}/>
		</Fragment>;
	};

	return <SearchAndEditPanel title='Users'
	                           searchPlaceholder='Search by user name, group name, etc.'
	                           createButtonLabel='Create User'
	                           entityLabel='User'
	                           createEntity={createEntity}
	                           fetchEntityAndCodes={fetchEntityAndCodes}
	                           fetchEntityList={fetchEntityList}
	                           saveEntity={saveEntity}
	                           isEntityOnCreate={isEntityOnCreate}
	                           renderEntityInList={renderItemInList}
	                           getKeyOfEntity={getKeyOfEntity}
	                           renderEditContent={renderEditContent}/>;
};