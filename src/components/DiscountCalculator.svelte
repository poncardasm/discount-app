<script lang="ts">
	import { saveCalculation } from '../utils/storage';
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardTitle from '$lib/components/ui/card-title.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';

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

<Card>
	<CardHeader>
		<CardTitle>Calculate Your Discount</CardTitle>
	</CardHeader>
	<CardContent>
		<!-- Price Input Section -->
		<div class="space-y-5">
			<div class="space-y-2">
				<Label for="price-input">Original Price</Label>
				<div class="relative">
					<span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
						$
					</span>
					<Input
						id="price-input"
						type="number"
						min="0"
						step="0.01"
						placeholder="100.00"
						value={price || ''}
						oninput={onPriceChange}
						class="pl-7 tabular-nums"
					/>
				</div>
			</div>

			<!-- Quick Discount Buttons -->
			<div class="space-y-2">
				<Label>Quick Discount</Label>
				<div class="grid grid-cols-3 gap-2">
					<Button
						variant={activeButton === 10 ? 'default' : 'outline'}
						onclick={() => applyQuickDiscount(10)}
					>
						10%
					</Button>
					<Button
						variant={activeButton === 20 ? 'default' : 'outline'}
						onclick={() => applyQuickDiscount(20)}
					>
						20%
					</Button>
					<Button
						variant={activeButton === 30 ? 'default' : 'outline'}
						onclick={() => applyQuickDiscount(30)}
					>
						30%
					</Button>
				</div>
			</div>

			<!-- Custom Discount Input -->
			<div class="space-y-2">
				<Label for="discount-input">Custom Discount</Label>
				<div class="relative">
					<Input
						id="discount-input"
						type="number"
						min="0"
						max="100"
						step="0.1"
						placeholder="0"
						value={discountPercent || ''}
						oninput={onDiscountChange}
						class="pr-8 tabular-nums"
					/>
					<span class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
						%
					</span>
				</div>
			</div>

			<!-- Results Display -->
			{#if price > 0 && discountPercent > 0}
				<div class="rounded-lg border bg-muted p-5 mt-6">
					<div class="space-y-4">
						<!-- Final Price -->
						<div class="text-center">
							<p class="text-xs text-muted-foreground mb-1">Final Price</p>
							<p class="text-3xl font-bold tracking-tight tabular-nums">
								{formatCurrency(discountedPrice)}
							</p>
						</div>

						<!-- Divider -->
						<div class="border-t"></div>

						<!-- Savings Information -->
						<div class="grid grid-cols-2 gap-4 text-center">
							<div>
								<p class="text-xs text-muted-foreground mb-1">You Save</p>
								<p class="text-base font-semibold tabular-nums">
									{formatCurrency(savedAmount)}
								</p>
							</div>
							<div>
								<p class="text-xs text-muted-foreground mb-1">Discount</p>
								<p class="text-base font-semibold tabular-nums">
									{discountPercent.toFixed(1)}%
								</p>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Empty State Message -->
			{#if price === 0 || discountPercent === 0}
				<div class="rounded-lg border bg-muted p-5 mt-6 text-center">
					<p class="text-sm text-muted-foreground">
						{price === 0
							? 'Enter a price to start calculating'
							: 'Select or enter a discount percentage'}
					</p>
				</div>
			{/if}
		</div>
	</CardContent>
</Card>
