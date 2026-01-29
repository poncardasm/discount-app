<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { cn } from '$lib/utils';

	// State management using Svelte 5 runes
	let price = $state(0);
	let discountPercent = $state(0);
	
	const presetDiscounts = [10, 20, 25, 30, 50, 75];

	// Derived values (auto-calculated)
	let discountedPrice = $derived(price - (price * discountPercent) / 100);
	let savedAmount = $derived((price * discountPercent) / 100);
	let hasInput = $derived(price > 0 || discountPercent > 0);

	// Event handlers
	function onPriceChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseFloat(input.value);
		const MAX_PRICE = 999999999999; // Max: 999 billion
		price = isNaN(value) ? 0 : Math.max(0, Math.min(value, MAX_PRICE));
	}

	function onDiscountChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseFloat(input.value);
		setDiscount(isNaN(value) ? 0 : value);
	}
	
	function setDiscount(value: number) {
		discountPercent = Math.max(0, Math.min(100, value));
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

<div class="w-full max-w-5xl mx-auto">
	<Card class="border-border shadow-lg">
		<CardContent class="p-6 sm:p-8 space-y-8">
			<!-- Header Section -->
			<div class="text-center flex flex-col items-center relative">
				<h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
					Discount Calculator
				</h1>
				<p class="text-sm text-muted-foreground">
					Calculate your savings instantly
				</p>
				
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<!-- Input Section -->
				<div class="space-y-6">
					<!-- Price Input -->
					<div>
						<Label for="price-input" class="block mb-2 text-sm font-medium">Original Price</Label>
						<div class="relative group">
							<span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base font-medium group-focus-within:text-primary">
								€
							</span>
							<Input
								id="price-input"
								type="number"
								min="0"
								max="999999999999"
								step="0.01"
								placeholder="0.00"
								value={price || ''}
								oninput={onPriceChange}
								class="pl-8 h-12 tabular-nums text-lg font-medium border-input focus-visible:ring-primary"
							/>
						</div>
					</div>

					<!-- Discount Input -->
					<div>
						<div class="flex justify-between items-baseline mb-2">
							<Label for="discount-input" class="text-sm font-medium">Discount</Label>
							<span class="text-sm font-bold text-primary tabular-nums">{Math.round(discountPercent)}%</span>
						</div>
						
						<div class="space-y-4">
							<div class="relative group">
								<Input
									id="discount-input"
									type="number"
									min="0"
									max="100"
									step="1"
									placeholder="0"
									value={discountPercent || ''}
									oninput={onDiscountChange}
									class="pr-8 h-12 tabular-nums text-lg font-medium border-input focus-visible:ring-primary"
								/>
								<span class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base font-medium group-focus-within:text-primary">
									%
								</span>
							</div>

							<!-- Range Slider -->
							<input
								type="range"
								min="0"
								max="100"
								step="1"
								value={discountPercent}
								oninput={onDiscountChange}
								class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
								aria-label="Discount percentage slider"
							/>

							<!-- Preset Buttons -->
							<div class="grid grid-cols-3 gap-3">
								{#each presetDiscounts as preset}
									<Button
										variant={discountPercent === preset ? "default" : "outline"}
										size="sm"
										class={cn(
											"text-xs",
											discountPercent === preset ? "scale-105 font-bold" : "hover:border-primary/50"
										)}
										onclick={() => setDiscount(preset)}
									>
										{preset}%
									</Button>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- Results Section -->
				<div class="flex flex-col justify-start space-y-4">
					<div class={cn(
						"relative overflow-hidden rounded-xl border",
						hasInput ? "bg-primary/5 border-primary/20 shadow-md" : "bg-muted/30 border-dashed border-border"
					)}>
						<div class="p-6 text-center space-y-6">
							<div>
								<p class="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
									Final Price
								</p>
						<div class="flex items-center justify-center gap-1 min-h-[3rem] sm:min-h-[3.5rem] px-2">
							<span class={cn(
								"text-2xl sm:text-3xl font-bold tracking-tight tabular-nums break-all text-center",
								hasInput ? "text-primary" : "text-muted-foreground/30"
							)}>
								{formatCurrency(discountedPrice)}
							</span>
						</div>
							</div>
							
							<div class="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
								<div>
									<p class="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
										You Save
									</p>
									<p class={cn(
										"text-lg font-bold tabular-nums",
										hasInput ? "text-green-600 dark:text-green-400" : "text-muted-foreground/30"
									)}>
										{formatCurrency(savedAmount)}
									</p>
								</div>
								<div>
									<p class="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
										Off
									</p>
									<p class={cn(
										"text-lg font-bold tabular-nums",
										hasInput ? "text-foreground" : "text-muted-foreground/30"
									)}>
										{discountPercent.toFixed(0)}%
									</p>
								</div>
							</div>
						</div>
					</div>
					
				</div>
			</div>
		</CardContent>
	</Card>
</div>
