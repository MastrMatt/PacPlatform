import axios from "axios";

import { API_URL } from "@/Constants";
import { AuthService } from "./AuthService";

// want to create an interceptor that redirects to the login page if 401 or 403
// this is a global interceptor, so it will apply to all axios requests
const requestClient = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

requestClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.status === 401 || error.response.status === 403) {
			// call the AuthService logout function
			AuthService.logout();

			// check if the user in on the login page
			if (window.location.pathname !== "/login") {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export { requestClient };
