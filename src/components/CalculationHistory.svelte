<script lang="ts">
	import { onMount } from 'svelte';
	import { getHistory, clearHistory, type HistoryEntry } from '../utils/storage';
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardTitle from '$lib/components/ui/card-title.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import Button from '$lib/components/ui/button.svelte';

	// Props to allow parent component to trigger reapplication
	interface Props {
		onReapply?: (price: number, discount: number) => void;
	}

	let { onReapply }: Props = $props();

	// State management
	let history = $state<HistoryEntry[]>([]);

	// Load history on mount
	onMount(() => {
		loadHistory();

		// Listen for storage events from other tabs
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'discount-calc-history') {
				loadHistory();
			}
		};

		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	});

	// Load history from localStorage
	function loadHistory() {
		history = getHistory();
	}

	// Clear all history
	function handleClearAll() {
		clearHistory();
		loadHistory();
	}

	// Reapply a calculation
	function handleReapply(entry: HistoryEntry) {
		if (onReapply) {
			onReapply(entry.originalPrice, entry.discountPercent);
		}
	}

	// Format currency
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-DE', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount);
	}

	// Format date/time
	function formatTimestamp(timestamp: number): string {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;

		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	// Expose loadHistory for parent components
	export function refresh() {
		loadHistory();
	}
</script>

<Card>
	<CardHeader>
		<div class="flex items-center justify-between">
			<CardTitle>Recent Calculations</CardTitle>
			{#if history.length > 0}
				<Button variant="ghost" size="sm" onclick={handleClearAll} class="text-destructive hover:text-destructive">
					Clear All
				</Button>
			{/if}
		</div>
	</CardHeader>
	<CardContent>
		{#if history.length === 0}
			<!-- Empty State -->
			<div class="py-12 text-center">
				<div class="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
					<svg
						class="w-8 h-8 text-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
						></path>
					</svg>
				</div>
				<p class="text-sm text-muted-foreground">
					No calculations yet. Start by entering a price and discount!
				</p>
			</div>
		{:else}
			<!-- History List -->
			<div class="space-y-3">
				{#each history as entry (entry.id)}
					<button
						onclick={() => handleReapply(entry)}
						class="w-full p-4 bg-muted/50 hover:bg-muted rounded-lg transition-all duration-200 text-left group border border-transparent hover:border-border"
					>
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
							<div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 flex-wrap">
								<!-- Original Price -->
								<span class="text-sm sm:text-base font-medium tabular-nums">
									{formatCurrency(entry.originalPrice)}
								</span>

								<!-- Arrow -->
								<svg
									class="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									></path>
								</svg>

								<!-- Final Price -->
								<span class="text-sm sm:text-base font-bold tabular-nums">
									{formatCurrency(entry.finalPrice)}
								</span>

								<!-- Discount Badge -->
								<span
									class="px-2 py-1 text-xs font-semibold bg-secondary text-secondary-foreground rounded-full whitespace-nowrap"
								>
									{entry.discountPercent}% off
								</span>
							</div>

							<!-- Timestamp -->
							<span class="text-xs text-muted-foreground whitespace-nowrap">
								{formatTimestamp(entry.timestamp)}
							</span>
						</div>

						<!-- Savings Amount -->
						<div class="text-sm font-medium">
							Saved {formatCurrency(entry.originalPrice - entry.finalPrice)}
						</div>

						<!-- Hover hint -->
						<div
							class="mt-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
						>
							Click to reapply this calculation
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</CardContent>
</Card>
