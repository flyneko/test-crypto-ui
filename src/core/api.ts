import ky from "../helpers/ky";
import { API_URL } from "./constants";

const requestClient = ky.extend({
    prefixUrl: `https://${API_URL}`,
    hooks: {
		beforeRequest: [
			request => {
                const token = localStorage.getItem('auth_token');
				token && request.headers.set('Authorization', 'Bearer ' + token);
			}
		]
	}
})

class ApiClient {
    signIn(credentinals: { username: string, password: string }) {
        return () => requestClient.post(
            'auth',
             { 
                 json: { email: credentinals.username, password: credentinals.password },
                 headers: {
                     'Content-type': 'text/plain'
                 }
             }).text()
    }

    optionsList() {
        return () => requestClient.get('list_options', {
            headers: {
                'Content-type': 'application/json'
            }
        }).json()
    }

    addOption(data: any) {
        return () => requestClient.post('create_option', { json: data }).json()
    }

    closeOption(uuid: any) {
        return () => requestClient.post('close_option', { json: { uuid } }).json()
    }

    getUserInfo() {
        return () => requestClient.get('user_info', {
            headers: {
                'Content-type': 'application/json'
            }
        }).text()
    }
}

const Api = new ApiClient();

export { Api }