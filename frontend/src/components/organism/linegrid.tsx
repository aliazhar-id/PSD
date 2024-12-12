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
	ScriptableLineSegmentContext,
	Color,
	TooltipItem,
} from 'chart.js'
import { formatRupiah } from '@/lib/utils'

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
}: {
	currentData: StockPrice[]
	activeTab: string
}) {
	const down = (ctx: ScriptableLineSegmentContext, value: Color) =>
		ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined
	const up = (ctx: ScriptableLineSegmentContext, value: Color) =>
		ctx.p0.parsed.y < ctx.p1.parsed.y ? value : undefined

	const data = {
		datasets: [
			{
				tension: 0.1,
				borderWidth: activeTab === 'history' ? 2 : 8,
				data: currentData,
				segment: {
					borderColor: (ctx: ScriptableLineSegmentContext) =>
						down(ctx, 'rgb(192,75,75)') || up(ctx, 'rgb(75,192,75)'),
				},
			},
		],
	}

	const options = {
		interaction: {
			intersect: false,
		},
		radius: 0,
		parsing: {
			xAxisKey: 'date',
			yAxisKey: 'close',
		},
		elements: {
			point: {
				backgroundColor: 'black',
				radius: activeTab === 'history' ? 0 : 5,
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				displayColors: false,
				titleFont: {
					size: 15,
				},
				bodyFont: {
					size: 15,
				},
				callbacks: {
					label: function (context: TooltipItem<'line'>) {
						let label = context.dataset.label || ''

						if (label) {
							label += ': '
						}
						if (context.parsed.y !== null) {
							label += formatRupiah(context.parsed.y)
						}
						return label
					},
				},
			},
		},
		layout: {
			padding: 20,
		},
	}

	return <Line data={data} options={options} height={100} width={350} />
}
