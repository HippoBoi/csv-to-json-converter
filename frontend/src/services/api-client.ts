export type Data = Array<Record<string, string>>;
export interface ApiUploadResponse {
    message: string;
    data: Data;
};
export interface ApiSearchResponse {
    data: Data;
}
export const url = "https://csv-to-json-converter-hippo.onrender.com" as const;

export const uploadFile = async (file: File): Promise<[Error | null, Data?]> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`${url}/api/files`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) return([new Error(`Error subiendo archivo: ${res.statusText}`)]);
        const json = await res.json() as ApiUploadResponse;
        
        return([null, json.data]);
    } catch (error) {
        if (error instanceof Error) return([error]);
    }

    return([new Error("Unknown error")]);
};

export const getFileUrl = async (): Promise<[Error | null, string?]> => {
    try {
        const res = await fetch(`${url}/api/download`, { method: "GET" });

        if (!res.ok) return([new Error(`Error descargando archivo: ${res.statusText}`)]);
        const blob = await res.blob();
        const fileURL = window.URL.createObjectURL(blob);
        
        return([null, fileURL]);
    } catch (error) {
        if (error instanceof Error) return([error]);
    }

    return([new Error("Unknown error")]);
};

export const searchData = async (search: string): Promise<[Error | null, Data?]> => {
    try {
        const res = await fetch(`${url}/api/users?q=${search}`, { method: "GET" });

        if (!res.ok) return([new Error(`Error buscando datos: ${res.statusText}`)]);
        const json = await res.json() as ApiSearchResponse;
        
        return([null, json.data]);
    } catch (error) {
        if (error instanceof Error) return([error]);
    }

    return([new Error("Unknown error")]);
};