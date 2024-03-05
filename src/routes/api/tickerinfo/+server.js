// @ts-nocheck
import { json } from '@sveltejs/kit';
import { FINNHUB_API_KEY } from '$lib/secrets/finnhub';


/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const q = url.searchParams.get('q') ?? 'wen';

    let profile_res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${q.toUpperCase()}&token=${FINNHUB_API_KEY}`);
    let profile_data = JSON.parse(await profile_res.text());

    let quote_res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${q.toUpperCase()}&token=${FINNHUB_API_KEY}`);
    let quote_data = JSON.parse(await quote_res.text());

    let stock_res = await fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${q.toUpperCase()}&token=${FINNHUB_API_KEY}`);
    let stock_data = JSON.parse(await stock_res.text());

    let exchange = profile_data.exchange.split('-')[0].trim()
    switch (exchange.toUpperCase()) {
        case "NEW YORK STOCK EXCHANGE, INC.":
            exchange = "NYSE"; break;
        case "LONDON STOCK EXCHANGE":
            exchange = "LSE"; break;
        default:
            exchange = exchange;
            break;
    }

    return json({
        name: profile_data.name,
        ticker: q.toUpperCase(),
        country: profile_data.country,
        exchange: exchange,
        logo: profile_data.logo,
        web_url: profile_data.weburl,
        price: {
            current: quote_data.c,
            day_change: quote_data.d,
            day_change_percent: quote_data.dp,
            day_high_price: quote_data.h,
            day_low_price: quote_data.l,
            day_open_price: quote_data.o,
            previous_close: quote_data.pc
        },
        fiftytwo_week: {
            high: stock_data['52WeekHigh'],
            high_date: stock_data['52WeekHighDate'],
            low: stock_data['52WeekLow'],
            low_date: stock_data['52WeekLowDate']

        }
    });
}