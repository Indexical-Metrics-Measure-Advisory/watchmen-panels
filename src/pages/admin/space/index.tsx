import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faLink, faTags, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from "react";
import SpaceBackground from '../../../assets/space-background.png';
import { fetchSpace, listSpaces, saveSpace } from '../../../services/admin/space';
import { QueriedSpace, QueriedUserGroupForGroupsHolder, Space } from '../../../services/admin/types';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { GroupPicker } from '../component/group-picker';
import { PropInput } from '../component/prop-input';
import { PropInputLines } from '../component/prop-input-lines';
import { PropLabel } from '../component/prop-label';
import { SearchAndEditPanel } from '../component/search-and-edit-panel';
import { SingleSearchItemCard } from '../component/single-search';

export const Spaces = () => {
	const createCodes = () => ({ groups: [] as Array<QueriedUserGroupForGroupsHolder> });

	const [ codes, setCodes ] = useState(createCodes());

	const createEntity = (fake: boolean) => {
		if (!fake) {
			setCodes({ groups: [] });
		}
		return { groupIds: [] } as Space;
	};
	const fetchEntityAndCodes = async (queriedSpace: QueriedSpace) => {
		const { space, groups } = await fetchSpace(queriedSpace.spaceId);
		setCodes({ groups });
		return { entity: space };
	};
	const fetchEntityList = listSpaces;
	const saveEntity = saveSpace;
	const isEntityOnCreate = (space: Space) => !space.spaceId;
	const renderItemInList = (space: QueriedSpace, onEdit: (space: QueriedSpace) => (() => void)) => {
		return <SingleSearchItemCard key={space.spaceId} onClick={onEdit(space)}>
			<div>{space.name}</div>
			<div>{space.description}</div>
			<div>
				<TooltipCarvedButton tooltip='Topics Count' center={true}>
					<FontAwesomeIcon icon={faTags}/>
					<span>{space.topicCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Reports Count' center={true}>
					<FontAwesomeIcon icon={faChartBar}/>
					<span>{space.reportCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In User Groups' center={true}>
					<FontAwesomeIcon icon={faUsers}/>
					<span>{space.groupCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='Connections Count' center={true}>
					<FontAwesomeIcon icon={faLink}/>
					<span>{space.connectionCount}</span>
				</TooltipCarvedButton>
			</div>
		</SingleSearchItemCard>;
	};
	const getKeyOfEntity = (space: QueriedSpace) => space.spaceId;

	const onPropChange = (space: Space, prop: 'name' | 'description', onDataChanged: () => void) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (space[prop] !== event.target.value) {
			space[prop] = event.target.value;
			onDataChanged();
		}
	};
	const renderEditContent = (space: Space, onDataChanged: () => void) => {
		return <Fragment>
			<PropLabel>Space Name:</PropLabel>
			<PropInput value={space.name || ''} onChange={onPropChange(space, 'name', onDataChanged)}/>
			<PropLabel>Description:</PropLabel>
			<PropInputLines value={space.description || ''}
			                onChange={onPropChange(space, 'description', onDataChanged)}/>
			<PropLabel>Group:</PropLabel>
			<GroupPicker label='Grant to Group' holder={space} codes={codes} onDataChanged={onDataChanged}/>
		</Fragment>;
	};

	return <SearchAndEditPanel title='Spaces'
	                           searchPlaceholder='Search by space name, topic name, report name, description, etc.'
	                           createButtonLabel='Create Space'
	                           entityLabel='Space'
	                           entityImage={SpaceBackground}
	                           createEntity={createEntity}
	                           fetchEntityAndCodes={fetchEntityAndCodes}
	                           fetchEntityList={fetchEntityList}
	                           saveEntity={saveEntity}
	                           isEntityOnCreate={isEntityOnCreate}
	                           renderEntityInList={renderItemInList}
	                           getKeyOfEntity={getKeyOfEntity}
	                           renderEditContent={renderEditContent}/>;
};