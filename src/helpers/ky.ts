import ky from "ky";
import {toastify} from "./toastify";

export default ky.create({
    timeout: 60 * 1000,
    throwHttpErrors: false,
    retry: 0,
    headers: {
        'Accept': '*/*'
    },
    hooks: {
        afterResponse: [
            async (_request, _options, response) => {
                if (!response.ok && response.status != 404) {
                    let errorResponse = false;
                    await response.json().catch(() => errorResponse = true);

                    if (errorResponse) {
                        toastify.error(`Something went wrong <br /> ${response.status} ${response.statusText}`);
                        return new Response('[]');
                    }
                }
            }
        ]
    }
})