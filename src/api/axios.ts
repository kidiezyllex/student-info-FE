import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import cookies from "js-cookie";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	shouldNotify?: boolean;
}

function getLocalAccessToken() {
	if (typeof window === "undefined") {
		return null;
	}
	
	try {
		// Get token from localStorage only
		const directAccessToken = localStorage.getItem("accessToken");
		if (directAccessToken) {
			return directAccessToken;
		}
		
		// Try token (might be JSON or raw string)
		const tokenFromStorage = localStorage.getItem("token");
		if (tokenFromStorage) {
			try {
				const tokenObj = JSON.parse(tokenFromStorage);
				return tokenObj.token || tokenFromStorage;
			} catch {
				return tokenFromStorage;
			}
		}
	} catch (error) {
		console.error("Error getting token:", error);
	}

	return null;
}

const instance = axios.create({
	timeout: 3 * 60 * 1000,
	baseURL: `http://localhost:5000/api`,
	// baseURL: `https://student-info-be.onrender.com/api`,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

instance.interceptors.request.use(
	(config) => {
		const token = getLocalAccessToken();
		console.log('[Axios Interceptor] Token from getLocalAccessToken:', token ? 'Token exists' : 'No token');
		console.log('[Axios Interceptor] Cookie accessToken:', cookies.get("accessToken"));
		console.log('[Axios Interceptor] localStorage accessToken:', typeof window !== "undefined" ? localStorage.getItem("accessToken") : "N/A");
		console.log('[Axios Interceptor] Request URL:', config.url);
		
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
			console.log('[Axios Interceptor] Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
		} else {
			console.warn('[Axios Interceptor] No token found, request will be sent without Authorization header');
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		
		if (error.response?.status === 401) {
			const errorMessage = error.response?.data?.message || "";
			if (errorMessage.includes("No token") || errorMessage.includes("token") || errorMessage.includes("unauthorized")) {
				if (typeof window !== "undefined") {
					const token = getLocalAccessToken();
					if (!token) {
						localStorage.removeItem("accessToken");
						localStorage.removeItem("token");
						localStorage.removeItem("userProfile");
						cookies.remove("accessToken");
						if (window.location.pathname !== '/auth/login') {
							window.location.href = '/auth/login';
						}
					}
				}
			}
		}
		
		return Promise.reject(error);
	}
);
export function logout() {
	cookies.remove("accessToken");
	localStorage?.clear();
}

export const sendGet = async (url: string, params?: any): Promise<any> => {
	const response = await instance.get(url, { params });
	return response?.data;
};

export const sendPost = (url: string, params?: any, queryParams?: any) => {
	const config: AxiosRequestConfig = { params: queryParams };

	if (params instanceof FormData) {
		config.headers = {
			"Content-Type": "multipart/form-data",
		};
	}

	return instance.post(url, params, config)
		.then((res) => res?.data)
		.catch((error) => {
			if (error.response?.data) {
				throw error.response.data;
			}
			throw error;
		});
};

export const sendPut = (url: string, params?: any) => 
	instance.put(url, params)
		.then((res) => res?.data)
		.catch((error) => {
			if (error.response?.data) {
				throw error.response.data;
			}
			throw error;
		});

export const sendPatch = (url: string, params?: any) => instance.patch(url, params).then((res) => res?.data);

export const sendDelete = (url: string, params?: any) =>
	instance.delete(url, { data: params }).then((res) => res?.data);

class ApiClient {
	get<T = any>(config: AxiosRequestConfig, options?: { shouldNotify: boolean }): Promise<T> {
		return this.request({
			...config,
			method: "GET",
			withCredentials: false,
			shouldNotify: options?.shouldNotify,
		});
	}

	post<T = any>(config: AxiosRequestConfig, options?: { shouldNotify: boolean }): Promise<T> {
		return this.request({
			...config,
			method: "POST",
			withCredentials: false,
			shouldNotify: options?.shouldNotify,
		});
	}

	put<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "PUT", withCredentials: false });
	}

	delete<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({
			...config,
			method: "DELETE",
			withCredentials: false,
		});
	}

	patch<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "PATCH", withCredentials: false });
	}

	private request<T = any>(config: CustomAxiosRequestConfig): Promise<T> {
		return new Promise((resolve, reject) => {
			instance
				.request<any, AxiosResponse<any>>(config)
				.then((res: AxiosResponse<any>) => {
					resolve(res as unknown as Promise<T>);
				})
				.catch((e: Error | AxiosError) => {
					reject(e);
				});
		});
	}
}

const apiClient = new ApiClient();

export default apiClient;
