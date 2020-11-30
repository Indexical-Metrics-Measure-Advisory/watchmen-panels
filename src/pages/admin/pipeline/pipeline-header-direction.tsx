import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useReducer, useRef } from 'react';
import { Directions, OperableHeaderSection, SearchPanel } from './components';
import { usePipelineContext } from './pipeline-context';
import { Direction } from './types';
import { useSearchPanel } from './utils';

export const PipelineHeaderDirection = () => {
	const {
		store: { topic, direction },
		changeDirection,
		addTopicChangedListener, removeTopicChangedListener
	} = usePipelineContext();
	const chooseDirectionRef = useRef<HTMLDivElement>(null);
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		addTopicChangedListener(forceUpdate);
		return () => {
			removeTopicChangedListener(forceUpdate);
		};
	});

	const { ref: searchPanelRef, state: searchPanelState, show: showSearchPanel, hide: hideSearchPanel } = useSearchPanel();

	const onShowSearchPanel = () => {
		const { top, left, height } = chooseDirectionRef.current!.getBoundingClientRect();
		// clear previous topic search results
		showSearchPanel(top + height - 5, left - 5);
	};
	const onChooseDirectionClicked = () => onShowSearchPanel();
	const onDirectionClicked = (direction: Direction) => (event: React.MouseEvent<HTMLSpanElement>) => {
		event.preventDefault();
		event.stopPropagation();
		changeDirection(direction);
		hideSearchPanel();
	};

	return <OperableHeaderSection onClick={onChooseDirectionClicked} ref={chooseDirectionRef}
	                              data-visible={topic != null}>
		<span>{direction || 'Choose Direction'}</span>
		<FontAwesomeIcon icon={faCaretDown}/>
		<SearchPanel {...searchPanelState} ref={searchPanelRef}>
			<Directions>
				<span onClick={onDirectionClicked(Direction.TO_SOURCE)}>{Direction.TO_SOURCE}</span>
				<span onClick={onDirectionClicked(Direction.TO_USAGE)}>{Direction.TO_USAGE}</span>
				<span onClick={onDirectionClicked(Direction.BOTH)}>{Direction.BOTH}</span>
			</Directions>
		</SearchPanel>
	</OperableHeaderSection>;
};