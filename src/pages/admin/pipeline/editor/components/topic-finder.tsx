import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { UnitActionTopicRelated } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { ActionInput } from './action-input';

interface DropdownRect {
	top?: number;
	bottom?: number;
	left: number;
	width: number;
	atTop: boolean;
}

interface FilteredTopic {
	topic: QueriedTopicForPipeline;
	parts: Array<string>;
}

const TopicFinderContainer = styled.div`
	display: flex;
	position: relative;
	> input {
		width: 100%;
		cursor: pointer;
	}
`;
const Dropdown = styled.div.attrs<DropdownRect>(({ top, bottom, left, width, atTop }) => {
	return {
		style: {
			top: atTop ? 'unset' : top,
			bottom: atTop ? `calc(100vh - ${bottom}px)` : 'unset',
			left,
			minWidth: Math.max(width, 200),
			transformOrigin: atTop ? 'bottom' : 'top'
		}
	};
})<DropdownRect>`
	display: flex;
	position: fixed;
	flex-direction: column;
	z-index: 1000;
	max-height: 280px;
	transform: scaleY(0);
	transition: transform 300ms ease-in-out;
	pointer-events: none;
	background-color: var(--bg-color);
	border-radius: var(--border-radius);
	box-shadow: var(--console-primary-hover-shadow);
	overflow-x: hidden;
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
	&[data-expanded=true] {
		transform: scaleY(1);
		pointer-events: auto;
		&:before {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border-radius: var(--border-radius);
			background-color: var(--pipeline-bg-color);
			z-index: -1;
		}
	}
	> input {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		background-color: var(--bg-color);
		border-color: transparent;
		border-bottom: var(--border);
		&:hover,
		&:focus {
			border-bottom-color: var(--border-color);
			box-shadow: none;
		}
	}
	> div {
		height: 28px;
		line-height: 28px;
		padding: 0 var(--input-indent);
		&[data-visible=false] {
			display: none;
		}
		&:not(:nth-child(2)) {
			cursor: pointer;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			&:hover {
				color: var(--invert-color);
				background-color: var(--console-primary-color);
			}
			> span:nth-child(2n) {
				font-weight: 800;
				font-variant: petite-caps;
			}
		}
	}
`;

const filterTopic = (topics: Array<QueriedTopicForPipeline>, text: string): Array<FilteredTopic> => {
	text = text.trim();
	if (!text) {
		return [];
	} else {
		text = text.toUpperCase();
		return topics.map(topic => {
			const segments = topic.name.toUpperCase().split(text);
			if (segments.length === 1) {
				return null;
			} else {
				const length = text.length;
				const count = segments.length;
				let pos = 0;
				return {
					topic,
					parts: segments.reduce((all, segment, index) => {
						const len = segment.length;
						all.push(topic.name.substr(pos, len));
						pos += len;
						if (index !== count - 1) {
							all.push(topic.name.substr(pos, length));
							pos += length;
						}
						return all;
					}, [] as Array<string>)
				};
			}
		}).filter(x => x) as Array<FilteredTopic>;
	}
};

const isInFinder = (element: EventTarget | null, container: HTMLDivElement): boolean => {
	if (!element || element === window || element === document) {
		return false;
	}
	if (element === container) {
		return true;
	}
	let parent = (element as HTMLElement).parentElement;
	while (parent && parent !== document.body) {
		if (parent === container) {
			return true;
		}
		parent = parent.parentElement;
	}
	return false;
};

export const TopicFinder = (props: {
	holder: UnitActionTopicRelated
}) => {
	const { holder } = props;
	const { topicId: currentTopicId } = holder;

	const { store: { topics } } = usePipelineContext();
	// eslint-disable-next-line
	const topic = currentTopicId ? topics.find(topic => topic.topicId == currentTopicId) : (void 0);
	const { name: topicName = '' } = topic || {};
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [ expanded, setExpanded ] = useState(false);
	const [ dropdownRect, setDropdownRect ] = useState<DropdownRect>({ left: 0, width: 0, atTop: false });
	const [ searchText, setSearchText ] = useState<string>(topicName);
	const [ filterTopics, setFilterTopics ] = useState<Array<FilteredTopic>>(filterTopic(topics, topicName));
	const [ filterTimeout, setFilterTimeout ] = useState<number | null>(null);
	useEffect(() => {
		const collapse = (event: Event) => {
			const target = event.target;
			if (!isInFinder(target, containerRef.current!)) {
				setExpanded(false);
			}
		};
		window.addEventListener('scroll', collapse, true);
		window.addEventListener('focus', collapse, true);
		window.addEventListener('click', collapse, true);
		return () => {
			window.removeEventListener('scroll', collapse, true);
			window.removeEventListener('focus', collapse, true);
			window.removeEventListener('click', collapse, true);
		};
	});

	const expand = (count: number) => {
		if (!expanded) {
			const rect = inputRef.current!.getBoundingClientRect();
			const top = rect.top + rect.height + 2;
			const bottom = top + 28 * (count + 1);
			if (bottom > window.innerHeight) {
				setDropdownRect({ bottom: rect.top - 2, left: rect.left, width: rect.width, atTop: true });
			} else {
				setDropdownRect({ top, left: rect.left, width: rect.width, atTop: false });
			}
			setExpanded(true);
			searchInputRef.current!.focus();
			searchInputRef.current!.select();
		}
	};
	const onNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (filterTimeout) {
			clearTimeout(filterTimeout);
		}

		setSearchText(value);
		setFilterTimeout(setTimeout(() => {
			const filtered = filterTopic(topics, value);
			setFilterTimeout(null);
			setFilterTopics(filtered);
			expand(filtered.length);
		}, 200));
	};
	const onInputFocus = () => expand(filterTopics.length);
	const onTargetTopicClicked = (topic: QueriedTopicForPipeline) => () => {
		holder.topicId = topic.topicId;
		setExpanded(false);
		setSearchText(topic.name);
		setFilterTopics(filterTopic(topics, topic.name));
	};

	return <TopicFinderContainer ref={containerRef}>
		<ActionInput value={topicName} onChange={onNameChanged}
		             onFocus={onInputFocus} readOnly={true}
		             ref={inputRef}/>
		<Dropdown ref={dropdownRef} data-expanded={expanded} {...dropdownRect}
		          data-count={filterTopics.length + 1}>
			<ActionInput value={searchText} onChange={onNameChanged} ref={searchInputRef}/>
			<div data-visible={filterTopics.length === 0}>
				{!searchText ? 'Key in please...' : 'No matched.'}
			</div>
			{filterTopics.map(({ topic, parts }) => {
				return <div key={topic.topicId} onClick={onTargetTopicClicked(topic)}>
					{parts.map(part => <span key={v4()}>{part}</span>)}
				</div>;
			})}
		</Dropdown>
	</TopicFinderContainer>;
};