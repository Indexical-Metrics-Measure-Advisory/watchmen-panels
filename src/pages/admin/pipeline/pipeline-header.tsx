import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { LinkButton } from '../../component/console/link-button';
import { usePipelineContext } from './pipeline-context';

const Header = styled.div.attrs({
	'data-widget': 'console-pipeline-header'
})`
	display: flex;
	position: sticky;
	grid-column: span 2;
	height: var(--console-space-header-height);
	&:after {
		content: '';
		display: block;
		position: absolute;
		z-index: 1;
		bottom: 0;
		width: 100%;
		height: 1px;
		background-color: var(--border-color);
	}
`;
const Slice = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	font-family: var(--console-title-font-family);
	font-size: 1.6em;
	padding: 0 calc(var(--margin) / 3);
	margin-right: calc(var(--margin) / 3);
	&:first-child {
		padding-left: calc(var(--margin) / 2);
	}
	&:before,
	&:after {
		content: '';
		display: block;
		position: absolute;
		top: -2px;
		height: calc(var(--console-space-header-height) + 3px);
		border-right: 0;
		border-top: calc(var(--console-space-header-height) / 2 + 1.5px) solid transparent;
		border-bottom: calc(var(--console-space-header-height) / 2 + 1.5px) solid transparent;
		border-left: 10px solid var(--border-color);
	}
	&:before {
		right: -10px;
	}
	&:after {
		right: -9px;
		border-left-color: var(--bg-color);
	}
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;
const Buttons = styled.div`
	display: flex;
	align-items: center;
	padding-right: calc(var(--margin) / 2);
	> button {
		font-size: 1.4em;
		padding: 8px;
	}
`;

const MenuToggleButton = () => {
	const {
		store: { menuVisible },
		changeMenuVisible, addMenuVisibilityListener, removeMenuVisibilityListener,
		addFlowChangedListener, removeFlowChangedListener
	} = usePipelineContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		addMenuVisibilityListener(forceUpdate);
		addFlowChangedListener(forceUpdate);
		return () => {
			removeMenuVisibilityListener(forceUpdate);
			removeFlowChangedListener(forceUpdate);
		};
	});

	const onMenuClicked = () => {
		changeMenuVisible(!menuVisible);
	};

	return <LinkButton ignoreHorizontalPadding={true} onClick={onMenuClicked}>
		<FontAwesomeIcon icon={faBars}/>
	</LinkButton>;

};
export const PipelineHeader = () => {
	const {
		store: { topic },
		addFlowChangedListener, removeFlowChangedListener
	} = usePipelineContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		addFlowChangedListener(forceUpdate);
		return () => removeFlowChangedListener(forceUpdate);
	});

	return <Header>
		<Slice>Pipelines</Slice>
		{topic ? <Slice>{topic.name}</Slice> : null}
		<Placeholder/>
		<Buttons>
			<MenuToggleButton/>
		</Buttons>
	</Header>;
};