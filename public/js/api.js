/**
 * api.js - Logic for Fetching Data from Indodax API
 *
 * Catatan: Endpoint Indodax /api/* TIDAK mengirim header CORS sehingga
 * diblokir browser. Satu-satunya endpoint Indodax yang CORS-friendly adalah
 * /tradingview/history_v2 (dipakai chart di situs Indodax sendiri).
 * Strategi: coba /api/summaries langsung; kalau gagal (CORS), bangun data
 * harga dari candle history_v2. Proxy publik tidak lagi dipakai karena mati.
 */

const API_URL = 'https://indodax.com/api/summaries';
const HISTORY_URL = 'https://indodax.com/tradingview/history_v2';

/**
 * Simple direct fetch (no proxy). Throws on any failure.
 * @param {string} url
 * @returns {Promise<Object|Array>}
 */
async function fetchDirect(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

/**
 * Convert an Indodax pair key (e.g. "btc_idr") to uppercase symbol (e.g. "BTCIDR")
 * @param {string} pairKey
 * @returns {string}
 */
function pairKeyToSymbol(pairKey) {
    return pairKey.replace('_', '').toUpperCase();
}

/**
 * Fetch OHLC candlestick history from Indodax (CORS-enabled)
 * @param {string} symbol - e.g. "BTCIDR"
 * @param {string} timeframe - "15" | "60" | "240" | "1D"
 * @param {number} count - number of candles to request
 * @returns {Promise<Array<{time:number, open:number, high:number, low:number, close:number, volume:number}>>}
 */
async function fetchCandleData(symbol, timeframe, count) {
    const tfSeconds = timeframe === '1D' ? 86400 : (timeframe === '1W' ? 604800 : parseInt(timeframe, 10) * 60);
    const to = Math.floor(Date.now() / 1000);
    const from = to - (tfSeconds * count);

    const url = `${HISTORY_URL}?from=${from}&symbol=${symbol}&tf=${timeframe}&to=${to}`;
    const data = await fetchDirect(url);

    if (!Array.isArray(data)) {
        throw new Error("Format data candle tidak valid.");
    }

    return data.map(candle => ({
        time: Number(candle.Time),
        open: parseFloat(candle.Open),
        high: parseFloat(candle.High),
        low: parseFloat(candle.Low),
        close: parseFloat(candle.Close),
        volume: parseFloat(candle.Volume)
    })).filter(candle => candle.open > 0);
}

/**
 * Build a tickers-like object from history_v2 candles (fallback saat /api diblokir CORS).
 * Harga & high/low 24 jam disintesis dari candle 1 jam terakhir.
 * @param {string[]} coinList - pair keys, e.g. ["btc_idr", "eth_idr"]
 * @returns {Promise<Object>} shape: { tickers: { [pairKey]: {last, high, low, vol, name} } }
 */
async function buildSummariesFromCandles(coinList) {
    const tickers = {};
    const HOURS = 24;

    await Promise.all(coinList.map(async (pairKey) => {
        try {
            const candles = await fetchCandleData(pairKeyToSymbol(pairKey), '60', HOURS);
            if (!candles.length) return;

            const last = candles[candles.length - 1].close;
            const high = Math.max(...candles.map(c => c.high));
            const low = Math.min(...candles.map(c => c.low));
            const volume = candles.reduce((sum, c) => sum + c.volume, 0);

            tickers[pairKey] = {
                last: String(last),
                high: String(high),
                low: String(low),
                vol: String(volume),
                name: pairKey.split('_')[0].toUpperCase()
            };
        } catch (error) {
            console.warn(`Candle fallback gagal untuk ${pairKey}:`, error);
        }
    }));

    if (Object.keys(tickers).length === 0) {
        throw new Error("Tidak dapat memuat data dari Indodax. Cek koneksi internet.");
    }

    return { tickers };
}

/**
 * Fetch ticker summaries for the dashboard.
 * Mencoba /api/summaries dulu; bila gagal (CORS/network), fallback ke history_v2.
 * @param {string[]} coinList - pair keys yang mau ditampilkan
 * @returns {Promise<Object>}
 */
async function fetchCryptoData(coinList = []) {
    console.log("Fetching crypto data...");
    try {
        const data = await fetchDirect(API_URL);
        console.log("Direct summaries success.");
        return data;
    } catch (error) {
        console.warn("Direct summaries gagal (kemungkinan CORS), memakai fallback history_v2:", error.message);
        return buildSummariesFromCandles(coinList);
    }
}

// Export for use in ui.js / chart.js (if using modules) or just global
window.fetchCryptoData = fetchCryptoData;
window.fetchCandleData = fetchCandleData;
window.pairKeyToSymbol = pairKeyToSymbol;
