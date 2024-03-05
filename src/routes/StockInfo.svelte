<script lang="js">
	// @ts-nocheck
	import './styles.css';
	import { onMount } from 'svelte';

	onMount(async () => {
		async function getTickerInfo(ticker) {
			// TO-DO: ADD ERROR HANDLING!!!

			let info_res = await fetch(`/api/tickerinfo?q=${ticker}`);
			let info_data = JSON.parse(await info_res.text());
			// switch to websockets to get realtime price data

			let recommendation_res = await fetch(`/api/stockrecommendation?q=${ticker}`);
			let recommendation_data = JSON.parse(await recommendation_res.text());

			let total = 0;
			Object.keys(recommendation_data.recommendations).forEach((key) => {
				total += recommendation_data.recommendations[key];
			});

			function calculatePercent(partialValue, totalValue) {
				return Math.round((partialValue / totalValue) * 100);
			}

			let recommendation_percentage = {
				period: recommendation_data.period,
				total: total,
				percentages: {
					buy: calculatePercent(recommendation_data.recommendations.buy, total),
					hold: calculatePercent(recommendation_data.recommendations.hold, total),
					sell: calculatePercent(recommendation_data.recommendations.sell, total),
					strong_buy: calculatePercent(recommendation_data.recommendations.strong_buy, total),
					strong_sell: calculatePercent(recommendation_data.recommendations.strong_sell, total)
				}
			};
			// TO-DO: Make a pie chart out of it.

			console.log(recommendation_percentage);
		}
		await getTickerInfo('AAPL');
	});
</script>

<div class="stock-container">
	<div class="header">
		<span class="text">
			<h2>Apple Inc</h2>
			<span class="stock-details">
				<p>AAPL</p>
				<p>NASDAQ NMS</p>
			</span>
		</span>
		<div class="logo" style='--logo-url: "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AAPL.svg"'></div>
	</div>
</div>

<style>
	.stock-container {
		display: flex;
		flex-direction: row;
		background-color: var(--color-element-background);
		border: 1px solid var(--color-border);
		border-radius: 7px;
		padding: 10px 20px;
		width: 500px;
	}

	.stock-container .header {
		display: inline-flex;
		border-bottom: 1px solid rgba(230, 230, 230, .5);
		width: 100%;
	}

	.stock-container .header p, .stock-container .header h2 {
		margin: 0;
		padding: 0;
	}

	.stock-container .header .text {
		display: inline-flex;
		gap: 5px;
		align-items: center;
	}

	.stock-container .header .text p {
		color: rgb(170, 170, 170);
	}

	.stock-container .header .text > h2 {
		font-size: 2em;
		font-weight: bold;
		padding-bottom: 5px;
	}

	.stock-container .header .logo {
		background-image: var(--logo-url); /* FIX THIS */
		aspect-ratio: 1/1;
		background-size: contain;
		background-repeat: no-repeat;
	}

	.stock-container .stock-details {
		display: flex;
		flex-direction: column;

	}

	.stock-container .stock-details p {
		/* font-size: .9em; */
		line-height: 97%
	}

</style>
