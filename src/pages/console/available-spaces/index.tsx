import { faPlug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import BackgroundImage from '../../../assets/console-spaces-background.png';
import Path, { toConnectedSpace } from '../../../common/path';
import { connectSpace } from '../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpace, ConsoleSpaceType } from '../../../services/console/types';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { NarrowContainer } from '../../component/console/page-container';
import { useConsoleContext } from '../context/console-context';

const AvailableSpacesContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-row-gap: var(--margin);
	padding-top: 64px;
`;
const AvailableSpace = styled.div`
	display: grid;
	grid-template-columns: 1fr 128px;
	border-radius: var(--border-radius);
	padding: calc(var(--margin) / 2) 0 calc(var(--margin) / 2) var(--margin);
	box-shadow: var(--console-shadow);
	overflow: hidden;
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-hover-shadow);
		> div:last-child {
			margin-left: 0;
			box-shadow: var(--console-primary-hover-shadow);
		}
	}
`;
const Title = styled.div`
	display: flex;
	align-items: center;
	font-size: 2em;
	font-family: var(--console-title-font-family);
`;
const Topics = styled.div`
	grid-row: 2;
	padding: calc(var(--margin) / 2) 0 0;
	opacity: 0.7;
	display: flex;
	flex-direction: column;
	> span {
		font-size: 0.8em;
		line-height: 20px;
	}
`;
const ConnectButton = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	grid-row: span 2;
	grid-column: 2;
	margin: calc(var(--margin) / -2) 0 calc(var(--margin) / -2) 128px;
	padding: 0 calc(var(--margin) / 2);
	font-variant: petite-caps;
	background-color: var(--console-primary-color);
	color: var(--invert-color);
	cursor: pointer;
	box-shadow: none;
	transition: all 300ms ease-in-out;
	overflow: hidden;
	> svg {
		padding-top: calc(var(--margin) / 2);
		flex-grow: 1;
		font-size: 4.5em;
	}
	> span {
		font-variant: petite-caps;
		height: 2em;
		justify-self: flex-start;
	}
`;
const Reminder = styled.div`
	display: block;
	font-size: 2em;
	font-family: var(--console-title-font-family);
	opacity: 0;
	height: 0;
	width: 100%;
	transition: all 300ms ease-in-out;
	text-align: center;
	&[data-visible=true] {
		opacity: 0.5;
		height: 100px;
	}
`;

const computeConnectedTimes = (connected: Array<ConnectedConsoleSpace>, spaceId: string) => {
	// eslint-disable-next-line
	return connected.filter(space => space.spaceId == spaceId).length;
};

export const AvailableSpaces = () => {
	const history = useHistory();
	const {
		spaces: {
			initialized, connected: connectedSpaces, available: availableSpaces,
			addSpace
		}
	} = useConsoleContext();

	const onConnectClicked = (availableSpace: ConsoleSpace) => async () => {
		try {
			const connected: ConnectedConsoleSpace = await connectSpace(availableSpace.spaceId, `Noname-${dayjs().format('YYYYMMDD')}`, ConsoleSpaceType.PRIVATE);
			addSpace(connected);
			history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE, connected.connectId));
		} catch (e) {
			console.groupCollapsed(`%cError on connect space.`, 'color:rgb(251,71,71)');
			console.error('SpaceId: ', availableSpace.spaceId);
			console.error(e);
			console.groupEnd();
		}
	};

	return <NarrowContainer background-image={BackgroundImage}>
		<NarrowPageTitle title='Available Spaces'/>
		<AvailableSpacesContainer>
			{availableSpaces
				.sort((a, b) => (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase()))
				.map((availableSpace) => {
					const { spaceId, name, topics } = availableSpace;
					const times = computeConnectedTimes(connectedSpaces, spaceId);
					return <AvailableSpace key={spaceId}>
						<Title>{name}</Title>
						<Topics>
							<span>{topics.length === 0 ? 'No topic.' : (topics.length === 1 ? '1 topic contained.' : `${topics.length} topics contained.`)}</span>
							<span>{times === 0 ? 'Not connect yet.' : `Connected for ${times} time(s).`}</span>
						</Topics>
						<ConnectButton onClick={onConnectClicked(availableSpace)}>
							<FontAwesomeIcon icon={faPlug}/>
							<span>Connect</span>
						</ConnectButton>
					</AvailableSpace>;
				})}
			<Reminder data-visible={initialized && availableSpaces.length === 0}>
				No available space, contact administrator for authorization please.
			</Reminder>
			<Reminder data-visible={!initialized}>
				Loading...
			</Reminder>
		</AvailableSpacesContainer>
	</NarrowContainer>;
};