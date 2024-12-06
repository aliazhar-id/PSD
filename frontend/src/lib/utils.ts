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

export function formatDateHistory(dateInput: string): string {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	}
	const date = new Date(dateInput)
	return date.toLocaleDateString('id-ID', options)
}
