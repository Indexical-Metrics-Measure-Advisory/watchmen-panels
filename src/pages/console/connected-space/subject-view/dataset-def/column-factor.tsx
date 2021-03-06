import React from 'react';
import styled from 'styled-components';
import {
	ConsoleSpaceSubjectDataSetColumn,
	ConsoleSpaceSubjectDataSetJoin
} from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { useSubjectContext } from '../context';

const ColumnFactorContainer = styled.div`
	background-color: var(--console-subject-topic-bg-color);
	flex-grow: 1;
	flex-basis: 0;
	//max-width: calc(50% - 15px);
	> div,
	> div[data-widget=dropdown]:focus {
		font-size: 0.8em;
		border-radius: 0;
		margin-left: -1px;
		width: calc(100% + 1px);
	}
`;

export const ColumnFactor = (props: {
	column: ConsoleSpaceSubjectDataSetColumn | ConsoleSpaceSubjectDataSetJoin;
	onFactorChanged: () => void;
	propNames: [ 'topicId', 'factorId' ] | [ 'secondaryTopicId', 'secondaryFactorId' ]
}) => {
	const { column, onFactorChanged, propNames: [ topicPropName, factorPropName ] } = props;

	const topicId = column[topicPropName];
	const factorId = column[factorPropName];

	const { defs: { factors: factorOptions } } = useSubjectContext();

	const onColumnFactorChanged = async ({ value }: DropdownOption) => {
		column[factorPropName] = value as string;
		onFactorChanged();
	};

	return <ColumnFactorContainer>
		<Dropdown options={factorOptions[topicId || ''] || []}
		          value={factorId} onChange={onColumnFactorChanged}/>
	</ColumnFactorContainer>;
};