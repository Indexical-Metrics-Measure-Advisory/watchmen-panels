import { faLink, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { CompositeMode, FindBy, TopicHolder } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { LinkButton } from '../../../../component/console/link-button';
import { usePipelineContext } from '../../pipeline-context';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { CompositeConditionRow } from './composite-condition-row';

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-self: start;
	height: 22px;
	border-radius: 11px;
	background-color: var(--pipeline-bg-color);
	cursor: pointer;
	box-shadow: 0 0 0 1px var(--border-color);
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	> span {
		padding-left: calc(var(--margin) / 2);
	}
	> svg {
		font-size: 0.8em;
		margin: 0 calc(var(--margin) / 3);
	}
`;

const Dialog = styled.div`
	display: block;
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.06);
	opacity: 0;
	pointer-events: none;
	user-select: none;
	transition: all 300ms ease-in-out;
	z-index: 99999;
	cursor: default;
	&[data-visible=true] {
		opacity: 1;
		pointer-events: auto;
	}
`;
const DialogContent = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	left: 20%;
	top: 10%;
	width: 60%;
	height: 80%;
	border-radius: var(--border-radius);
	background-color: var(--bg-color);
	box-shadow: var(--console-hover-shadow);
`;
const DialogTitle = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 40px;
	min-height: 40px;
	border-bottom: var(--border);
	padding: 0 calc(var(--margin) / 2);
	font-family: var(--console-title-font-family);
	font-size: var(--font-size);
	background-color: var(--pipeline-bg-color);
	> button {
		width: 24px;
		height: 24px;
		padding: 4px 6px;
		> svg {
			transition: all 300ms ease-in-out;
		}
		&:hover {
			> svg {
				transform: rotateZ(180deg);
			}
		}
	}
`;
const DialogBody = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow-x: hidden;
	overflow-y: auto;
	&::-webkit-scrollbar {
		background-color: transparent;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: transparent;
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
`;

export const TopicRowMatcher = (props: {
	label: (topic: QueriedTopicForPipeline) => string,
	holder: TopicHolder & FindBy,
}) => {
	const { label, holder } = props;

	const { store: { topics } } = usePipelineContext();
	const { addPropertyChangeListener, removePropertyChangeListener } = usePipelineUnitActionContext();
	const [ dialogVisible, setDialogVisible ] = useState(false);
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addPropertyChangeListener(PipelineUnitActionEvent.TOPIC_CHANGED, forceUpdate);
		return () => removePropertyChangeListener(PipelineUnitActionEvent.TOPIC_CHANGED, forceUpdate);
	});

	// eslint-disable-next-line
	const topic = topics.find(topic => topic.topicId == holder.topicId);

	const onShowFilterSettingsClicked = () => setDialogVisible(true);
	const onCloseClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setDialogVisible(false);
	};

	if (!holder.by) {
		holder.by = { mode: CompositeMode.AND, children: [] };
	}

	return <Container onClick={onShowFilterSettingsClicked}>
		<span>{topic ? 'No Filter' : 'Pick Topic First'}</span>
		<FontAwesomeIcon icon={faLink}/>
		{topic
			? <Dialog data-visible={dialogVisible}>
				<DialogContent>
					<DialogTitle>
						<div>{label(topic)}</div>
						<LinkButton ignoreHorizontalPadding={true} onClick={onCloseClicked}>
							<FontAwesomeIcon icon={faTimes}/>
						</LinkButton>
					</DialogTitle>
					<DialogBody>
						<CompositeConditionRow condition={holder.by} removable={false}/>
					</DialogBody>
				</DialogContent>
			</Dialog>
			: null}
	</Container>;
};