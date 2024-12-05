import { StockPrice } from '@/types/types'

export async function getStocksPrice(): Promise<StockPrice[]> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin`
		)

		if (!response.ok) {
			throw new Error(`Failed to fetch stocks data: ${response.status}`)
		}

		const result = await response.json()
		if (!Array.isArray(result.data)) {
			result.data = []
		}

		const data = result.map((item: StockPrice) => ({
			date: new Date(item.Date),
			Close: item.Close,
		}))

		return data
	} catch (error) {
		console.log('error', error)
		throw new Error('Failed to fetch stocks data')
	}
}
