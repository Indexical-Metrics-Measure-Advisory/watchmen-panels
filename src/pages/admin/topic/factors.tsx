import { faCompressAlt, faExpandAlt, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import { v4 } from 'uuid';
import { parseFromCsv, parseFromJson } from '../../../services/admin/topic-import';
import { FactorType, Topic } from '../../../services/admin/types';
import { PrimaryObjectButton, SuccessObjectButton } from '../../component/object-button';
import { useNotImplemented } from '../../context/not-implemented';
import { useEditPanelContext } from '../component/edit-panel';
import { FactorRow } from './factor-row';
import { FactorTable } from './factor-table';
import { FactorTableBody } from './factor-table-body';
import { FactorTableFooter } from './factor-table-footer';
import { FactorTableHeader } from './factor-table-header';
import { FactorsTableButtons } from './factors-table-buttons';

export const Factors = (props: { topic: Topic, onDataChanged: () => void }) => {
	const { topic, onDataChanged } = props;

	const notImpl = useNotImplemented();
	const { changeBackgroundPosition } = useEditPanelContext();
	const [ expanded, setExpanded ] = useState(false);
	const [ max, setMax ] = useState(false);

	const onExpandToggleClicked = () => setExpanded(!expanded);
	const onFactorAddClicked = () => {
		topic.factors.push({ type: FactorType.TEXT });
		onDataChanged();
	};
	const onFactorExpandToggleClicked = () => {
		setMax(!max);
		if (max) {
			changeBackgroundPosition('left');
		} else {
			changeBackgroundPosition('top 50px left');
		}
	};
	const onFileSelected = (input: HTMLInputElement) => async () => {
		if (!input.files || input.files.length === 0) {
			return;
		}
		const file = input.files.item(0);
		if (!file) {
			return;
		}
		const name = file.name;
		switch (true) {
			case name.endsWith('.txt'):
			case name.endsWith('.csv'): {
				const content = await file.text();
				topic.factors = await parseFromCsv(content);
				onDataChanged();
				break;
			}
			case name.endsWith('.json'): {
				const content = await file.text();
				topic.factors = await parseFromJson(content);
				onDataChanged();
				break;
			}
			case name.endsWith('.xml'):
				break;
			default:
				notImpl.show();
		}
	};
	const onImportClicked = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = false;
		input.accept = '.txt,.csv,.json';
		input.onchange = onFileSelected(input);
		input.click();
	};

	const factorCount = topic.factors.length;
	const buttonLabel = factorCount === 0 ? 'No Factor Defined' : (factorCount === 1 ? '1 Factor' : `${factorCount} Factors`);

	return <Fragment>
		<FactorsTableButtons onClick={onExpandToggleClicked} data-expanded={expanded}>
			<span>{buttonLabel}</span>
			<FontAwesomeIcon icon={expanded ? faCompressAlt : faExpandAlt}/>
		</FactorsTableButtons>
		<FactorTable expanded={expanded} factorCount={factorCount} data-max={max}>
			<FactorTableHeader data-max={max}>
				<div>Name</div>
				<div>Label</div>
				<div>Type</div>
				<div>Description</div>
			</FactorTableHeader>
			<FactorTableBody data-max={max}>
				{topic.factors.map(factor => {
					if (!factor.factorId) {
						factor.factorId = v4();
					}
					return <FactorRow topic={topic} factor={factor} max={max}
					                  onDataChanged={onDataChanged}
					                  key={factor.factorId}/>;
				})}
			</FactorTableBody>
			<FactorTableFooter>
				<PrimaryObjectButton onClick={onFactorAddClicked}>
					<FontAwesomeIcon icon={faPlus}/>
					<span>Append Factor</span>
				</PrimaryObjectButton>
				<PrimaryObjectButton onClick={onFactorExpandToggleClicked} data-max={max}>
					<FontAwesomeIcon icon={max ? faCompressAlt : faExpandAlt}/>
					<span>{max ? 'Shrink Table' : 'Expand Table'}</span>
				</PrimaryObjectButton>
				<SuccessObjectButton onClick={onImportClicked}>
					<FontAwesomeIcon icon={faUpload}/>
					<span>Import from File</span>
				</SuccessObjectButton>
			</FactorTableFooter>
		</FactorTable>
	</Fragment>;
};
