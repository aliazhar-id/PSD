import Spinner from '@/components/ui/spinner'

export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background">
			<Spinner className="w-12 h-12 text-primary" />
			<p className="mt-4 text-lg font-medium text-muted-foreground">
				Loading...
			</p>
		</div>
	)
}
