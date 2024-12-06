export interface StockPrice {
	date: string
	close: number
}

export type ActiveTab = 'weekly' | 'monthly' | 'history'

export interface LastPrice {
	isPriceUp: boolean | null
	lastPrice: number | null
	percentage: number | null
	prevPrice: number | null
	priceChange: number | null
}

export interface CustomizedAxisTickProps {
  x: number
  y: number
  payload: { value: string | number }
}