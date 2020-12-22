import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import UserBackground from '../../../assets/user-background.png';
import { useForceUpdate } from '../../../common/utils';
import { DataPage } from '../../../services/admin/types';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PlainNarrowContainer } from '../../component/console/page-container';
import { DangerObjectButton, PrimaryObjectButton } from '../pipeline/editor/components/object-button';
import { EditPanel } from './edit-panel';
import { EditPanelButtons } from './edit-panel-buttons';
import { SingleSearch } from './single-search';

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

const Editor = <Entity extends object>(props: {
	entityLabel: string;
	entity?: Entity
	createEntity: (fake: boolean) => Entity;
	saveEntity: (entity: Entity) => Promise<void>;
	isEntityOnCreate: (entity: Entity) => boolean;
	renderEditContent: (entity: Entity, onDataChanged: () => void) => React.ReactNode;
	onClosed: () => void;
}) => {
	const {
		entityLabel,
		entity: originEntity,
		createEntity, saveEntity, isEntityOnCreate,
		onClosed,
		renderEditContent
	} = props;
	const {
		// create a fake entity here for render editor background
		// for animation purpose
		entity = createEntity(true)
	} = props;

	const [ dataChanged, setDataChanged ] = useState(false);
	const [ dataSaving, setDataSaving ] = useState(false);
	const [ dataSaved, setDataSaved ] = useState(false);
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		setDataSaved(false);
		setDataSaving(false);
		setDataChanged(false);
	}, [ entity ]);

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
	const onConfirmClicked = async () => {
		setDataSaving(true);
		setDataChanged(false);
		await saveEntity(entity);
		onDataSaved();
	};
	const onCloseClicked = () => onClosed();

	const visible = !!originEntity;
	const onEditing = !isEntityOnCreate(entity);
	const title = onEditing ? `An Exists ${entityLabel}` : `A New ${entityLabel}`;
	const kind = dataSaved ? 'saved' : (dataSaving ? 'saving' : (dataChanged ? 'changed' : ''));
	const message = dataSaved ? 'Data Saved.' : (dataSaving ? 'Data Saving...' : (dataChanged ? 'Data Changed.' : ''));

	return <EditPanel title={title} background={UserBackground} visible={visible}>
		{renderEditContent(entity, onDataChanged)}
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

export const SearchAndEditPanel = <Entity extends object, QueriedEntity extends object>(props: {
	title: string;
	searchPlaceholder?: string;
	createButtonLabel?: string;
	entityLabel: string;
	createEntity: (fake: boolean) => Entity;
	fetchEntityAndCodes: (queriedEntity: QueriedEntity) => Promise<{ entity: Entity }>;
	fetchEntityList: (options: { search: string; pageNumber?: number; pageSize?: number }) => Promise<DataPage<QueriedEntity>>;
	saveEntity: (entity: Entity) => Promise<void>;
	isEntityOnCreate: (entity: Entity) => boolean;
	renderEntityInList: (entity: QueriedEntity, onEdit: (entity: QueriedEntity) => (() => void)) => React.ReactNode;
	getKeyOfEntity: (entity: QueriedEntity) => string;
	renderEditContent: (entity: Entity, onDataChanged: () => void) => React.ReactNode;
}) => {
	const {
		title, searchPlaceholder, createButtonLabel, entityLabel,
		createEntity,
		fetchEntityAndCodes, fetchEntityList,
		saveEntity, isEntityOnCreate,
		renderEntityInList,
		getKeyOfEntity,
		renderEditContent
	} = props;

	const [ editEntity, setEditEntity ] = useState<{ entity?: Entity }>({});

	const onCreate = () => setEditEntity({ entity: createEntity(false) });
	const onEdit = (queriedEntity: QueriedEntity) => async () => {
		const result = await fetchEntityAndCodes(queriedEntity);
		setEditEntity(result);
	};
	const onSearched = () => setEditEntity({});
	const onCreateOrEditDiscarded = () => setEditEntity({});
	const renderItem = (entity: QueriedEntity) => renderEntityInList(entity, onEdit);

	return <PlainNarrowContainer>
		<NarrowPageTitle title={title}/>
		<SingleSearch searchPlaceholder={searchPlaceholder}
		              createButtonLabel={createButtonLabel}
		              onCreate={onCreate}
		              onSearched={onSearched}
		              listData={fetchEntityList}
		              renderItem={renderItem} getKeyOfItem={getKeyOfEntity}
		              visible={!editEntity.entity}/>
		<Editor entityLabel={entityLabel}
		        entity={editEntity.entity}
		        createEntity={createEntity}
		        saveEntity={saveEntity}
		        isEntityOnCreate={isEntityOnCreate}
		        renderEditContent={renderEditContent}
		        onClosed={onCreateOrEditDiscarded}/>
	</PlainNarrowContainer>;
};