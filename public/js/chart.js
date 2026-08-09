/**
 * chart.js - Candlestick Chart Logic (TradingView Lightweight Charts)
 */

const chartModal = document.getElementById('chart-modal');
const chartModalBackdrop = document.getElementById('chart-modal-backdrop');
const chartModalClose = document.getElementById('chart-modal-close');
const chartContainer = document.getElementById('chart-container');
let chartLoading = document.getElementById('chart-loading');
const chartCoinIcon = document.getElementById('chart-coin-icon');
const chartCoinName = document.getElementById('chart-coin-name');
const chartCoinPrice = document.getElementById('chart-coin-price');
const chartLastUpdate = document.getElementById('chart-last-update');
const chartTfButtons = document.getElementById('chart-tf-buttons');

const TIMEFRAMES = {
    '15': { candles: 240, label: '15m' },
    '60': { candles: 168, label: '1h' },
    '240': { candles: 180, label: '4h' },
    '1D': { candles: 120, label: '1D' }
};

let activeChart = null;
let chartCoin = null;
let chartCoinNameText = '';
let activeTf = '60';
let chartPriceInfo = {};

const CHART_UP_COLOR = '#10b981';
const CHART_DOWN_COLOR = '#f43f5e';

/**
 * Create (or recreate) the lightweight chart instance with dark theme
 */
function createChart() {
    if (activeChart) {
        activeChart.remove();
        activeChart = null;
    }

    activeChart = LightweightCharts.createChart(chartContainer, {
        layout: {
            background: { type: 'solid', color: 'transparent' },
            textColor: '#94a3b8',
            fontSize: 12
        },
        grid: {
            vertLines: { color: 'rgba(51, 65, 85, 0.35)' },
            horzLines: { color: 'rgba(51, 65, 85, 0.35)' }
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
            vertLine: { color: '#64748b', labelBackgroundColor: '#334155' },
            horzLine: { color: '#64748b', labelBackgroundColor: '#334155' }
        },
        rightPriceScale: {
            borderColor: 'rgba(51, 65, 85, 0.6)',
            scaleMargins: { top: 0.1, bottom: 0.2 }
        },
        timeScale: {
            borderColor: 'rgba(51, 65, 85, 0.6)',
            timeVisible: true,
            secondsVisible: false
        },
        autoSize: true,
        localization: {
            locale: 'id-ID',
            priceFormatter: (price) => new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price)
        }
    });

    const candleSeries = activeChart.addSeries(LightweightCharts.CandlestickSeries, {
        upColor: CHART_UP_COLOR,
        downColor: CHART_DOWN_COLOR,
        borderUpColor: CHART_UP_COLOR,
        borderDownColor: CHART_DOWN_COLOR,
        wickUpColor: CHART_UP_COLOR,
        wickDownColor: CHART_DOWN_COLOR
    });

    return candleSeries;
}

/**
 * Load candle data for the active coin & timeframe, then render
 */
async function loadChart() {
    if (!chartCoin) return;

    const symbol = window.pairKeyToSymbol(chartCoin);
    const tfConfig = TIMEFRAMES[activeTf];
    chartLoading.classList.remove('hidden');

    try {
        const candles = await window.fetchCandleData(symbol, activeTf, tfConfig.candles);
        const series = createChart();

        series.setData(candles.map(c => ({
            time: c.time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close
        })));

        chartLastUpdate.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        console.error("Chart load error:", error);
        chartLastUpdate.textContent = 'Error';
        chartContainer.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center">
                <p class="text-rose-500 text-sm">${error.message}</p>
            </div>
        `;
    } finally {
        chartLoading.classList.add('hidden');
    }
}

/**
 * Open the chart modal for a given coin
 * @param {string} pairKey - e.g. "btc_idr"
 * @param {string} name - e.g. "BTC"
 * @param {string} iconUrl
 * @param {Object} priceInfo - { price, changeClass } for header display
 */
function openChartModal(pairKey, name, iconUrl, priceInfo) {
    chartCoin = pairKey;
    chartCoinNameText = name;
    chartPriceInfo = priceInfo || {};

    chartCoinIcon.src = iconUrl;
    chartCoinName.textContent = name;
    if (priceInfo && priceInfo.price != null) {
        chartCoinPrice.textContent = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(priceInfo.price);
        chartCoinPrice.className = `text-sm font-mono ${priceInfo.changeClass || 'text-emerald-500'}`;
    }

    chartContainer.innerHTML = '<div id="chart-loading" class="absolute inset-0 flex items-center justify-center"><div class="animate-pulse text-slate-500 text-sm">Loading chart...</div></div>';
    chartLoading = document.getElementById('chart-loading');
    chartLastUpdate.textContent = '';

    setActiveTf('60');
    chartModal.classList.remove('hidden');
    chartModal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    loadChart();
}

/**
 * Close the chart modal
 */
function closeChartModal() {
    chartModal.classList.add('hidden');
    chartModal.classList.remove('flex');
    document.body.style.overflow = '';
    if (activeChart) {
        activeChart.remove();
        activeChart = null;
    }
    chartCoin = null;
}

/**
 * Update active timeframe button styles
 */
function setActiveTf(tf) {
    activeTf = tf;
    chartTfButtons.querySelectorAll('.chart-tf-btn').forEach(btn => {
        const isActive = btn.dataset.tf === tf;
        btn.className = 'chart-tf-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ' +
            (isActive ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300');
    });
}

// Event listeners
chartModalClose.addEventListener('click', closeChartModal);
chartModalBackdrop.addEventListener('click', closeChartModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !chartModal.classList.contains('hidden')) {
        closeChartModal();
    }
});
chartTfButtons.addEventListener('click', (e) => {
    const btn = e.target.closest('.chart-tf-btn');
    if (!btn || btn.dataset.tf === activeTf) return;
    setActiveTf(btn.dataset.tf);
    loadChart();
});
