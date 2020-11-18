import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faCaretDown, faCompactDisc, faCube, faGlobe, faPenAlt, faPoll } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { Fragment, useReducer, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../../common/path';
import { createGroup, createSubject, deleteSpace } from '../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpaceType } from '../../../services/console/types';
import Button, { ButtonType } from '../../component/button';
import { useDialog } from '../../context/dialog';
import { useConsoleContext } from '../context/console-context';
import { hideMenu, Menu, MenuItem, MenuSeparator, MenuState, showMenu, useMenu } from './components';
import { createRenameClickHandler } from './dialog';
import { useSpaceContext } from './space-context';

const Title = styled.div.attrs({
	'data-widget': 'console-space-title'
})`
	display: flex;
	position: relative;
	align-items: center;
	font-family: var(--console-title-font-family);
	padding-right: calc(var(--margin) / 2);
	margin-top: 14px;
	margin-bottom: 6px;
	height: 30px;
	cursor: pointer;
	> svg:first-child {
		margin-right: calc(var(--margin) / 5);
		opacity: 0.7;
	}
	> span {
		font-size: 1.2em;
	}
	> svg:nth-child(3) {
		margin-left: calc(var(--margin) / 5);
		width: 24px;
		opacity: 0.7;
		transition: all 300ms ease-in-out;
		&[data-menu-shown=true] {
			transform: rotateX(180deg);
		}
	}
`;

export const SpaceHeaderTitle = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;

	const history = useHistory();
	const dialog = useDialog();
	const { spaces: { deleteSpace: deleteSpaceFromMemory, spaceRenamed } } = useConsoleContext();
	const { openGroupIfCan, openSubjectIfCan } = useSpaceContext();
	const containerRef = useRef<HTMLDivElement>(null);
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ menuShown, setMenuShown ] = useState<MenuState>({
		left: 0,
		right: 0,
		top: 0,
		visible: false
	});
	useMenu({ containerRef: containerRef, state: menuShown, changeState: setMenuShown, offsetY: 6 });

	const onTitleClicked = () => showMenu({ containerRef, state: menuShown, changeState: setMenuShown, offsetY: 6 });
	const onAddGroupClicked = async () => {
		hideMenu({ containerRef, changeState: setMenuShown, offsetY: 6 });
		const newGroup = {
			// fake id
			groupId: '',
			name: 'Noname',
			subjects: []
		};
		space.groups.push(newGroup);
		await createGroup({ space, group: newGroup });
		openGroupIfCan({ space, group: newGroup });
	};
	const onAddSubjectClicked = async () => {
		hideMenu({ containerRef, changeState: setMenuShown, offsetY: 6 });
		const now = dayjs().format('YYYY/MM/DD HH:mm:ss');
		const newSubject = {
			subjectId: '',
			name: 'Noname',
			topicCount: 0,
			graphicsCount: 0,
			lastVisitTime: now,
			createdAt: now
		};
		space.subjects.push(newSubject);
		await createSubject({ space, subject: newSubject });
		openSubjectIfCan({ space, subject: newSubject });
	};
	const onRenameClicked = createRenameClickHandler({
		dialog, space,
		asFullName: () => space.name,
		renameObject: (options, newName) => space.name = newName,
		onRenamed: () => {
			spaceRenamed(space);
			forceUpdate();
		}
	});
	const onDeleteClicked = () => {
		const onDeleteConfirmClicked = async () => {
			try {
				await deleteSpace(space);
			} catch (e) {
				console.groupCollapsed(`%cError on delete space.`, 'color:rgb(251,71,71)');
				console.error('Space: ', space);
				console.error(e);
				console.groupEnd();
			}
			dialog.hide();
			history.replace(Path.CONSOLE_HOME);
			deleteSpaceFromMemory(space);
		};
		dialog.show(
			<div data-widget='dialog-console-delete'>
				<span>Are you sure to delete space?</span>
				<span data-widget='dialog-console-object'>{space.name}</span>
			</div>,
			<Fragment>
				<div style={{ flexGrow: 1 }}/>
				<Button inkType={ButtonType.PRIMARY} onClick={onDeleteConfirmClicked}>Yes</Button>
				<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
			</Fragment>
		);
	};

	return <Title onClick={onTitleClicked} ref={containerRef}>
		<FontAwesomeIcon icon={space.type === ConsoleSpaceType.PUBLIC ? faGlobe : faCompactDisc}/>
		<span>{space.name}</span>
		<FontAwesomeIcon icon={faCaretDown} data-menu-shown={menuShown.visible}/>
		<Menu {...menuShown} itemCount={4} separatorCount={1}>
			<MenuItem onClick={onAddGroupClicked}>
				<FontAwesomeIcon icon={faCube}/>
				<span>Add Group</span>
			</MenuItem>
			<MenuItem onClick={onAddSubjectClicked}>
				<FontAwesomeIcon icon={faPoll}/>
				<span>Add Subject</span>
			</MenuItem>
			<MenuSeparator/>
			<MenuItem onClick={onRenameClicked}>
				<FontAwesomeIcon icon={faPenAlt}/>
				<span>Rename</span>
			</MenuItem>
			<MenuItem onClick={onDeleteClicked}>
				<FontAwesomeIcon icon={faTrashAlt}/>
				<span>Delete Space</span>
			</MenuItem>
		</Menu>
	</Title>;
};
