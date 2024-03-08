<script lang="js">
	// @ts-nocheck
	import './styles.css';
	import { onMount } from 'svelte';
	import { scaleLinear } from 'd3';

	import Fa from 'svelte-fa';
	import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

	export let ticker = 'AAPL';
	let data = {
		name: 'Stock',
		ticker: 'STCK',
		country: 'US',
		exchange: 'NYSE',
		logo: 'https://github.com/favicon.ico',
		web_url: 'https://qaezz.dev',
		price: {
			current: 0,
			day_change: 0,
			day_change_percent: 0,
			day_high_price: 0,
			day_low_price: 0,
			day_open_price: 0,
			previous_close: 0
		},
		recommendations: {
			period: '(YYYY-MM-DD)',
			total: 0,
			percentages: {
				buy: 0,
				hold: 0,
				sell: 0,
				strong_buy: 0,
				strong_sell: 0
			}
		}
	};

	let points = [];

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
				period: `(${recommendation_data.period})`,
				total: total,
				percentages: {
					buy: calculatePercent(recommendation_data.recommendations.buy, total),
					hold: calculatePercent(recommendation_data.recommendations.hold, total),
					sell: calculatePercent(recommendation_data.recommendations.sell, total),
					strong_buy: calculatePercent(recommendation_data.recommendations.strong_buy, total),
					strong_sell: calculatePercent(recommendation_data.recommendations.strong_sell, total)
				}
			};

			data = {
				name: info_data.name,
				ticker: info_data.ticker,
				country: info_data.country,
				exchange: info_data.exchange,
				logo: info_data.logo,
				web_url: info_data.web_url,
				price: {
					current: info_data.price.current,
					day_change: info_data.price.day_change,
					day_change_percent: info_data.price.day_change_percent,
					day_high_price: info_data.price.day_high_price,
					day_low_price: info_data.price.day_low_price,
					day_open_price: info_data.price.day_open_price,
					previous_close: info_data.price.previous_close
				},
				recommendations: {
					period: recommendation_percentage.period,
					total: recommendation_percentage.total,
					percentages: {
						buy: recommendation_percentage.percentages.buy,
						hold: recommendation_percentage.percentages.hold,
						sell: recommendation_percentage.percentages.sell,
						strong_buy: recommendation_percentage.percentages.strong_buy,
						strong_sell: recommendation_percentage.percentages.strong_sell
					}
				}
			};

			points = [
				{ recommendation: 'Strong Sell', percentage: data.recommendations.percentages.strong_sell },
				{ recommendation: 'Sell', percentage: data.recommendations.percentages.sell },
				{ recommendation: 'Hold', percentage: data.recommendations.percentages.hold },
				{ recommendation: 'Buy', percentage: data.recommendations.percentages.buy },
				{ recommendation: 'Strong Buy', percentage: data.recommendations.percentages.strong_buy }
			];
		}
		await getTickerInfo(ticker);
	});

	import { VisXYContainer, VisStackedBar } from '@unovis/svelte';

	$: x = (d) => d.x;
	$: y = ['Strong Sell', 'Sell', 'Hold', 'Buy', 'Strong Buy'];
	// $: y = (d) => d.y;

	// let width = 450;
	// let height = 90;

	// const xTicks = ['Strong Sell', 'Sell', 'Hold', 'Buy', 'Strong Buy'];
	// const yTicks = [0, 50];
	// const padding = { top: 0, right: 5, bottom: 20, left: 5 };

	// function formatMobile(tick) {
	// 	return "'" + tick.toString().slice(-2);
	// }

	// $: xScale = scaleLinear()
	// 	.domain([-1, xTicks.length])
	// 	.range([padding.left, width - padding.right]);

	// $: yScale = scaleLinear()
	// 	.domain([0, Math.max.apply(null, yTicks)])
	// 	.range([height - padding.bottom, padding.top]);

	// $: barWidth = 15;
</script>

