import { json } from '@sveltejs/kit';
import { FINNHUB_API_KEY } from '$lib/secrets/finnhub';


/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const q = url.searchParams.get('q') ?? 'wen';
    try {

        let recommendation_res = await fetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${q.toUpperCase()}&token=${FINNHUB_API_KEY}`);
        let recommendation_data = JSON.parse(await recommendation_res.text())[0];
        
        return json({
            period: recommendation_data.period,
            recommendations: {
                buy: recommendation_data.buy,
                hold: recommendation_data.hold,
                sell: recommendation_data.sell,
                strong_buy: recommendation_data.strongBuy,
                strong_sell: recommendation_data.strongSell
            }
        });
    } catch (error) {
        return json({
            period: "0000-00-00",
            recommendations: {
                buy: 0,
                hold: 0,
                sell: 0,
                strong_buy: 0,
                strong_sell: 0
            }
        });
    }
}