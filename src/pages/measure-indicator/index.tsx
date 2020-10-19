import { faAngleUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path, { toDomain } from '../../common/path';
import Button, { BigButton, ButtonType } from '../component/button';
import Input from '../component/input';
import { GuideData, GuideDataColumn, GuideDataObjectColumn, useGuideContext } from '../guide/guide-context';

const ObjectsContainer = styled.div`
	display: flex;
	margin: 0 var(--margin);
	border-radius: calc(var(--border-radius) * 2);
	border: var(--border);
	min-height: 350px;
	overflow: hidden;
`;
const ObjectsList = styled.div`
	position: relative;
	width: 30%;
	display: flex;
	flex-direction: column;
	border-right: var(--border);
	&[data-has-data=false] {
		width: 100%;
		border-right: 0;
		> div {
			display: flex;
		}
		~ div {
			display: none;
		}
	}
`;
const ObjectItem = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	height: 32px;
	padding: 0 calc(var(--margin) / 2);
	cursor: pointer;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
	border-bottom: var(--border);
	transition: all 300ms ease-in-out;
	&:hover {
		background-color: var(--hover-color);
	}
	&[data-active=false] + div {
		height: 0;
	}
	&[data-active=true] {
		background-color: var(--active-color);
		color: var(--invert-color);
		> svg {
			transform: rotateX(180deg);
		}
	}
	> span {
		flex-grow: 1;
	}
	> svg {
		transition: all 300ms ease-in-out;
	}
`;
const NoObjects = styled.div`
	display: none;
	height: 100%;
	align-items: center;
	justify-content: center;
	font-size: 1.2em;
	font-weight: var(--font-bold);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		transform: scale(1.05);
	}
	> span {
		margin: 0 var(--letter-gap);
		text-decoration: underline;
	}
`;
const ObjectColumn = styled.div<{ indent?: number }>`
	display: flex;
	align-items: center;
	border-bottom: var(--border);
	font-size: 0.8em;
	height: 27px;
	padding: 0 calc(var(--margin) / 2);
	text-indent: calc(0.8em * ${({ indent }) => (indent || 0) + 1});
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	transition: all 300ms ease-in-out;
	&:last-child {
		border-bottom-color: transparent;
	}
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
const ObjectDetail = styled.div`
	width: 70%;
	display: flex;
	flex-direction: column;
	opacity: 0;
	transition: all 300ms ease-in-out;
	&[data-visible=true] {
		opacity: 1;
	}
`;
const ObjectDetailHeader = styled.div`
	display: grid;
	grid-template-columns: 30% 30% calc(40% - 32px) 32px;
	border-bottom: var(--border);
	align-items: center;
	> button {
		border-radius: 100%;
		height: 27px;
		width: 27px;
		padding: 6px 0;
		&:hover {
			border-color: var(--primary-color);
			background-color: var(--primary-color);
			color: var(--invert-color);
			opacity: 1;
		}
	}
`;
const ObjectDetailHeaderCell = styled.div`
	height: 31px;
	padding: 0 calc(var(--margin) / 2);
	display: flex;
	align-items: center;
`;
const LabelInput = styled(Input)`
	height: 27px;
	margin-left: calc(var(--input-indent) * -1);
	border-color: transparent;
	transition: all 300ms ease-in-out;
	font-size: 0.8em;
	&:hover {
		border-color: var(--primary-color);
	}
	&:focus {
		border-color: var(--border-color);
	}
`;
const Operations = styled.div`
	display: flex;
	margin-top: var(--margin);
	padding: 0 var(--margin);
	> button:not(:first-child) {
		margin-left: var(--margin);
	}
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

const asDisplayName = (column: GuideDataColumn): string => {
	const name = column.name || '';
	if (name.indexOf('.') !== -1) {
		return name.split('.').reverse()[0];
	} else {
		return name || 'Nonamed';
	}
};
const asDisplayType = (column: GuideDataColumn): string => {
	return column.type;
};


export default () => {
	const history = useHistory();
	const guide = useGuideContext();

	const data = (guide.getData() || {}) as GuideData;
	const objectKeys = Object.keys(data).sort((k1, k2) => k1.localeCompare(k2));

	const [ activeKey, setActiveKey ] = useState<string | null>(objectKeys.length !== 0 ? objectKeys[0] : null);

	const onNoObjectsClicked = () => history.push(toDomain(Path.GUIDE_IMPORT_DATA, guide.getDomain().code));
	const onMappingFactorsClicked = () => history.push(toDomain(Path.GUIDE_MAPPING_FACTOR, guide.getDomain().code));
	const onNextClicked = () => history.push(toDomain(Path.GUIDE_BUILD_METRICS, guide.getDomain().code));

	const onObjectClicked = (key: string) => () => {
		if (key === activeKey) {
			setActiveKey(null);
		} else {
			setActiveKey(key);
		}
	};
	const activeObject = activeKey ? data[activeKey!] : null;

	const renderNativeColumns = (columns: Array<GuideDataColumn> = [], visible: boolean) => {
		return columns.map(column => {
			const name = asDisplayName(column);
			const label = column.label;
			const type = asDisplayType(column);
			const indent = (column.name || '').split('').filter(ch => ch === '.').length;
			const childTypes = (column as GuideDataObjectColumn).childTypes || [];
			return <Fragment key={column.name}>
				<ObjectColumn indent={indent} data-visible={visible}>
					<span>{label || name}</span>
					<span>{type ? `(${type})` : null}</span>
				</ObjectColumn>
				{childTypes.length !== 0 ? renderNativeColumns(childTypes, visible) : null}
			</Fragment>;
		});
	};

	return <Fragment>
		<ObjectsContainer>
			<ObjectsList data-has-data={objectKeys.length !== 0} data-has-active={activeKey != null}>
				{objectKeys.map(key => {
					return <Fragment key={key}>
						<ObjectItem onClick={onObjectClicked(key)} data-active={key === activeKey}>
							<span>{key}</span>
							<FontAwesomeIcon icon={faAngleUp}/>
						</ObjectItem>
						{renderNativeColumns(data[key].columns, key === activeKey)}
					</Fragment>;
				})}
				<NoObjects onClick={onNoObjectsClicked}>
					No valid data imported, back and <span>Import Data</span> again.
				</NoObjects>
			</ObjectsList>
			<ObjectDetail data-visible={activeKey != null}>
				<ObjectDetailHeader>
					<ObjectDetailHeaderCell>Name</ObjectDetailHeaderCell>
					<ObjectDetailHeaderCell>Label</ObjectDetailHeaderCell>
					<ObjectDetailHeaderCell>Calc.</ObjectDetailHeaderCell>
					<Button><FontAwesomeIcon icon={faPlus}/></Button>
				</ObjectDetailHeader>
			</ObjectDetail>
		</ObjectsContainer>
		<Operations>
			<BigButton onClick={onMappingFactorsClicked}>Check Factors</BigButton>
			<Placeholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</Operations>
	</Fragment>;
}