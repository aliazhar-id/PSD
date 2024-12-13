import { StockPrice } from '@/types/types'
import { Line } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import { chartData, chartOptions } from '@/lib/line'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

export default function LineGrid({
	currentData,
	activeTab,
	height,
	width
}: {
	currentData: StockPrice[]
	activeTab: string
	height: number
	width: number
}) {
	const data = chartData(currentData, activeTab)
	const options = chartOptions(activeTab)

	return <Line data={data} options={options} height={height} width={width} />
}
