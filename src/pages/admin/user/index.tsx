import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faGlobe, faTags, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from "react";
import styled, { keyframes } from 'styled-components';
import UserBackground from '../../../assets/user-background.png';
import { useForceUpdate } from '../../../common/utils';
import { QueriedUser, QueriedUserGroupForUser, User } from '../../../services/admin/types';
import { fetchUser, listUserGroupsForUser, listUsers, saveUser } from '../../../services/admin/user';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PlainNarrowContainer } from '../../component/console/page-container';
import { UserAvatar } from '../../component/console/user-avatar';
import { EditPanel } from '../component/edit-panel';
import { EditPanelButtons } from '../component/edit-panel-buttons';
import { PropInput } from '../component/prop-input';
import { PropItemsPicker } from '../component/prop-items-picker';
import { PropLabel } from '../component/prop-label';
import { SingleSearch, SingleSearchItemCard } from '../component/single-search';
import { DangerObjectButton, PrimaryObjectButton } from '../pipeline/editor/components/object-button';

interface EditUser {
	user?: User;
	groups: Array<QueriedUserGroupForUser>;
}

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
const Saved = keyframes`
	0% {
		transform: scale(1);
	}
	5% {
		transform: scale(1.5);
	}
	20%, 80% {
		transform: scale(1);
		opacity: 1;
	}
	100% {
		transform: scale(1);
		opacity: 0;
	}
`;
const InformMessage = styled.div`
	flex-grow: 1;
	display: flex;
	align-items: center;
	font-size: 0.8em;
	font-variant: petite-caps;
	font-weight: var(--font-bold);
	opacity: 0.5;
	transition: all 300ms ease-in-out;
	&[data-change-kind=changed] {
		color: var(--console-success-color);
	}
	&[data-change-kind=saving] {
		color: var(--console-danger-color);
	}
	&[data-change-kind=saved] {
		color: var(--console-danger-color);
		> span {
			animation: ${Saved} 6000ms ease-in-out forwards;
			transform-origin: left;
		}
	}
	&:empty {
		opacity: 0;
	}
`;

