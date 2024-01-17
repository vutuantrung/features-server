// import fs from 'fs';

import { getAsync } from '../../helpers/apiHelpers';

const TAG = '[INSTAGRAM]';
const COOKIES = `ig_did=714D77B4-195F-491B-BB4C-FDA8F8063C36;datr=0_OKZaMXAhSHBe5oD4zRtcOK;fbm_124024574287414=base_domain=.instagram.com;ig_nrcb=1;mid=ZYrz1QALAAG7S_BmEWR2P9tfy-Hm;dpr=1;csrftoken=7ugMSHgGozWzrL9zHvtrP2C0le5PPNBS;ds_user_id=45011071759;sessionid=45011071759%3AkoxHSVpIAEeXmq%3A17%3AAYcsnxTVlZ86hEPEWhePliMz-lQeVW8xfLmu8waEBQ;shbid="3149\\05445011071759\\0541736261953:01f733dab4faaff53b7c57a88ab56f0406ec54328607510d2b92c0c980bb0c0c71af770b";shbts="1704725953\\05445011071759\\0541736261953:01f76ad2c0f4311560642af88f959ca2ae7a3daf86f92a393eb2e7b35591fcb85afbc4b6";rur="EAG\\05445011071759\\0541736267286:01f7b24c0a63ab8b14fa5177159753044d4748a4d3e78698b60f790c0e21875e779036c1"`;
const QUERY_HASH = '396983faee97f4b49ccbe105b4daf7a0';

async function getAllUserMedia(userId: string) {
    try {
        if (!userId) {
            throw new Error('Invalid user id');
        }

        let all_urls = [],
            after = '';

        while (true) {
            const url = `https://www.instagram.com/graphql/query/?query_hash=${QUERY_HASH}&variables={"id":"${userId}","first":50,"after":"${after}"}`;
            const response = await fetch(url);
            const jsonValue = await response.json();
            const edges = jsonValue?.data?.user?.edge_owner_to_timeline_media?.edges || [];

            const urls: string[] = [];
            edges.forEach((e: any) => {
                let childs = e.node?.edge_sidecar_to_children?.edges;
                if (childs) {
                    urls.push(...childs.map((c: any) => getBiggestMediaFromNode(c.node)));
                } else {
                    urls.push(getBiggestMediaFromNode(e.node));
                }
            });
            all_urls.push(...urls);
            const pageInfo = jsonValue?.data?.user?.edge_owner_to_timeline_media?.page_info;
            if (pageInfo?.has_next_page) {
                after = pageInfo?.end_cursor;
            } else {
                // Reach last page
                break;
            }
        }
        return all_urls;
    } catch (error: any) {
        console.log(TAG, '[getAllUserMedia]', error.message);
    }
}

async function getUserInformation(username: string) {
    try {
        if (!username) {
            throw new Error('Invalid username');
        }

        const url = `https://www.instagram.com/web/search/topsearch/?query=${username}`;
        const response = await getAsync(url, {
            Cookie: COOKIES.replace(/\r?\n|\r/g, ''),
        });

        return response.data;
    } catch (error: any) {
        console.log(TAG, '[getUserInformation]', error.message);
    }
}

// Utils
function getBiggestMediaFromNode(node: any) {
    if (!node.is_video) {
        const r = node.display_resources;
        return r[r.length - 1]?.src;
    }
    return getUniversalCdnUrl(node.video_url);
}

function getUniversalCdnUrl(cdnLink: string) {
    const cdn = new URL(cdnLink);
    cdn.host = 'scontent.cdninstagram.com';
    return cdn.href;
}

export { getAllUserMedia, getUserInformation };
