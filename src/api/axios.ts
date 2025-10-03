import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import cookies from "js-cookie";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	shouldNotify?: boolean;
}

function getLocalAccessToken() {
	let accessToken = cookies.get("accessToken");
	if (!accessToken && typeof window !== "undefined") {
		try {
			const tokenFromStorage = localStorage.getItem("token");
			const directAccessToken = localStorage.getItem("accessToken");
			
			let parsedToken = null;
			if (tokenFromStorage) {
				try {
					const tokenObj = JSON.parse(tokenFromStorage);
					parsedToken = tokenObj.token || tokenFromStorage;
				} catch {
					parsedToken = tokenFromStorage;
				}
			}
			
			const finalToken = parsedToken || directAccessToken;
			
			if (finalToken) {
				cookies.set("accessToken", finalToken);
				return finalToken;
			}
		} catch (error) {
			console.error( error);
		}
	}

	return accessToken;
}

const instance = axios.create({
	timeout: 3 * 60 * 1000,
	// baseURL: `http://localhost:5000/api`,
	baseURL: `https://student-info-be.onrender.com/api`,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

instance.interceptors.request.use(
	(config) => {
		const token = getLocalAccessToken();
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
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
			if (typeof window !== "undefined") {
				localStorage.removeItem("accessToken");
				localStorage.removeItem("token");
				cookies.remove("accessToken");
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
