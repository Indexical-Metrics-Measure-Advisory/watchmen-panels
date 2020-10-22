import React, { useEffect, useRef, useState } from 'react';
import { ChartSettings } from '../../component/chart';
import { useChartSettingsContext } from './settings-context';

export const SettingsContainer = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode
}) => {
	const { children } = props;

	const settings = useChartSettingsContext();
	const containerRef = useRef<HTMLDivElement>(null);
	const [ gridColumns, setGridColumns ] = useState(1);
	useEffect(() => {
		if (!containerRef.current) {
			return;
		}

		// @ts-ignore
		const resizeObserver = new ResizeObserver(() => {
			if (!containerRef.current) {
				return;
			}

			const rect = containerRef.current.getBoundingClientRect();
			setGridColumns(rect.width > 600 ? 2 : 1);
		});
		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	});

	return <ChartSettings data-visible={settings.active} data-columns={gridColumns} ref={containerRef}>
		{children}
	</ChartSettings>;
};