import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';
import { PaletteContextProvider } from './palette-context';
import { TopicRect } from './topic-rect';
import { TopicRelation } from './topic-relation';

const PaletteContainer = styled.div`
	position: relative;
	flex-grow: 1;
	background-image: radial-gradient(var(--console-waive-color) 1px, transparent 0);
	background-size: 48px 48px;
	overflow: hidden;
`;
const PaletteSvg = styled.svg`
	display: block;
	position: absolute;
	top: 0;
	left: 0;
`;

export const Palette = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;
	const { topics, relations = [] } = space;

	const containerRef = useRef<HTMLDivElement>(null);
	const [ svgSize, setSvgSize ] = useState<{ width: number, height: number }>({
		width: 300,
		height: 300
	});
	useEffect(() => {
		const ref = containerRef.current;
		if (ref) {
			const resize = () => setSvgSize({ width: ref.clientWidth, height: ref.clientHeight });
			// @ts-ignore
			const resizeObserver = new ResizeObserver(resize);
			resizeObserver.observe(ref);
			resize();
			return () => resizeObserver.disconnect();
		}
	}, []);

	return <PaletteContainer ref={containerRef}>
		<PaletteContextProvider space={space}>
			<PaletteSvg width={svgSize.width} height={svgSize.height}
			            viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}>
				{topics.map(topic => {
					return <TopicRect topic={topic} key={topic.code}/>;
				})}
				{relations.map(relation => {
					return <TopicRelation space={space} relation={relation} key={relation.relationId}/>;
				})}
			</PaletteSvg>
		</PaletteContextProvider>
	</PaletteContainer>;
};
