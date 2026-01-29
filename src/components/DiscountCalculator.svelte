<script lang="ts">
	import { saveCalculation } from '../utils/storage';

	// Props to allow history integration
	interface Props {
		onHistoryUpdate?: () => void;
	}

	let { onHistoryUpdate }: Props = $props();

	// State management using Svelte 5 runes
	let price = $state(0);
	let discountPercent = $state(0);
	let activeButton = $state<number | null>(null);
	let lastSavedCalculation = $state<string | null>(null);

	// Derived values (auto-calculated)
	let discountedPrice = $derived(price - (price * discountPercent) / 100);
	let savedAmount = $derived((price * discountPercent) / 100);

	// Track if we should save to history
	$effect(() => {
		// Only save when both price and discount are meaningful
		if (price > 0 && discountPercent > 0) {
			const calculationKey = `${price}-${discountPercent}`;
			
			// Avoid saving duplicate consecutive calculations
			if (calculationKey !== lastSavedCalculation) {
				saveToHistory();
				lastSavedCalculation = calculationKey;
			}
		}
	});

	// Event handlers
	function onPriceChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseFloat(input.value) || 0;
		price = Math.max(0, value);
	}

	function onDiscountChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseFloat(input.value) || 0;
		discountPercent = Math.max(0, Math.min(100, value));
		activeButton = null; // Clear active button when custom input is used
	}

	function applyQuickDiscount(percent: number) {
		discountPercent = percent;
		activeButton = percent;
	}

	// Save calculation to history
	function saveToHistory() {
		if (price > 0 && discountPercent > 0) {
			saveCalculation(price, discountPercent, discountedPrice);
			
			// Notify parent component to refresh history
			if (onHistoryUpdate) {
				onHistoryUpdate();
			}
		}
	}

	// Allow parent to set values (for reapplying from history)
	export function setCalculation(newPrice: number, newDiscount: number) {
		price = newPrice;
		discountPercent = newDiscount;
		
		// Update active button if it matches a preset
		if (newDiscount === 10 || newDiscount === 20 || newDiscount === 30) {
			activeButton = newDiscount;
		} else {
			activeButton = null;
		}
	}

	// Currency formatter
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount);
	}
</script>

<div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 transition-colors">
	<h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
		Calculate Your Discount
	</h2>

	<!-- Price Input Section -->
	<div class="mb-6">
		<label
			for="price-input"
			class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
		>
			Enter Original Price
		</label>
		<div class="relative">
			<span
				class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 text-lg font-semibold"
			>
				$
			</span>
			<input
				id="price-input"
				type="number"
				min="0"
				step="0.01"
				placeholder="100.00"
				value={price || ''}
				oninput={onPriceChange}
				class="w-full h-12 pl-10 pr-4 text-lg bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-zinc-900 dark:text-zinc-100 transition-colors"
			/>
		</div>
	</div>

	<!-- Quick Discount Buttons -->
	<div class="mb-6">
		<div class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
			Quick Discount
		</div>
		<div class="grid grid-cols-3 gap-3">
			<button
				onclick={() => applyQuickDiscount(10)}
				class="h-14 font-semibold text-lg rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 {activeButton ===
				10
					? 'bg-blue-600 text-white shadow-lg'
					: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'}"
			>
				10%
			</button>
			<button
				onclick={() => applyQuickDiscount(20)}
				class="h-14 font-semibold text-lg rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 {activeButton ===
				20
					? 'bg-purple-600 text-white shadow-lg'
					: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'}"
			>
				20%
			</button>
			<button
				onclick={() => applyQuickDiscount(30)}
				class="h-14 font-semibold text-lg rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 {activeButton ===
				30
					? 'bg-pink-600 text-white shadow-lg'
					: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700'}"
			>
				30%
			</button>
		</div>
	</div>

	<!-- Custom Discount Input -->
	<div class="mb-6">
		<label
			for="discount-input"
			class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
		>
			Custom Discount
		</label>
		<div class="relative">
			<input
				id="discount-input"
				type="number"
				min="0"
				max="100"
				step="0.1"
				placeholder="0"
				value={discountPercent || ''}
				oninput={onDiscountChange}
				class="w-full h-12 pl-4 pr-12 text-lg bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-zinc-900 dark:text-zinc-100 transition-colors"
			/>
			<span
				class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 text-lg font-semibold"
			>
				%
			</span>
		</div>
	</div>

	<!-- Results Display -->
	{#if price > 0 && discountPercent > 0}
		<div
			class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors"
		>
			<div class="space-y-4">
				<!-- Final Price -->
				<div class="text-center">
					<p class="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
						Final Price
					</p>
					<p class="text-4xl font-bold text-blue-600 dark:text-blue-400">
						{formatCurrency(discountedPrice)}
					</p>
				</div>

				<!-- Divider -->
				<div class="border-t border-blue-200 dark:border-blue-800"></div>

				<!-- Savings Information -->
				<div class="grid grid-cols-2 gap-4 text-center">
					<div>
						<p class="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
							You Save
						</p>
						<p class="text-xl font-bold text-green-600 dark:text-green-400">
							{formatCurrency(savedAmount)}
						</p>
					</div>
					<div>
						<p class="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
							Discount
						</p>
						<p class="text-xl font-bold text-purple-600 dark:text-purple-400">
							{discountPercent.toFixed(1)}%
						</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Empty State Message -->
	{#if price === 0 || discountPercent === 0}
		<div class="mt-8 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-center transition-colors">
			<p class="text-zinc-500 dark:text-zinc-400 text-sm">
				{price === 0
					? 'Enter a price to start calculating'
					: 'Select or enter a discount percentage'}
			</p>
		</div>
	{/if}
</div>
