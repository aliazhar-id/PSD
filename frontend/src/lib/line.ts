import { ScriptableLineSegmentContext, Color, TooltipItem } from 'chart.js'
import { StockPrice } from '@/types/types'
import { formatRupiah } from './utils'

export function chartData(currentData: StockPrice[], activeTab: string) {
	function up(ctx: ScriptableLineSegmentContext, value: Color) {
		return ctx.p0.parsed.y < ctx.p1.parsed.y ? value : undefined
	}
	function down(ctx: ScriptableLineSegmentContext, value: Color) {
		return ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined
	}

	return {
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
}

export function chartOptions(activeTab: string) {
	return {
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
				display: true,
				labels: {
					generateLabels: function () {
						return [
							{
								text: 'Harga naik',
								fillStyle: 'rgb(75,192,75)',
								strokeStyle: 'rgb(75,192,75)',
								lineWidth: 2,
								font: {
									family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
									size: 14,
								},
							},
							{
								text: 'Harga turun',
								fillStyle: 'rgb(192,75,75)',
								strokeStyle: 'rgb(192,75,75)',
								lineWidth: 2,
								font: {
									family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
									size: 14,
								},
							},
						]
					},
					padding: 20,
				},
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
			padding: {
				left: 20,
				top: -10,
			},
		},
		scales: {
			x: {
				offset: true,
			},
			y: {
				offset: true,
			},
		},
	}
}
