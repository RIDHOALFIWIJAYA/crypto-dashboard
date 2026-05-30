/**
 * api.js - Logic for Fetching Data from Indodax API
 */

const API_URL = 'https://indodax.com/api/summaries';

/**
 * Fetch all ticker summaries from Indodax
 * @returns {Promise<Object>}
 */
async function fetchCryptoData() {
    console.log("Starting fetch process...");
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Direct fetch failed');
        const data = await response.json();
        console.log("Direct fetch success:", data);
        return data;
    } catch (error) {
        console.warn("Direct fetch failed, trying CORS proxy (AllOrigins)...");
        
        try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(API_URL)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error('Proxy fetch failed');
            
            const data = await response.json();
            console.log("Proxy response received:", data);
            
            if (data.contents) {
                const parsedContents = JSON.parse(data.contents);
                console.log("Parsed contents from proxy:", parsedContents);
                return parsedContents;
            } else {
                throw new Error("Proxy response missing 'contents' property");
            }
        } catch (proxyError) {
            console.error("CORS Proxy failed:", proxyError);
            
            console.warn("Trying secondary CORS proxy (corsproxy.io)...");
            try {
                const secondaryProxy = `https://corsproxy.io/?${encodeURIComponent(API_URL)}`;
                const response = await fetch(secondaryProxy);
                const data = await response.json();
                console.log("Secondary proxy success:", data);
                return data;
            } catch (secError) {
                console.error("All fetch methods failed.");
                throw new Error("Semua metode pengambilan data gagal. Cek koneksi internet.");
            }
        }
    }
}

// Export for use in ui.js (if using modules) or just global
window.fetchCryptoData = fetchCryptoData;
