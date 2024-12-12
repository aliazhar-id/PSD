import { Button } from '@/components/ui/button'

export default function Error({
	error,
	reset,
}: {
	error: string
	reset: () => void
}) {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
				<p className="text-xl mb-4">We apologize for the inconvenience.</p>
				<p className="text-gray-600 mb-8">
					Error: {error || 'An unexpected error occurred.'}
				</p>
				<div className="flex justify-center">
					<Button onClick={() => reset()} variant="default">
						Try again
					</Button>
				</div>
			</div>
		</main>
	)
}
