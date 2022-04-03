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
                if (!response.ok && response.status !== 404) {
                    toastify.error(`Something went wrong <br /> ${response.status} ${response.statusText}`);
                    return new Response('[]');
                }
            }
        ]
    }
})