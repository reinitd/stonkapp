<script>
    import './animation.css';
</script>

<div class="blob-container">
    <div class="blob"></div>
</div>

<style>
    .blob-container {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

	.blob {
		z-index: 1 !important;
		height: 70%;
		width: 30%;
		border-radius: 80% 40% 80% 40%;
		background: linear-gradient(rgb(12, 175, 240), rgb(139, 21, 250));
		animation: spin 20s linear infinite;
        filter: blur(200px);
	}
</style>