const UserPanel = (props: {
	user?: User
	groups: Array<QueriedUserGroupForUser>;
	onClosed: () => void;
}) => {
	const { user: originUser, groups, onClosed } = props;
	const { user = { groupIds: [] } } = props;

	const [ dataChanged, setDataChanged ] = useState(false);
	const [ dataSaving, setDataSaving ] = useState(false);
	const [ dataSaved, setDataSaved ] = useState(false);
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		setDataSaved(false);
		setDataSaving(false);
		setDataChanged(false);
	}, [ user ]);

	const onDataChanged = () => {
		if (dataSaved) {
			setDataSaved(false);
		}
		setDataChanged(true);
		forceUpdate();
	};
	const onDataSaved = () => {
		setDataSaving(false);
		setDataSaved(true);
		forceUpdate();
	};
	const onPropChange = (prop: 'name' | 'nickName') => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (user[prop] !== event.target.value.trim()) {
			user[prop] = event.target.value;
			onDataChanged();
		}
	};
	const onGroupRemove = (group: QueriedUserGroupForUser) => {
		if (!user.groupIds) {
			return;
		}
		// eslint-disable-next-line
		user.groupIds = user.groupIds.filter(groupId => groupId != group.userGroupId);
		// eslint-disable-next-line
		const index = groups.findIndex(exists => exists.userGroupId == group.userGroupId);
		if (index !== -1) {
			groups.splice(index, 1);
		}
		onDataChanged();
	};
	const renderSelectedGroup = (group: QueriedUserGroupForUser) => {
		return <SelectedGroup>
			<span>{group.name}</span>
			<div onClick={() => onGroupRemove(group)}><FontAwesomeIcon icon={faTimes}/></div>
		</SelectedGroup>;
	};
	const onGroupAdd = (group: QueriedUserGroupForUser) => {
		if (!user.groupIds) {
			user.groupIds = [];
		}
		user.groupIds.push(group.userGroupId);
		// eslint-disable-next-line
		const exists = groups.findIndex(exists => exists.userGroupId == group.userGroupId) !== -1;
		if (!exists) {
			groups.push(group);
		}
		onDataChanged();
	};
	const renderCandidateGroup = (group: QueriedUserGroupForUser) => {
		// eslint-disable-next-line
		const checked = groups.findIndex(exists => exists.userGroupId == group.userGroupId) !== -1;
		const onClicked = () => {
			if (checked) {
				onGroupRemove(group);
			} else {
				onGroupAdd(group);
			}
		};
		return <CandidateGroup onClick={onClicked}>
			<div data-visible={checked}><FontAwesomeIcon icon={faCheck}/></div>
			<span>{group.name}</span>
			<span>{group.description}</span>
		</CandidateGroup>;
	};
	const getKeyOfGroup = (group: QueriedUserGroupForUser) => group.userGroupId;
	const sortGroup = (groups: Array<QueriedUserGroupForUser>) => {
		groups.sort((g1, g2) => g1.name.toUpperCase().localeCompare(g2.name.toUpperCase()));
	};
	const fetchItems = async (searchText: string): Promise<Array<QueriedUserGroupForUser>> => {
		const groups = await listUserGroupsForUser(searchText);
		sortGroup(groups);
		return groups;
	};
	const onConfirmClicked = async () => {
		setDataSaving(true);
		setDataChanged(false);
		await saveUser(user);
		onDataSaved();
	};
	const onCloseClicked = () => onClosed();

	const visible = !!originUser;
	const onEditing = !!user.userId;
	sortGroup(groups);
	const kind = dataSaved ? 'saved' : (dataSaving ? 'saving' : (dataChanged ? 'changed' : ''));
	const message = dataSaved ? 'Data Saved.' : (dataSaving ? 'Data Saving...' : (dataChanged ? 'Data Changed.' : ''));

	return <EditPanel title={onEditing ? 'An Exists User' : 'A New User'} background={UserBackground} visible={visible}>
		<PropLabel>User Name:</PropLabel>
		<PropInput value={user.name || ''} onChange={onPropChange('name')}/>
		<PropLabel>Nick Name:</PropLabel>
		<PropInput value={user.nickName || ''} onChange={onPropChange('nickName')}/>
		<PropLabel>Group:</PropLabel>
		<PropItemsPicker label='Add Group'
		                 selectedItems={groups}
		                 renderSelectedItem={renderSelectedGroup}
		                 renderCandidateItem={renderCandidateGroup}
		                 getKeyOfItem={getKeyOfGroup}
		                 fetchItems={fetchItems}/>
		<EditPanelButtons>
			<InformMessage data-change-kind={kind}><span>{message}</span></InformMessage>
			<PrimaryObjectButton onClick={onConfirmClicked}>
				<span>Confirm</span>
			</PrimaryObjectButton>
			<DangerObjectButton onClick={onCloseClicked}>
				<span>Close</span>
			</DangerObjectButton>
		</EditPanelButtons>
	</EditPanel>;
};

export const Users = () => {
	const [ editUser, setEditUser ] = useState<EditUser>({ groups: [] });

	const onSearched = () => setEditUser({ groups: [] });
	const onCreate = () => setEditUser({ user: {}, groups: [] });
	const onEdit = (queriedUser: QueriedUser) => async () => {
		const { user, groups } = await fetchUser(queriedUser.userId);
		setEditUser({ user, groups });
	};
	const onCreateOrEditDiscarded = () => setEditUser({ groups: [] });

	const renderItem = (item: QueriedUser) => {
		return <ItemCard key={item.userId} onClick={onEdit(item)}>
			<div>{item.name}</div>
			<UserAvatar name={item.name}/>
			<div>
				<TooltipCarvedButton tooltip='Spaces Assigned' center={true}>
					<FontAwesomeIcon icon={faGlobe}/>
					<span>{item.spaceCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Topics Available' center={true}>
					<FontAwesomeIcon icon={faTags}/>
					<span>{item.topicCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Reports Created' center={true}>
					<FontAwesomeIcon icon={faChartBar}/>
					<span>{item.reportCount}</span>
				</TooltipCarvedButton>
			</div>
		</ItemCard>;
	};
	const getKeyOfItem = (item: QueriedUser) => item.userId;

	return <PlainNarrowContainer>
		<NarrowPageTitle title='Users'/>
		<SingleSearch searchPlaceholder='Search by user name, group name, etc.'
		              createButtonLabel='Create User'
		              onCreate={onCreate}
		              onSearched={onSearched}
		              listData={listUsers}
		              renderItem={renderItem} getKeyOfItem={getKeyOfItem}
		              visible={!editUser.user}/>
		<UserPanel {...editUser} onClosed={onCreateOrEditDiscarded}/>
	</PlainNarrowContainer>;
};