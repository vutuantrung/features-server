import axios from 'axios';

async function getAsync(url: string, headers: any = {}, params: any = {}) {
    try {
        const response = await axios.get(url, {
            headers: headers,
            params: params,
        });
        return response;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function postAsync(url: string, data: any, headers: any = {}, params: any = {}) {
    try {
        const response = await axios.post(
            url,
            { body: data },
            { headers: headers, params: params }
        );
        return response;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function putAsync() {}

async function patchAsync() {}

async function deleteAsync() {}

export { getAsync, postAsync, putAsync, patchAsync, deleteAsync };
