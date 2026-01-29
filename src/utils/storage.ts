/**
 * Storage utilities for managing calculation history in localStorage
 */

const STORAGE_KEY = 'discount-calc-history';
const MAX_HISTORY_ITEMS = 10;

export interface HistoryEntry {
	id: string;
	originalPrice: number;
	discountPercent: number;
	finalPrice: number;
	timestamp: number;
}

/**
 * Check if localStorage is available in the current environment
 * @returns true if localStorage is available, false otherwise
 */
function isLocalStorageAvailable(): boolean {
	try {
		const test = '__localStorage_test__';
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * Save a new calculation to history
 * Keeps only the last 10 calculations
 */
export function saveCalculation(
	originalPrice: number,
	discountPercent: number,
	finalPrice: number
): void {
	if (!isLocalStorageAvailable()) {
		console.warn('localStorage is not available');
		return;
	}

	try {
		const history = getHistory();
		
		const newEntry: HistoryEntry = {
			id: Date.now().toString(),
			originalPrice,
			discountPercent,
			finalPrice,
			timestamp: Date.now(),
		};

		// Add new entry at the beginning
		history.unshift(newEntry);

		// Keep only the last 10 items
		const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

		// Save to localStorage
		localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
	} catch (error) {
		console.error('Failed to save calculation to history:', error);
	}
}

/**
 * Get all calculation history
 * Returns an empty array if no history exists or on error
 */
export function getHistory(): HistoryEntry[] {
	if (!isLocalStorageAvailable()) {
		return [];
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) {
			return [];
		}

		const parsed = JSON.parse(stored);
		
		// Validate that it's an array
		if (!Array.isArray(parsed)) {
			console.warn('Invalid history format, resetting');
			return [];
		}

		// Validate each entry has required fields
		return parsed.filter((entry): entry is HistoryEntry => {
			return (
				typeof entry === 'object' &&
				entry !== null &&
				typeof entry.id === 'string' &&
				typeof entry.originalPrice === 'number' &&
				typeof entry.discountPercent === 'number' &&
				typeof entry.finalPrice === 'number' &&
				typeof entry.timestamp === 'number'
			);
		});
	} catch (error) {
		console.error('Failed to retrieve calculation history:', error);
		return [];
	}
}

/**
 * Clear all calculation history
 */
export function clearHistory(): void {
	if (!isLocalStorageAvailable()) {
		return;
	}

	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error('Failed to clear history:', error);
	}
}

/**
 * Delete a specific calculation from history by ID
 */
export function deleteCalculation(id: string): void {
	if (!isLocalStorageAvailable()) {
		return;
	}

	try {
		const history = getHistory();
		const filtered = history.filter(entry => entry.id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
	} catch (error) {
		console.error('Failed to delete calculation:', error);
	}
}
