<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	interface Props {
		for?: string;
		class?: string;
		children?: Snippet;
	}

	let { for: htmlFor, class: className, children }: Props = $props();
</script>

<label
	for={htmlFor}
	class={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
>
	{@render children?.()}
</label>
