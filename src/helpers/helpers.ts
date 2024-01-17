function secondsToHms(seconds: number | string) {
    seconds = Number(seconds);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);

    const hDisplay = h > 0 ? h : '';
    const mDisplay = m > 0 ? m : '';
    const sDisplay = s > 0 ? s : '';

    const times = [hDisplay, mDisplay, sDisplay].filter((t) => t);
    const value = times.reduce((acc, cur) => acc + ':' + cur);

    return value;
}

export { secondsToHms };
