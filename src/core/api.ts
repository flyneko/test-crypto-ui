import ky from "../helpers/ky";
import { API_HOST } from "./constants";

const requestClient = ky.extend({
    prefixUrl: `https://${API_HOST}`,
    hooks: {
		beforeRequest: [
			request => {
                const token = localStorage.getItem('auth_token');
				token && !request.headers.get('Authorization') && request.headers.set('Authorization', 'Bearer ' + token);
			}
		]
	}
})

class ApiClient {
    signIn(credentinals: { username: string, password: string }) {
        return () => requestClient.post(
            'get_token',
            {
                json: {
                    user: credentinals.username,
                    password: credentinals.password,
                }
            }
        ).text()
    }

    signUp(credentinals: { username: string, password: string }) {
        return () => requestClient.post('auth', { json: { email: credentinals.username, password: credentinals.password } }).text()
    }

    getOptionsList(data?: any) {
        return () => requestClient.post('list_options', { json: data }).json()
    }

    getActiveOptionsList(data?: any) {
        return () => requestClient.get('list_active_options').json()
    }

    addOption(data: any) {
        return () => requestClient.post('create_option', { json: data }).text()
    }

    closeOption(uuid: any) {
        return () => requestClient.post('close_option', { json: { uuid } }).json()
    }

    getUserInfo() {
        return () => requestClient.get('user_info').json()
    }

    addCredit(data: any) {
        return () => requestClient.post('add_credit', { json: data, headers: { Authorization: 'Bearer 1111' } }).text()
    }

    withdrawCredit(data: any) {
        return () => requestClient.post('withdraw_credit', { json: data, headers: { Authorization: 'Bearer 1111' } }).text()
    }
}

const Api = new ApiClient();

export { Api }