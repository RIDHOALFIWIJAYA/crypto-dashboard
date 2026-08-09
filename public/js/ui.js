/**
 * ui.js - UI Rendering Logic
 */

const COINS_TO_DISPLAY = ['btc_idr', 'eth_idr', 'doge_idr', 'ada_idr', 'sol_idr', 'matic_idr', 'bnb_idr', 'trx_idr'];
const cryptoContainer = document.getElementById('crypto-container');
const refreshBtn = document.getElementById('refresh-btn');
const lastUpdateEl = document.getElementById('last-update');

let previousPrices = {};

/**
 * Format number as IDR currency
 */
function formatIDR(val) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(val);
}

/**
 * Render the dashboard
 */
async function renderDashboard() {
    console.log("Rendering dashboard...");
    try {
        refreshBtn.classList.add('opacity-50', 'cursor-not-allowed');
        refreshBtn.disabled = true;

        const data = await window.fetchCryptoData(COINS_TO_DISPLAY);
        console.log("Data for UI received:", data);

        if (!data || !data.tickers) {
            throw new Error("Data format invalid: 'tickers' not found. Check console for full response.");
        }

        const tickers = data.tickers;
        cryptoContainer.innerHTML = '';
        
        let renderedCount = 0;
        COINS_TO_DISPLAY.forEach(pairKey => {
            // Indodax summaries API pakai underscore di key tickers-nya (contoh: btc_idr)
            // Tapi kita check dua-duanya biar aman (btc_idr dan btcidr)
            const pairData = tickers[pairKey] || tickers[pairKey.replace('_', '')];

            if (!pairData) {
                console.warn(`Pair data for ${pairKey} not found in tickers.`);
                return;
            }

            renderedCount++;
            const name = pairKey.split('_')[0].toUpperCase();
            const price = parseFloat(pairData.last);
            const prevPrice = previousPrices[pairKey] || price;

            const priceChangeClass = price > prevPrice ? 'price-up' : (price < prevPrice ? 'price-down' : 'text-white');
            // Gunakan icon dari cryptoicons.api atau fallback indodax
            const iconUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${name.toLowerCase()}.png`;
            const fallbackIcon = `https://indodax.com/static/img/coins/${name}.png`;

            const card = document.createElement('div');
            card.className = 'crypto-card group cursor-pointer';
            card.dataset.pairKey = pairKey;
            card.dataset.name = name;
            card.dataset.icon = iconUrl;
            card.dataset.price = price;
            card.dataset.changeClass = priceChangeClass;

            if (price !== prevPrice) {
                card.classList.add('pulse-update');
                setTimeout(() => card.classList.remove('pulse-update'), 1500);
            }

            card.innerHTML = `
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <img src="${iconUrl}" alt="${name}" class="w-8 h-8 rounded-full bg-slate-800" onerror="this.src='${fallbackIcon}'; this.onerror=null;">
                        <div>
                            <h3 class="font-bold text-white text-lg">${name}</h3>
                            <p class="text-xs text-slate-500 uppercase">${pairKey.replace('_', ' / ')}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <p class="text-xs text-slate-500 mb-1">Last Price</p>
                    <p class="text-2xl font-bold font-mono ${priceChangeClass} transition-colors duration-500">
                        ${formatIDR(price)}
                    </p>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-slate-950/50 p-2 rounded">
                        <p class="text-slate-500">High 24h</p>
                        <p class="text-white font-mono">${formatIDR(pairData.high)}</p>
                    </div>
                    <div class="bg-slate-950/50 p-2 rounded">
                        <p class="text-slate-500">Low 24h</p>
                        <p class="text-white font-mono">${formatIDR(pairData.low)}</p>
                    </div>
                </div>
            `;
            
            cryptoContainer.appendChild(card);
            previousPrices[pairKey] = price;
        });

        if (renderedCount === 0) {
            cryptoContainer.innerHTML = '<p class="col-span-full text-center py-10">No matching coins found in API data.</p>';
        }

        lastUpdateEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        console.error("UI Render Error:", error);
        cryptoContainer.innerHTML = `
            <div class="col-span-full p-8 text-center bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-500">
                <p class="font-bold">Error loading data</p>
                <p class="text-sm mt-2">${error.message}</p>
                <p class="text-xs mt-4 italic">Buka Console (F12) untuk detail teknis.</p>
            </div>
        `;
    } finally {
        refreshBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        refreshBtn.disabled = false;
    }
}

// Initial render
renderDashboard();
refreshBtn.addEventListener('click', renderDashboard);
setInterval(renderDashboard, 30000);

// Open chart modal when a coin card is clicked
cryptoContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.crypto-card');
    if (!card) return;

    window.openChartModal(
        card.dataset.pairKey,
        card.dataset.name,
        card.dataset.icon,
        { price: parseFloat(card.dataset.price), changeClass: card.dataset.changeClass }
    );
});
