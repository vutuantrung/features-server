import express, { Request, Response } from 'express';
import { getAllUserMedia, getUserInformation } from './services/instagram';
import { getVideoData } from './services/youtube';
import cors from 'cors';

interface ServerResponse {
    status: number;
    data: any | null;
    error: string | null;
}

const app = express();
const port = process.env.PORT || 8081;

app.use(cors());

app.use(express.json());

app.get('/', (_: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.get('/instagram/getAllUserMedia', async (req, res) => {
    let response = {} as ServerResponse;
    try {
        console.log('api /instagram/getAllUserMedia processing...');
        const userId = req.query.userId;
        if (!userId || typeof userId !== 'string') {
            response.status = 400;
            throw new Error('Invalid input values. Nameof: userId');
        }
        const data = await getAllUserMedia(userId);

        response = {
            status: 200,
            data: data,
            error: null,
        };
    } catch (error: any) {
        console.log('[getAllUserMedia]', error);
        response = {
            status: response.status ?? 500,
            data: null,
            error: error,
        };
    } finally {
        res.status(response.status).send(response);
    }
});

app.get('/instagram/getUserInfor', async (req, res) => {
    let response = {} as ServerResponse;
    try {
        console.log('api /instagram/getUserInfor processing...');
        const username = req.query.username;
        if (!username || typeof username !== 'string') {
            response.status = 400;
            throw new Error('Invalid input values. Nameof: username');
        }
        const data = await getUserInformation(username);
        response = {
            status: 200,
            data: data,
            error: null,
        };
    } catch (error: any) {
        console.log('[getUserInfor]', error);
        response = {
            status: response.status ?? 500,
            data: null,
            error: error,
        };
    } finally {
        res.status(response.status).send(response);
    }
});

app.post('/youtube/getYoutubeVideoData', async (req, res) => {
    let response = {} as ServerResponse;
    try {
        console.log('api /youtube/getYoutubeVideoData processing...');
        const { url } = req.body;
        if (!url || typeof url !== 'string') {
            response.status = 400;
            throw new Error('Invalid input values. Nameof: url');
        }
        const { id, videoData } = await getVideoData(url);
        response = {
            status: 200,
            data: videoData,
            error: null,
        };
        console.log('api /youtube/getYoutubeVideoData success. Video data id: ' + id);
    } catch (error: any) {
        console.log('[getYoutubeVideoData]', error);
        const errorStatus = parseInt(error.message.split('Status code:')[1].trim());
        response = {
            status: !isNaN(errorStatus) ? errorStatus : 500,
            data: null,
            error: error,
        };
        console.log('[response]', response);
    } finally {
        res.status(response.status).send(response);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

process.title = 'features-server';
