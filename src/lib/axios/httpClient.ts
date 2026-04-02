import { ApiResponse } from '@/types/api.types';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined in environment variables');
}

const axiosInstance = () => {
    const instance = axios.create({
        baseURL : API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`,
        timeout : 30000,
        headers:{
            'Content-Type' : 'application/json',
        },
        withCredentials: true
    });

    instance.interceptors.request.use((config) => {
        // Try to get token from cookies
        if (typeof window !== 'undefined') {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
                
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return instance;
};

export interface ApiRequestOptions {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
}

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {     
        const instance = axiosInstance();   
        const response = await instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {       
        console.error(`GET request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance().post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        console.error(`POST request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance().put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        console.error(`PUT request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpPatch = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance().patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    }
    catch (error) {
        console.error(`PATCH request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpDelete =  async <TData>(endpoint: string, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const response = await axiosInstance().delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        console.error(`DELETE request to ${endpoint} failed:`, error);
        throw error;
    }
}

/** Multer routes expect multipart/form-data (URL fields only is fine). */
const httpPostMultipart = async <TData>(endpoint: string, data: FormData): Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
            transformRequest: [
                (body, headers) => {
                    if (body instanceof FormData && headers) {
                        delete headers["Content-Type"];
                    }
                    return body;
                },
            ],
        });
        return response.data;
    } catch (error) {
        console.error(`POST multipart to ${endpoint} failed:`, error);
        throw error;
    }
};

const httpPatchMultipart = async <TData>(endpoint: string, data: FormData): Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
            transformRequest: [
                (body, headers) => {
                    if (body instanceof FormData && headers) {
                        delete headers["Content-Type"];
                    }
                    return body;
                },
            ],
        });
        return response.data;
    } catch (error) {
        console.error(`PATCH multipart to ${endpoint} failed:`, error);
        throw error;
    }
};

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
    postMultipart: httpPostMultipart,
    patchMultipart: httpPatchMultipart,
}
