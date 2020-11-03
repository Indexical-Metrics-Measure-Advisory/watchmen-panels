import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { uuid } from 'uuidv4';
import Path, { toDomain } from '../../../common/path';
import { BigButton, ButtonType } from '../../component/button';
import { useAlert } from '../../context/alert';
import { useResponsive } from '../../context/responsive';
import { NoObjects, ObjectsContainer, ObjectsList } from '../component/object-list';
import { OperationBar, OperationBarPlaceholder } from '../component/operations-bar';
import { useGuideContext } from '../guide-context';
import { AddParagraphButton } from './add-paragraph-button';
import { AutonomousCustomChart } from './autonomous-custom-chart';
import { CustomCharts } from './custom-charts';
import { HiddenChartsStackButton } from './hidden-charts-stack-button';
import { HideOnPrintProvider } from './hide-on-print-context';
import { MetricsContainer } from './metrics-container';
import { Paragraphs, ParagraphText } from './paragraphs';
import { PredefinedCharts } from './predefined-charts';
import { PrintPdfButton } from './print-pdf-button';
import { QuitExportButton } from './quit-export';
import { SavedCustomChartContextProvider } from './saved-custom-chart-context';

export default () => {
	const history = useHistory();
	const guide = useGuideContext();
	const responsive = useResponsive();
	const alert = useAlert();

	const [ rnd, setRnd ] = useState(false);
	const [ texts, setTexts ] = useState<Array<ParagraphText>>([]);
	const metricsContainerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!rnd || metricsContainerRef.current == null) {
			return;
		}

		const onBeforePrint = () => {
			const container = metricsContainerRef.current!;
			const containerRect = container.getBoundingClientRect();
			const charts = container.querySelectorAll('.react-draggable');
			const { width, height } = Array.from(charts).reduce((size, chart) => {
				const rect = chart.getBoundingClientRect();
				size.width = Math.max(size.width, rect.left + rect.width - containerRect.left);
				size.height = Math.max(size.height, rect.top + rect.height - containerRect.top);
				return size;
			}, { width: 0, height: 0 });
			container.style.width = `${width}px`;
			container.style.height = `${height}px`;
			document.documentElement.setAttribute('data-on-print', 'true');
		};
		const onAfterPrint = () => {
			const container = metricsContainerRef.current!;
			container.style.width = ``;
			container.style.height = ``;
			document.documentElement.removeAttribute('data-on-print');
		};
		window.addEventListener('beforeprint', onBeforePrint);
		window.addEventListener('afterprint', onAfterPrint);

		const charts = metricsContainerRef.current.querySelectorAll('.react-draggable');
		let top = 0;
		let left = 0;
		Array.from(charts).forEach(chart => {
			const div = chart as HTMLDivElement;
			div.style.width = '8.5cm';
			div.style.height = '6cm';
			div.style.top = `${top}cm`;
			div.style.left = `${left}cm`;
			if (left === 0) {
				left = 9.6;
			} else {
				left = 0;
				top += 6 + 1;
			}
		});

		return () => {
			window.removeEventListener('beforeprint', onBeforePrint);
			window.removeEventListener('afterprint', onAfterPrint);
		};
	}, [ rnd ]);

	const hasTopic = Object.keys(guide.getData() || {}).length !== 0;
	const onMeasureIndicatorsClicked = () => {
		history.push(toDomain(Path.GUIDE_MEASURE_INDICATOR, guide.getDomain().code));
	};
	const onSaveAsPdfClicked = () => window.print();
	const onStartRndClicked = () => {
		if (responsive.mobile) {
			alert.show('Export doesn\'t support in mobile device.');
			return;
		}
		if (!hasTopic) {
			alert.show('No topic described.');
			return;
		}
		setRnd(true);
	};
	const onQuitExportClicked = () => setRnd(false);
	const onAddParagraphClicked = () => setTexts([ ...texts, { text: 'New paragraph content here.', uuid: uuid() } ]);

	const onNoObjectsClicked = () => history.push(toDomain(Path.GUIDE_IMPORT_DATA, guide.getDomain().code));

	return <HideOnPrintProvider>
		{
			hasTopic
				? <MetricsContainer data-rnd={rnd} ref={metricsContainerRef}>
					<PredefinedCharts rnd={rnd}/>
					<SavedCustomChartContextProvider>
						<CustomCharts rnd={rnd}/>
						<AutonomousCustomChart rnd={rnd}/>
					</SavedCustomChartContextProvider>
					<Paragraphs rnd={rnd} texts={texts} onTextsChanged={setTexts}/>
				</MetricsContainer>
				: <ObjectsContainer>
					<ObjectsList data-has-data={false} data-has-active={false}>
						<NoObjects onClick={onNoObjectsClicked}>
							No valid data imported, back and <span>Import Data</span> again.
						</NoObjects>
					</ObjectsList>
				</ObjectsContainer>
		}
		<OperationBar>
			{rnd ? null : <BigButton onClick={onMeasureIndicatorsClicked}>Adjust Indicators</BigButton>}
			<OperationBarPlaceholder/>
			{rnd ? null : <BigButton inkType={ButtonType.PRIMARY} onClick={onStartRndClicked}>Export</BigButton>}
		</OperationBar>
		<AddParagraphButton rnd={rnd} onAdd={onAddParagraphClicked}/>
		<PrintPdfButton rnd={rnd} onPrint={onSaveAsPdfClicked}/>
		<HiddenChartsStackButton rnd={rnd}/>
		<QuitExportButton rnd={rnd} onQuited={onQuitExportClicked}/>
	</HideOnPrintProvider>;
}