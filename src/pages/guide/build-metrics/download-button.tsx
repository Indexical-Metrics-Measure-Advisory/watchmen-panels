import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Button from '../../component/button';
import { useNotImplemented } from '../../context/not-implemented';

export const DownloadButton = (props: { visible: boolean }) => {
	const { visible } = props;

	const notImpl = useNotImplemented();
	const onDownloadClicked = () => {
		// TODO download chart clicked
		notImpl.show();
	};
	return <Button onClick={onDownloadClicked} data-visible={visible}>
		<FontAwesomeIcon icon={faDownload}/>
	</Button>;
};