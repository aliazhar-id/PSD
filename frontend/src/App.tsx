import { useState } from 'react'
import { useStockData } from '@/hooks/stocks'
import Loading from '@/components/ui/loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LineGrid from '@/components/organism/linegrid'
import { ActiveTab } from '@/types/types'
import PriceInfo from '@/components/organism/price'
import image from '@/public/image.png'
import Error from '@/components/organism/error'

export default function App() {
	const [activeTab, setActiveTab] = useState<ActiveTab>('weekly')
	const { loading, error, data, price, reset } = useStockData(activeTab)
	const currentData = data[activeTab]

	if (loading) return <Loading />
	if (error) return <Error error={error} reset={reset} />

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
						<PriceInfo price={price} />
						<img src={image} alt="BCA Logo" className="h-32" />
					</div>
					<Tabs
						value={activeTab}
						onValueChange={(value) => setActiveTab(value as ActiveTab)}
						className="mb-4"
					>
						<TabsList>
							<TabsTrigger value="weekly">1 Minggu</TabsTrigger>
							<TabsTrigger value="monthly">1 Bulan</TabsTrigger>
							<TabsTrigger value="history">Data Histori</TabsTrigger>
						</TabsList>
					</Tabs>
					<LineGrid currentData={currentData} activeTab={activeTab} height={100} width={350} />
				</CardContent>
			</Card>
		</div>
	)
}
