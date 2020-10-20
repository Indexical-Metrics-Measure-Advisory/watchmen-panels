import React, { Fragment } from 'react';
import styled from 'styled-components';
import { ObjectItem } from '../component/object-list';
import { GuideDataColumn, GuideDataObjectColumn } from '../guide-context';
import { asDisplayName, asDisplayType } from '../utils';

const ObjectColumn = styled(ObjectItem)<{ indent?: number }>`
	cursor: default;
	text-indent: calc(0.8em * ${({ indent }) => (indent || 0) + 1});
	font-size: 0.8em;
	&:hover {
		background-color: var(--hover-color);
	}
	&[data-visible=false] {
		height: 0;
		border-bottom: 0;
	}
	> span:last-child {
		transform: scale(0.8);
		transform-origin: bottom;
		text-transform: capitalize;
	}
`;

export const NativeColumn = (props: { column: GuideDataColumn, visible: boolean, indent?: number }) => {
	const { column, visible, indent = 0 } = props;

	if (!column.native) {
		return null;
	}

	const name = asDisplayName(column);
	const label = column.label;
	const type = asDisplayType(column);
	return <Fragment key={column.name}>
		<ObjectColumn indent={indent} data-visible={visible}>
			<span>{label || name}</span>
			<span>{type ? `(${type})` : null}</span>
		</ObjectColumn>
		{((column as GuideDataObjectColumn).childTypes || []).map(childColumn => {
			return <NativeColumn column={childColumn} visible={visible} indent={indent + 1} key={childColumn.name}/>;
		})}
	</Fragment>;
};
