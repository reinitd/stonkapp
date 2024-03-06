<script>
	// @ts-nocheck

	import StockInfo from './StockInfo.svelte';
	import { onMount } from 'svelte';

	const tickers = [
		'AAPL',
		'TSLA',
		'NVDA',
		'GOOG',
		'GME',
		'MSFT',
		'WEN',
		'NFLX',
		'ZOM',
		'CVX',
		'LUV',
		'AMC'
	];

	$: currentTicker = tickers[0];
	$: if (currentTicker === '') {
		currentTicker = 'AAPL';
	}
	$: console.log('New Ticker: ', currentTicker);

	/**
	 * @param {number} ms Amount of time to sleep for in milliseconds.
	 */
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * @param {string[]} array
	 */
	function getRandomValue(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	/**
	 * @param {HTMLElement} element
	 */
	function placeholder(element) {
		return element.getAttribute('placeholder');
	}

	/**
	 * @param {HTMLElement} element
	 * @param {string} value
	 */
	function setPlaceholder(element, value) {
		element.setAttribute('placeholder', value);
	}

	onMount(async () => {
		const ticker = document.getElementById('js-ticker');

		/**
		 * @param {string} text The text you want to display.
		 * @param {number} speed The speed at which you want the text to type at.
		 * @param {number} i The starting position of the text, 0 is default.
		 */
		async function setTicker(text, speed, i = 0) {
			if (i < text.length) {
				// @ts-ignore
				setPlaceholder(ticker, placeholder(ticker) + text.charAt(i));
				i++;
				setTimeout(setTicker, speed, text, speed, i);
			} else {
				let new_ticker = getRandomValue(tickers);
				await sleep(3 * 1000);
				// @ts-ignore
				setPlaceholder(ticker, '');
				setTicker(`$${new_ticker}`, 200, 0);
			}
		}
		// @ts-ignore
		setPlaceholder(ticker, '');
		await setTicker(`$${currentTicker}`, 200, 0);
	});

	function updateStockInfo(event) {
		currentTicker = event.target.value.replace('$', '').trim().toUpperCase();
		event.target.value = '';
	}
</script>

<svelte:head>
	<title>Stonk App</title>
	<meta name="description" content="Simple Svelte App to Show Stock Information." />
</svelte:head>

<div id="content">
	<div class="ticker-searchbar">
		<input
			type="text"
			placeholder="$AAPL"
			id="js-ticker"
			maxlength="4"
			on:change={(e) => updateStockInfo(e)}
		/>
	</div>
	{#key currentTicker}
		<StockInfo ticker={currentTicker} />
	{/key}
</div>

<style>
	#content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.9;
		gap: 7px;
	}

	.ticker-searchbar {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		z-index: 2 !important;
		margin-top: 7px;
		width: 100%;
	}

	.ticker-searchbar input[type='text'] {
		outline: 0;
		min-width: 450px;
		text-transform: uppercase;
		cursor: text;
		border-radius: 7px 7px 3px 3px;
		border: 1px solid var(--color-border);
		padding: 5px 10px;
		font-size: larger;
		background-color: var(--color-element-background);
		color: var(--color-text);
	}
	.ticker-searchbar input[type='text']::before {
		content: '$';
	}
</style>
