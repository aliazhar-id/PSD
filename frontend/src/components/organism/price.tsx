import { ArrowDown, ArrowUp } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { LastPrice } from '@/types/types'

export default function PriceInfo({ price }: { price: LastPrice }) {
	return (
		<div>
			<p className="text-sm text-muted-foreground mb-1">Harga sekarang</p>
			<div className="flex items-baseline gap-2">
				<p className="text-3xl font-bold">
					{price.lastPrice && formatRupiah(price.lastPrice)}
				</p>
				<div
					className={`flex items-center ${
						price.isPriceUp ? 'text-emerald-600' : 'text-red-600'
					}`}
				>
					{price.isPriceUp ? (
						<ArrowUp className="w-4 h-4" />
					) : (
						<ArrowDown className="w-4 h-4" />
					)}
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
	)
}
