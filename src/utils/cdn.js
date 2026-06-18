// CDN base URL — set REACT_APP_CDN_URL in .env.production to your R2/CDN public URL.
// In development this is empty so local /public files are served as normal.
const CDN = process.env.REACT_APP_CDN_URL || '';

export const cdnUrl = (path) => `${CDN}${path}`;
