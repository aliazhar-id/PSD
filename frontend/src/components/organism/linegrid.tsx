import { useMemo } from 'react'
import { StockPrice } from '@/types/types'
import { formatRupiah } from '@/lib/utils'
import {
	TooltipProps,
	Line,
	LineChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'

export default function LineGrid({
	data,
}: {
	data: StockPrice[]
}) {
	const minPrice = useMemo(() => {
		return Math.min(...data.map((item) => item.close)) || 0
	}, [data])

	function renderTooltipContent({
		active,
		payload,
		label,
	}: TooltipProps<number, string>) {
		if (active && payload && payload.length && payload[0].value !== undefined) {
			return (
				<div className="tooltip-content">
					<p>{`${label}`}</p>
					<p>{formatRupiah(payload[0].value)}</p>
				</div>
			)
		}

		return null
	}

	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart data={data}>
				<CartesianGrid strokeDasharray="3 3" vertical={false} />
				<XAxis
					dataKey="date"
					axisLine={false}
					tickLine={false}
					padding={{ left: 30, right: 30 }}
				/>
				<YAxis axisLine={false} tickLine={false} domain={[minPrice, 'auto']} />
				<Tooltip content={renderTooltipContent} />
				<Line
					type="linear"
					dataKey="close"
					stroke="#4338ca"
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 8 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	)
}
