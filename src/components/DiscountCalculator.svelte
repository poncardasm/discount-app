<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';

	// State management using Svelte 5 runes
	let price = $state(0);
	let discountPercent = $state(0);
	let activeButton = $state<number | null>(null);

	// Derived values (auto-calculated)
	let discountedPrice = $derived(price - (price * discountPercent) / 100);
	let savedAmount = $derived((price * discountPercent) / 100);

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

	// Currency formatter
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-DE', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount);
	}
</script>

<Card class="mb-8">
	<CardContent class="pt-6">
		<!-- Price Input Section -->
		<div class="space-y-5">
			<div>
				<Label for="price-input" class="block mb-3">Original Price</Label>
				<div class="relative">
					<span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
						€
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
			<div>
				<Label class="block mb-3">Quick Discount</Label>
				<div class="grid grid-cols-3 gap-2">
					<Button
						variant={activeButton === 10 ? 'default' : 'outline'}
						aria-pressed={activeButton === 10}
						onclick={() => applyQuickDiscount(10)}
					>
						10%
					</Button>
					<Button
						variant={activeButton === 20 ? 'default' : 'outline'}
						aria-pressed={activeButton === 20}
						onclick={() => applyQuickDiscount(20)}
					>
						20%
					</Button>
					<Button
						variant={activeButton === 30 ? 'default' : 'outline'}
						aria-pressed={activeButton === 30}
						onclick={() => applyQuickDiscount(30)}
					>
						30%
					</Button>
				</div>
			</div>

			<!-- Custom Discount Input -->
			<div>
				<Label for="discount-input" class="block mb-3">Custom Discount</Label>
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
