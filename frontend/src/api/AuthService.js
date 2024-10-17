// this will handle signup, login and logout

import { requestClient } from "./apiClient";
import {
	CHECK_USERS_URL,
	SIGNUP_URL,
	LOGIN_URL,
	LOGOUT_URL,
	CHECK_AUTH_URL,
} from "./APIConstants";

const AuthService = {
	checkAuth: async () => {
		// only get here is the user is authenticated, axios interceptor will handle 401 and 403
		const response = await requestClient.get(CHECK_AUTH_URL);
		console.log(response.data);
	},

	checkUserAvailable: async (username) => {
		try {
			const response = await requestClient.get(
				`${CHECK_USERS_URL}/${username}`
			);

			if (response.data.exists) {
				return false;
			} else {
				return true;
			}
		} catch (error) {
			// check if error was Err Connection Refused
			if (error.message === "ERR_CONNECTION_REFUSED") {
				// alert("Connection Refused"); so user can see
				return true;
			}
		}
	},

	signup: async (username, password, imageURL) => {
		const response = await requestClient.post(SIGNUP_URL, {
			username,
			password,
			imageURL,
		});

		return response;
	},

	login: async (username, password) => {
		const response = await requestClient.post(LOGIN_URL, {
			username,
			password,
		});

		return response;
	},

	logout: async () => {
		const response = await requestClient.post(LOGOUT_URL);

		return response;
	},
};

export { AuthService };
