import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StockPrice } from '@/types/types'
import { formatRupiah } from '@/lib/utils'
import LineGrid from '@/components/organism/linegrid'
import { fetchStockData } from './lib/stock'

export default function App() {
	const [activeTab, setActiveTab] = useState<string>('weekly')
	const [weeklyData, setWeeklyData] = useState<StockPrice[]>([])
	const [monthlyData, setMonthlyData] = useState<StockPrice[]>([])
	const [historyData, setHistoryData] = useState<StockPrice[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const currentData =
		activeTab === 'weekly'
			? weeklyData
			: activeTab === 'monthly'
			? monthlyData
			: historyData

	useEffect(() => {
		async function loadData() {
			try {
				setLoading(true)
				const data = await fetchStockData(activeTab)
				if (activeTab === 'weekly') {
					setWeeklyData(data)
				} else if (activeTab === 'monthly') {
					setMonthlyData(data)
				} else if (activeTab === 'history') {
					setHistoryData(data)
				}
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
		return <div>Loading...</div>
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
								Harga Sekarang
							</p>
							<p className="text-3xl font-bold">{formatRupiah(10150)}</p>
							<p className="text-sm text-green-500 mt-1">
								⬈ 8.5% Naik dari kemarin
							</p>
						</div>
						<img
							src="/placeholder.svg?height=40&width=80"
							alt="BCA Logo"
							className="h-10"
						/>
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
