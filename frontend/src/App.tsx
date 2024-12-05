import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StockPrice } from '@/types/types'
import { formatRupiah } from '@/lib/utils'
import LineGrid from '@/components/organism/linegrid'
import { fetchStockData } from '@/lib/stock'
import Spinner from '@/components/ui/spinner'
import image from '@/public/image.png'
import { ArrowDown, ArrowUp } from 'lucide-react'

export default function App() {
	const [activeTab, setActiveTab] = useState<string>('weekly')
	const [weeklyData, setWeeklyData] = useState<StockPrice[]>([])
	const [monthlyData, setMonthlyData] = useState<StockPrice[]>([])
	const [historyData, setHistoryData] = useState<StockPrice[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [price, setPrice] = useState({
		lastPrice: null as number | null,
		prevPrice: null as number | null,
		percentage: null as number | null,
		priceChange: null as number | null,
	})
	
	const currentData =
		activeTab === 'weekly'
			? weeklyData
			: activeTab === 'monthly'
			? monthlyData
			: historyData

	const isPriceUp =
		price.lastPrice && price.prevPrice && price.lastPrice > price.prevPrice
	const isPriceDown =
		price.lastPrice && price.prevPrice && price.lastPrice < price.prevPrice

	useEffect(() => {
		async function loadData() {
			try {
				setLoading(true)
				const stockData = await fetchStockData(activeTab)
				if (activeTab === 'weekly') {
					setWeeklyData(stockData)
				} else if (activeTab === 'monthly') {
					setMonthlyData(stockData)
				} else if (activeTab === 'history') {
					setHistoryData(stockData)
				}

				const response = await fetch('http://127.0.0.1:5000/api/last_price')
				const result = await response.json()
				const fetchedLastPrice = result.data.last_price
				const fetchedPreviousPrice = result.data.prev_price
				const fetchedPercentage = result.data.percentage_change
				const fetchedPriceChange = result.data.price_change

				setPrice({
					lastPrice: fetchedLastPrice,
					prevPrice: fetchedPreviousPrice,
					percentage: fetchedPercentage,
					priceChange: fetchedPriceChange,
				})

				setLoading(false)
			} catch (error) {
				setError(
					error instanceof Error ? error.message : 'An unknown error occurred'
				)
				setLoading(false)
			}
		}

		loadData()
	}, [activeTab])

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-background">
				<Spinner className="w-12 h-12 text-primary" />
				<p className="mt-4 text-lg font-medium text-muted-foreground">
					Loading...
				</p>
			</div>
		)
	}

	if (error) {
		return <div>{error}</div>
	}

	return (
		<div className="p-6 bg-white min-h-screen">
			<Card className="shadow-sm">
				<CardHeader className="border-b">
					<CardTitle className="text-xl font-semibold">
						Prediksi Harga Saham PT Bank Central Asia Tbk. (BBCA.JK)
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-6">
						<div>
							<p className="text-sm text-muted-foreground mb-1">
								Harga sekarang
							</p>
							<div className="flex items-baseline gap-2">
								<p className="text-3xl font-bold">
									{price.lastPrice && formatRupiah(price.lastPrice)}
								</p>
								<div
									className={`flex items-center ${
										isPriceUp
											? 'text-emerald-600'
											: isPriceDown
											? 'text-red-600'
											: ''
									}`}
								>
									{isPriceUp ? (
										<ArrowUp className="w-4 h-4 text-emerald-600" />
									) : isPriceDown ? (
										<ArrowDown className="w-4 h-4 text-red-600" />
									) : null}
									<span className="text-sm font-medium">
										{price.priceChange !== null
											? `+${formatRupiah(price.priceChange)} (+${
													price.percentage
											  }%)`
											: '-'}
									</span>
								</div>
							</div>
						</div>
						<img src={image} alt="BCA Logo" className="h-32" />
					</div>
					<Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
						<TabsList>
							<TabsTrigger value="weekly">Mingguan</TabsTrigger>
							<TabsTrigger value="monthly">Bulanan</TabsTrigger>
							<TabsTrigger value="history">Data Histori</TabsTrigger>
						</TabsList>
					</Tabs>
					<LineGrid data={currentData} />
				</CardContent>
			</Card>
		</div>
	)
}
