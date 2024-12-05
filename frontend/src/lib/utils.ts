import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number) {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
	}).format(amount)
}

export function formatDate(dateInput: string): string {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}
	const date = new Date(dateInput)
	return date.toLocaleDateString('id-ID', options)
}

function formatDateRange(dateInput: Date): string {  
  const year = dateInput.getFullYear()
  const month = (dateInput.getMonth() + 1).toString().padStart(2, '0')
  const day = dateInput.getDate().toString().padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

export function getCurrentWeekRange(): { from: string; to: string } {
	const now = new Date()
	const dayOfWeek = now.getDay()
	const diffToSunday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
	const startOfWeek = new Date(now.setDate(now.getDate() - diffToSunday))
	const endOfWeek = new Date(now.setDate(now.getDate() - diffToSunday + 6))

	return {
		from: formatDateRange(startOfWeek),
		to: formatDateRange(endOfWeek),
	}
}

export function getCurrentMonthRange(): { from: string; to: string } {
	const now = new Date(2024, 10, 30)
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
	const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

	return {
		from: formatDateRange(startOfMonth),
		to: formatDateRange(endOfMonth),
	}
}
