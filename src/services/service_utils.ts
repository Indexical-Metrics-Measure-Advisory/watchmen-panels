export const isMockService = (): boolean => process.env.REACT_APP_SERVICE_MOCK_FLAG === "true";
export const getServiceHost = (): string => {
	if (window.location.hostname == "localhost") {
		return process.env.REACT_APP_SERVICE_URL!;
	} else {
		return window.location.protocol + "//" + window.location.host + "/watchmen/";
	}
};
