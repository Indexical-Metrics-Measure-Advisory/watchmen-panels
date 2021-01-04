import React, { Fragment, RefObject, useEffect, useRef } from 'react';
import { DataSetScrollHorizontalShade, DataSetScrollVerticalShade } from './dataset-table-components';

export const DataTableScrollShade = (props: {
	wrapperRef: RefObject<HTMLDivElement>;
	dataTableRef: RefObject<HTMLDivElement>;
	visible: boolean;
}) => {
	const { wrapperRef, dataTableRef, visible } = props;

	const wrapper = wrapperRef.current;
	const dataTable = dataTableRef.current;

	const verticalScrollRef = useRef<HTMLDivElement>(null);
	const horizontalScrollRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!visible || !dataTable || !verticalScrollRef.current || !horizontalScrollRef.current) {
			return;
		}
		const { scrollTop, scrollLeft } = dataTable;
		verticalScrollRef.current.scrollTop = scrollTop;
		horizontalScrollRef.current.scrollLeft = scrollLeft;
	});

	if (!wrapper || !dataTable) {
		return null;
	}

	const { left: wrapperLeft } = wrapper.getBoundingClientRect();
	const { clientWidth, clientHeight, scrollWidth, scrollHeight, offsetWidth, offsetHeight } = dataTable;
	const { left: horizontalScrollLeft } = dataTable.getBoundingClientRect();

	return <Fragment>
		<DataSetScrollVerticalShade width={offsetWidth - clientWidth}
		                            heightOffset={offsetHeight - clientHeight}
		                            visible={visible}
		                            ref={verticalScrollRef}>
			<div style={{ width: 1, height: scrollHeight }}/>
		</DataSetScrollVerticalShade>
		<DataSetScrollHorizontalShade left={horizontalScrollLeft - wrapperLeft} height={offsetHeight - clientHeight}
		                              widthOffset={offsetWidth - clientWidth}
		                              visible={visible}
		                              ref={horizontalScrollRef}>
			<div style={{ width: scrollWidth, height: 1 }}/>
		</DataSetScrollHorizontalShade>
		{/* bottom left paster */}
		<div style={{
			display: visible ? 'block' : 'none',
			position: 'absolute',
			bottom: 0,
			left: 0,
			width: horizontalScrollLeft - wrapperLeft,
			height: offsetHeight - clientHeight,
			borderTop: 'var(--border)',
			backgroundColor: 'var(--bg-color)'
		}}/>
		{/* bottom right paster */}
		<div style={{
			display: visible ? 'block' : 'none',
			position: 'absolute',
			bottom: 0,
			right: 0,
			width: offsetWidth - clientWidth,
			height: offsetHeight - clientHeight,
			backgroundColor: 'var(--bg-color)'
		}}/>
	</Fragment>;
};