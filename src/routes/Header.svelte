<script lang="js">
	import { onMount } from 'svelte';

	const tickers = ['$AAPL', '$TSLA', '$NVDA', '$GOOG', '$GME', '$MSFT', '$WEN'];

	/**
	 * @param {number} ms Amount of time to sleep for in milliseconds.
	 */
	 function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
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
			}
			else {

				let new_ticker = getRandomValue(tickers);
				await sleep(3 * 1000);
				// @ts-ignore
				setPlaceholder(ticker, '');
				setTicker(new_ticker, 200, 0);
			}
		}
		// @ts-ignore
		setPlaceholder(ticker, '');
		await setTicker(tickers[0], 200, 0);
	});
</script>

<header>
	<div class="ticker-searchbar">
		<input type="text" placeholder="$AAPL" id="js-ticker" />
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: center;
		background: transparent;
	}

	.ticker-searchbar {
		z-index: 2 !important;
		margin-top: 7px;
	}

	.ticker-searchbar input[type='text'] {
		outline: 0;
		cursor: text;
		border-radius: 5px;
		border: 1px solid var(--color-border);
		padding: 5px;
		font-size: larger;
		background-color: var(--color-element-background);
		color: var(--color-text);
	}
</style>
