import React from 'react';
import { listReportsForSpace } from '../../../services/admin/report';
import { QueriedReportForSpace, Space } from '../../../services/admin/types';
import { PropItemPicker } from './prop-items-picker';

const initReportArray = (space: Space) => space.reportIds = space.reportIds || [];
const addReportToSpace = (space: Space, report: QueriedReportForSpace) => space.reportIds!.push(report.reportId);
// eslint-disable-next-line
const removeReportFromSpace = (space: Space, report: QueriedReportForSpace) => space.reportIds = (space.reportIds || []).filter(reportId => reportId != report.reportId);
// eslint-disable-next-line
const isReportSelected = (space: Space, report: QueriedReportForSpace) => !!space.reportIds && space.reportIds.findIndex(reportId => reportId == report.reportId) !== -1;
const addReportToCodes = (codes: Array<QueriedReportForSpace>, report: QueriedReportForSpace) => {
	// eslint-disable-next-line
	const exists = codes.findIndex(exists => exists.reportId == report.reportId) !== -1;
	if (!exists) {
		codes.push(report);
	}
};
const removeReportFromCodes = (codes: Array<QueriedReportForSpace>, report: QueriedReportForSpace) => {
	// eslint-disable-next-line
	const index = codes.findIndex(exists => exists.reportId == report.reportId);
	if (index !== -1) {
		codes.splice(index, 1);
	}
};
const getReportId = (report: QueriedReportForSpace) => report.reportId;
const getReportName = (report: QueriedReportForSpace) => report.name;
const getReportDescription = (report: QueriedReportForSpace) => report.description;

export const ReportPicker = (props: {
	label: string;
	space: Space;
	codes: { reports: Array<QueriedReportForSpace> };
	onDataChanged: () => void;
}) => {
	const { label, space, codes, onDataChanged } = props;

	return <PropItemPicker label={label}
	                       entity={space}
	                       codes={codes.reports}
	                       initPropArray={initReportArray}
	                       addItemToProp={addReportToSpace}
	                       removeItemFromProp={removeReportFromSpace}
	                       isItemPicked={isReportSelected}
	                       addItemToCodes={addReportToCodes}
	                       removeItemFromCodes={removeReportFromCodes}
	                       getKeyOfItem={getReportId}
	                       getNameOfItem={getReportName}
	                       getMinorNameOfItem={getReportDescription}
	                       listItems={listReportsForSpace}
	                       onDataChanged={onDataChanged}/>;
};
