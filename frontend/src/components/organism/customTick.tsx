import { CustomizedAxisTickProps } from "@/types/types"

export default function CustomizedAxisTick({ x, y, payload }: CustomizedAxisTickProps) {
	return (
		<g transform={`translate(${x},${y})`}>
			<text
				x={0}
				y={0}
				dy={16}
				textAnchor="end"
				fill="#666"
				transform="rotate(-20)"
			>
				{payload.value}
			</text>
		</g>
	)
}