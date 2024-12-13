import { ArrowDown, ArrowUp, HelpCircle } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { LastPrice } from '@/types/types'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card'

export default function PriceInfo({ price }: { price: LastPrice }) {
	const { lastPrice, prevPrice, priceChange, isPriceUp, percentage } = price
	const hasPriceChange = priceChange != null && priceChange !== 0
	const isNeutralChange = priceChange == null || priceChange === 0

	return (
		<div>
			<p className="text-sm text-muted-foreground mb-1">Harga saat ini</p>
			<div className="flex items-baseline gap-2">
				<p className="text-3xl font-bold">
					{lastPrice && formatRupiah(lastPrice)}
				</p>
				<HoverCard>
					<HoverCardTrigger>
						<HelpCircle className="w-4 h-4 cursor-pointer text-muted-foreground" />
					</HoverCardTrigger>
					<HoverCardContent>
						Harga terakhir yang tercatat setelah jam kerja berakhir.
					</HoverCardContent>
				</HoverCard>
				<div
					className={`flex items-center ${
						isNeutralChange || price.isPriceUp
							? 'text-emerald-600'
							: 'text-red-600'
					}`}
				>
					{!isNeutralChange &&
						(isPriceUp ? (
							<ArrowUp className="w-4 h-4" />
						) : (
							<ArrowDown className="w-4 h-4" />
						))}
					{hasPriceChange ? (
						<span className="text-sm font-medium">
							{isPriceUp
								? `+${formatRupiah(priceChange)} (+${percentage}%)`
								: `${formatRupiah(priceChange)} (${percentage}%)`}
						</span>
					) : (
						<span className="text-sm font-medium">
							{prevPrice && formatRupiah(prevPrice)}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}
