import { getServiceHost, isMockService } from "../service_utils";
import { Pipeline } from "./pipeline-types";

export const savePipeline = async (pipeline: Pipeline): Promise<void> => {
	if (isMockService()) {
		console.log("save {}", pipeline);
	} else {
		const response = await fetch(`${getServiceHost()}pipeline`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// authorization: token,
			},
			body: JSON.stringify(pipeline),
		});

		// const result = await
		return await response.json();
	}
};
