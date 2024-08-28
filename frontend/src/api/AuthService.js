// this will handle signup, login and logout

import { requestClient } from "./apiClient";
import {
	CHECK_USERS_URL,
	SIGNUP_URL,
	LOGIN_URL,
	LOGOUT_URL,
} from "../Constants";

const AuthService = {
	checkUserAvailable: async (username) => {
		try {
			const response = await requestClient.get(
				`${CHECK_USERS_URL}/${username}`
			);

			console.log(response.data);

			if (Object.keys(response.data).length > 0) {
				return false;
			} else {
				return true;
			}
		} catch (error) {
			console.error(error.response.data);
		}
	},

	signup: async (username, password) => {
		const response = await requestClient.post(SIGNUP_URL, {
			username,
			password,
		});

		return response.data;
	},

	login: async (username, password) => {
		const response = await requestClient.post(LOGIN_URL, {
			username,
			password,
		});

		return response.data;
	},

	logout: async () => {
		const response = await requestClient.post(LOGOUT_URL);

		return response.data;
	},
};

export { AuthService };
