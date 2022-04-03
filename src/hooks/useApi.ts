import { useEffect, useState } from "react";

interface RequestOptions {
    callOnInit?: boolean
    callInitData?: any
}

export default (kyRequest: any, options: RequestOptions = {}) => {
    const [data, setData] = useState({} as any);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const request = async (args?: any) => {
        setIsLoading(true);
        return kyRequest(args)().then((response: any) => {
            setData(response);
            return response;
        }).catch((e: any) => {
            setError(e.message || "Unexpected Error!");
        }).finally(() => {
            setIsLoading(false);
        })
    };

    useEffect(() => {
        options.callOnInit && request(options.callInitData || {});
    }, [])

    return {
        data,
        error,
        isLoading,
        request
    };
};