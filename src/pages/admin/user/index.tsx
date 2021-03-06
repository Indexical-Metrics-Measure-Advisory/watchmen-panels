import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faGlobe, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from "react";
import styled from 'styled-components';
import UserBackground from '../../../assets/user-background.png';
import { QueriedUser, QueriedUserGroupForGroupsHolder, User } from '../../../services/admin/types';
import { fetchUser, listUserGroupsForUser, listUsers, saveUser } from '../../../services/admin/user';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { UserAvatar } from '../../component/console/user-avatar';
import { GroupPicker } from '../component/group-picker';
import { PropInput } from '../component/prop-input';
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

export const Users = () => {
	const createCodes = () => ({ groups: [] as Array<QueriedUserGroupForGroupsHolder> });

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
	const renderItemInList = (user: QueriedUser, onEdit: (user: QueriedUser) => (() => void)) => {
		return <ItemCard key={user.userId} onClick={onEdit(user)}>
			<div>{user.name}</div>
			<UserAvatar name={user.name}/>
			<div>
				<TooltipCarvedButton tooltip='Spaces Assigned' center={true}>
					<FontAwesomeIcon icon={faGlobe}/>
					<span>{user.spaceCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Topics Available' center={true}>
					<FontAwesomeIcon icon={faTags}/>
					<span>{user.topicCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Reports Created' center={true}>
					<FontAwesomeIcon icon={faChartBar}/>
					<span>{user.reportCount}</span>
				</TooltipCarvedButton>
			</div>
		</ItemCard>;
	};
	const getKeyOfEntity = (item: QueriedUser) => item.userId;

	const onPropChange = (user: User, prop: 'name' | 'nickName', onDataChanged: () => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (user[prop] !== event.target.value) {
			user[prop] = event.target.value;
			onDataChanged();
		}
	};
	const renderEditContent = (user: User, onDataChanged: () => void) => {
		return <Fragment>
			<PropLabel>User Name:</PropLabel>
			<PropInput value={user.name || ''} onChange={onPropChange(user, 'name', onDataChanged)}/>
			<PropLabel>Nick Name:</PropLabel>
			<PropInput value={user.nickName || ''} onChange={onPropChange(user, 'nickName', onDataChanged)}/>
			<PropLabel>Groups:</PropLabel>
			<GroupPicker label='Join Group' holder={user} codes={codes}
			             listGroups={listUserGroupsForUser} onDataChanged={onDataChanged}/>
		</Fragment>;
	};

	return <SearchAndEditPanel title='Users'
	                           searchPlaceholder='Search by user name, group name, etc.'
	                           createButtonLabel='Create User'
	                           entityLabel='User'
	                           entityImage={UserBackground}
	                           createEntity={createEntity}
	                           fetchEntityAndCodes={fetchEntityAndCodes}
	                           fetchEntityList={fetchEntityList}
	                           saveEntity={saveEntity}
	                           isEntityOnCreate={isEntityOnCreate}
	                           renderEntityInList={renderItemInList}
	                           getKeyOfEntity={getKeyOfEntity}
	                           renderEditContent={renderEditContent}/>;
};