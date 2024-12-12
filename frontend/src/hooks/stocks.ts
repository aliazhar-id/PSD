import { useCallback, useEffect, useState } from 'react'
import { ActiveTab, StockPrice } from '@/types/types'
import { fetchStockData } from '@/lib/stock'

export function useStockData(activeTab: ActiveTab) {
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [data, setData] = useState<Record<ActiveTab, StockPrice[]>>({
		weekly: [],
		monthly: [],
		history: [],
	})
	const [price, setPrice] = useState({
		lastPrice: null as number | null,
		prevPrice: null as number | null,
		percentage: null as number | null,
		priceChange: null as number | null,
		isPriceUp: null as boolean | null,
	})

	const loadData = useCallback(async () => {
		try {
			setLoading(true)
			setError(null) 
			const stockData = await fetchStockData(activeTab)
			setData((prevData) => ({
				...prevData,
				[activeTab]: stockData,
			}))

			const response = await fetch('http://127.0.0.1:5000/api/last_price')
			const result = await response.json()

			setPrice({
				lastPrice: result.data.last_price,
				prevPrice: result.data.prev_price,
				percentage: result.data.percentage_change,
				priceChange: result.data.price_change,
				isPriceUp: result.data.isPriceUp,
			})

			setLoading(false)
		} catch (error) {
			setError(
				error instanceof Error ? error.message : 'An unknown error occurred'
			)
			setLoading(false)
		}
	}, [activeTab])

	useEffect(() => {
		loadData()
	}, [activeTab, loadData])

	function reset() {
		setError(null)
		loadData()
	}

	return { loading, error, data, price, reset }
}
