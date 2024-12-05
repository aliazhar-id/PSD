import { StockPrice } from '@/types/types'
import {
	formatDate,
	getCurrentMonthRange,
	getCurrentWeekRange,
} from '@/lib/utils'

export async function fetchStockData(activeTab: string): Promise<StockPrice[]> {
	try {
		const { from, to } = getCurrentWeekRange()
		let url = `http://127.0.0.1:5000/api/data?from=${from}&to=${to}`

		console.log(from, to)

		if (activeTab === 'history') {
			url = 'http://127.0.0.1:5000/api/stocks'
		} else if (activeTab === 'monthly') {
			const { from, to } = getCurrentMonthRange()
			console.log(from, to)
			url = `http://127.0.0.1:5000/api/data?from=${from}&to=${to}`
		}

		const response = await fetch(url, { method: 'GET' })

		if (!response.ok) {
			throw new Error(`Failed to fetch stocks data: ${response.status}`)
		}

		const result = await response.json()
		if (!Array.isArray(result.data)) {
			result.data = []
		}

		return result.data.map((item: StockPrice) => ({
			date: formatDate(item.date),
			close: item.close,
		}))
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : 'An unknown error occurred'
		)
	}
}
