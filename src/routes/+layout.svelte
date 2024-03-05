<script>
	import Header from './Header.svelte';
	import './styles.css';
	import github from '$lib/images/github.svg';
	import Background from './Background.svelte';
</script>

<Background/>

<div class="app">
	<Header />

	<div class="corner">
		<a href="https://github.com/QAEZZ/stonkapp">
			<img src={github} alt="GitHub" />
		</a>
	</div>

	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		z-index: 2 !important;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		z-index: 2 !important;
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.corner {
		position: fixed;
		top: 0;
		right: 0;
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
		filteR: invert(1);
	}
</style>
