import fs from 'fs';
import moment from 'moment';
import { getInfo, getInfoOptions } from 'ytdl-core';
import { secondsToHms } from '../../helpers/helpers';
import { getAsync } from '../../helpers/apiHelpers';

const TAG = 'YOUTUBE';

async function getVideoData(url: string) {
    const info = await getInfo(url);
    const jsonValue = JSON.parse(JSON.stringify(info));

    const videoId = jsonValue['videoDetails']['videoId'];
    const dataVideoDetails = {
        title: jsonValue['videoDetails']['title'],
        embed: jsonValue['videoDetails']['embed'],
        viewCount: jsonValue['videoDetails']['viewCount'],
        uploadDate: moment(jsonValue['videoDetails']['uploadDate']).format('DD-MM-YYYY hh:mm:ss'),
        publishDate: moment(jsonValue['videoDetails']['publishDate']).format('DD-MM-YYYY hh:mm:ss'),
        lengthSeconds: secondsToHms(jsonValue['videoDetails']['lengthSeconds']),
        description: jsonValue['videoDetails']['description'],
        video_url: jsonValue['videoDetails']['video_url'],
        thumbnails: jsonValue['videoDetails']['thumbnails'],
    };

    const dataVideoFormat = jsonValue['formats'].map((val: any) => ({
        url: val['url'],
        mimeType: val['mimeType'],
        bitrate: val['bitrate'],
        fps: val['fps'],
        qualityLabel: val['qualityLabel'],
        width: val['width'],
        height: val['height'],
        contentLength: val['contentLength'],
        quality: val['quality'],
        projectionType: val['projectionType'],
        hasVideo: val['hasVideo'],
        hasAudio: val['hasAudio'],
    }));

    const staticalData = await getAsync(
        'https://returnyoutubedislikeapi.com/votes?videoId=' + videoId
    );

    const videoData = {
        ...dataVideoDetails,
        ...staticalData.data,
        formats: dataVideoFormat,
    };

    fs.writeFileSync('./data/videoData.json', JSON.stringify(videoData));

    return videoData;
}

export { getVideoData };
