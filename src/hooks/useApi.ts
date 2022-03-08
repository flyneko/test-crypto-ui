import { useState } from "react";

export default (kyRequest: any) => {
  const [data, setData] = useState(null);
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

  return {
    data,
    error,
    isLoading,
    request
  };
};