<div class="stock-container">
	<div class="header">
		<span class="text">
			<h2>{data.name}</h2>
			<span class="listing-details">
				<p>{data.ticker}</p>
				<p>{data.exchange}</p>
			</span>
		</span>
		<div class="logo" style="background-image: url('{data.logo}')"></div>
	</div>
	<div class="stock-details">
		<div class="money">
			{#if data.price.day_change < 0}
				<span class="current is-negative">
					<h2>{data.price.current}</h2>
					<span>
						<Fa icon={faCaretDown} fw />
						<p>{data.price.day_change}</p>
						<p>{data.price.day_change_percent}%</p>
					</span>
				</span>
			{:else if data.price.day_change == 0}
				<span class="current">
					<h2>{data.price.current}</h2>
					<span>
						<Fa icon={faCaretDown} fw />
						<p>{data.price.day_change}</p>
						<p>{data.price.day_change_percent}%</p>
					</span>
				</span>
			{:else}
				<span class="current is-positive">
					<h2>{data.price.current}</h2>
					<span>
						<Fa icon={faCaretUp} fw />
						<p>{data.price.day_change}</p>
						<p>{data.price.day_change_percent}%</p>
					</span>
				</span>
			{/if}

			<div class="stats">
				<table>
					<tr>
						<th>D High</th>
						<td>{data.price.day_high_price}</td>
					</tr>
					<tr>
						<th>D Low</th>
						<td>{data.price.day_low_price}</td>
					</tr>
					<tr>
						<th>Open</th>
						<td>{data.price.day_open_price}</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="recommendations">
			<h4 data-period={data.recommendations.period}>Recommendations</h4>

			<div class="chart">
				{#each points as point, i}
					<div class="bar-container">
						<span class="label" style="opacity: .7;">
							{point.percentage}
						</span>
						<div
							class="bar"
							data-recommendation={point.recommendation}
							style="height: {point.percentage}px"
						></div>
						<span class="label">{point.recommendation}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.stock-container {
		display: flex;
		flex-direction: column;
		background-color: var(--color-element-background);
		border: 1px solid var(--color-border);
		border-radius: 3px 3px 7px 7px;
		padding: 10px;
		min-width: 450px;
	}

	.stock-container .header {
		display: inline-flex;
		border-bottom: 1px solid rgba(230, 230, 230, 0.5);
		width: 100%;
		line-height: 0;
		padding-bottom: 5px;
		margin-bottom: 5px;
	}

	.stock-container .header p,
	.stock-container .header h2 {
		margin: 0;
		padding: 0;
	}

	.stock-container .header .text {
		display: inline-flex;
		gap: 7px;
		align-items: center;
		flex-grow: 1;
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
		height: 100%;
		width: 2em;
		border-radius: 100%;
		aspect-ratio: 1/1;
		background-size: contain;
		background-repeat: no-repeat;
	}

	.stock-container .listing-details {
		display: flex;
		flex-direction: column;
	}

	.stock-container .listing-details p {
		font-size: 0.9em;
		line-height: 97%;
	}

	.stock-container .stock-details {
		display: grid;
		grid-template-rows: 1fr 1fr;
	}

	.stock-container .stock-details .money {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.stock-container .stock-details .money .current h2,
	.stock-container .stock-details .money .current p {
		margin: 0;
		padding: 0;
	}

	.stock-container .stock-details .money .current.is-negative {
		color: rgb(230, 80, 80);
	}

	.stock-container .stock-details .money .current.is-positive {
		color: rgb(80, 230, 80);
	}

	.stock-container .stock-details .money .current h2 {
		font-size: 3em;
		line-height: 97%;
	}

	.stock-container .stock-details .money .current p {
		font-size: 0.95em;
		line-height: 0;
	}

	.stock-container .stock-details .money .current span {
		display: inline-flex;
		width: 100%;
		align-items: center;
	}

	.stock-container .stock-details .money .current span p:first-of-type {
		margin-right: 10px;
	}

	.stock-container .stock-details .money .stats table {
		margin: 0 auto;
	}
	.stock-container .stock-details .money .stats table th {
		padding-right: 20px;
		color: rgba(230, 230, 230, 0.5);
		font-weight: normal;
		text-align: left;
	}
	.stock-container .stock-details .money .stats table td {
		font-size: 0.9em;
	}

	.stock-container .stock-details .recommendations {
		padding: 0;
		margin: 0;
	}

	.stock-container .stock-details .recommendations h4 {
		margin: -5px 0 0 0;
		padding: 0;
	}

	.stock-container .stock-details .recommendations h4::after {
		content: attr(data-period);
		color: rgba(230, 230, 230, 0.5);
		font-weight: normal;
		margin-left: 7px;
		font-size: 0.75em;
	}

	/* Recommendations Chart */

	.chart {
		height: 75px;
		display: flex;
		justify-content: space-evenly;
	}

	.bar-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: end;
		margin-right: 2%;
	}

	.bar {
		background-color: steelblue;
		border-radius: 100px;
		width: 15px;
		opacity: 0.65;
	}

	.bar[data-recommendation='Buy'] {
		background-color: rgb(100, 250, 100);
	}

	.bar[data-recommendation='Strong Buy'] {
		background-color: rgb(100, 250, 250);
	}

	.bar[data-recommendation='Hold'] {
		background-color: rgb(250, 250, 100);
	}

	.bar[data-recommendation='Sell'] {
		background-color: rgb(250, 150, 100);
	}

	.bar[data-recommendation='Strong Sell'] {
		background-color: rgb(250, 100, 100);
	}

	.label {
		color: var(--color-text);
		font-size: .75em;
		margin-top: 5px;
	}

	/* Ensure the last bar container doesn't have a margin */
	.chart .bar-container:last-child {
		margin-right: 0;
	}
</style>
