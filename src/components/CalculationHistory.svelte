<script lang="ts">
	import { onMount } from 'svelte';
	import { getHistory, clearHistory, type HistoryEntry } from '../utils/storage';

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
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
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

<div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 transition-colors">
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
			Recent Calculations
		</h2>
		{#if history.length > 0}
			<button
				onclick={handleClearAll}
				class="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
			>
				Clear All
			</button>
		{/if}
	</div>

	{#if history.length === 0}
		<!-- Empty State -->
		<div class="py-12 text-center">
			<div class="w-16 h-16 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
				<svg
					class="w-8 h-8 text-zinc-400 dark:text-zinc-600"
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
			<p class="text-zinc-500 dark:text-zinc-400 text-sm">
				No calculations yet. Start by entering a price and discount!
			</p>
		</div>
	{:else}
		<!-- History List -->
		<div class="space-y-3">
			{#each history as entry (entry.id)}
				<button
					onclick={() => handleReapply(entry)}
					class="w-full p-4 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200 text-left group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
				>
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
						<div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 flex-wrap">
							<!-- Original Price -->
							<span class="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-medium tabular-nums">
								{formatCurrency(entry.originalPrice)}
							</span>

							<!-- Arrow -->
							<svg
								class="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400 dark:text-zinc-600 flex-shrink-0"
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
							<span class="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-bold tabular-nums">
								{formatCurrency(entry.finalPrice)}
							</span>

							<!-- Discount Badge -->
							<span
								class="px-2 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 rounded-full whitespace-nowrap"
							>
								{entry.discountPercent}% off
							</span>
						</div>

						<!-- Timestamp -->
						<span class="text-xs text-zinc-500 dark:text-zinc-500 whitespace-nowrap">
							{formatTimestamp(entry.timestamp)}
						</span>
					</div>

					<!-- Savings Amount -->
					<div class="text-sm text-green-600 dark:text-green-400 font-medium">
						Saved {formatCurrency(entry.originalPrice - entry.finalPrice)}
					</div>

					<!-- Hover hint -->
					<div
						class="mt-2 text-xs text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity"
					>
						Click to reapply this calculation
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>
