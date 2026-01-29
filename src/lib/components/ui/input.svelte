<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		id?: string;
		class?: string;
		placeholder?: string;
		type?: string;
		value?: string | number;
		min?: string | number;
		max?: string | number;
		step?: string | number;
		oninput?: (event: Event) => void;
	}

	let {
		id,
		class: className,
		placeholder,
		type = "text",
		value,
		min,
		max,
		step,
		oninput,
		...restProps
	}: Props = $props();
</script>

<input
	{id}
	{type}
	{placeholder}
	{value}
	{min}
	{max}
	{step}
	{oninput}
	class={cn(
		"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...restProps}
/>
