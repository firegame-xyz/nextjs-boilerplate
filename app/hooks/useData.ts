import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/app/config/supabase";

// Type definition for transaction data
export type Transaction = {
	id: number;
	signature: string;
	slot: number;
	event_type: string;
	data: {
		player?: string;
		round?: string;
		period?: string;
		referrer?: string;
		purchaseQuantity?: string | number;
		[key: string]: string | number | undefined;
	} | null;
	initiator_type: string;
	initiator: string;
	timestamp: number;
	created_at: string;
	updated_at: string | null;
	isNew?: boolean;
};

// Valid transaction event types
const TRANSACTION_TYPES = [
	"purchase",
	"reinvest",
	"autoReinvest",
	"exit",
] as const;

// Number of transactions to load per page
const PAGE_SIZE = 7;

// Service for handling transaction data operations
export const transactionService = {
	// Fetch transactions with filtering and pagination
	async fetchTransactions(filterAddress: string, start: number, end: number) {
		let query = supabase
			.from("transaction")
			.select("*")
			.in("event_type", TRANSACTION_TYPES)
			.order("timestamp", { ascending: false });

		// Add address filter if provided
		if (filterAddress && filterAddress.trim()) {
			query = query.eq("data->>player", filterAddress);
		}

		// Add pagination range
		query = query.range(start, end);

		const { data, error } = await query;

		if (error) throw error;

		return (data || []).map((item) => ({
			...item,
			data: typeof item.data === "string" ? JSON.parse(item.data) : item.data,
		})) as Transaction[];
	},

	// Subscribe to real-time transaction updates
	subscribeToTransactions(onInsert: (transaction: Transaction) => void) {
		return supabase
			.channel("custom-all-channel")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "transaction",
					filter: `event_type=in.(${TRANSACTION_TYPES.join(",")})`,
				},
				(payload) => {
					if (payload.eventType === "INSERT") {
						const newTransaction = {
							...payload.new,
							data:
								typeof payload.new.data === "string"
									? JSON.parse(payload.new.data)
									: payload.new.data,
							isNew: true,
						} as Transaction;
						onInsert(newTransaction);
					}
				},
			)
			.subscribe();
	},
};

// Custom hook for querying and managing transaction data
export const useQueryData = (filterAddress: string) => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const processedIdsRef = useRef(new Set<number>()); // Track processed transaction IDs
	const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
	const currentPageRef = useRef(0);
	const currentFilterRef = useRef("");
	const loadingRef = useRef(false); // Prevent concurrent loading

	// Add a new transaction to the list
	const addNewTransaction = useCallback((newTransaction: Transaction) => {
		setTransactions((prevTransactions) => {
			if (prevTransactions.some((t) => t.id === newTransaction.id)) {
				return prevTransactions;
			}
			return [{ ...newTransaction, isNew: true }, ...prevTransactions];
		});

		// Remove highlight after 500ms
		setTimeout(() => {
			setTransactions((prevTransactions) =>
				prevTransactions.map((t) =>
					t.id === newTransaction.id ? { ...t, isNew: false } : t,
				),
			);
		}, 500);
	}, []);

	// Load more transactions with filtering
	const loadMoreTransactions = useCallback(
		async (filterAddress: string): Promise<boolean> => {
			if (loadingRef.current) return false;

			loadingRef.current = true;
			setIsLoading(true);

			try {
				// Reset state if filter changes
				if (filterAddress !== currentFilterRef.current) {
					currentPageRef.current = 0;
					currentFilterRef.current = filterAddress;
					setTransactions([]);
					processedIdsRef.current.clear();
				}

				const start = currentPageRef.current * PAGE_SIZE;
				const end = start + (PAGE_SIZE - 1);

				const typedData = await transactionService.fetchTransactions(
					filterAddress,
					start,
					end,
				);

				// Update transactions if filter hasn't changed
				if (filterAddress === currentFilterRef.current) {
					if (currentPageRef.current === 0) {
						setTransactions(typedData);
					} else {
						setTransactions((prev) => {
							const newData = typedData.filter(
								(newItem) =>
									!prev.some(
										(existingItem) =>
											existingItem.id === newItem.id &&
											existingItem.signature === newItem.signature,
									),
							);
							return [...prev, ...newData];
						});
					}

					// Update processed IDs
					typedData.forEach((t) => processedIdsRef.current.add(t.id));
					currentPageRef.current += 1;

					return typedData.length === PAGE_SIZE;
				}
				return false;
			} catch (error) {
				console.error("Error fetching more transactions:", error);
				return false;
			} finally {
				loadingRef.current = false;
				setIsLoading(false);
			}
		},
		[],
	);

	// Reset all state
	const resetState = useCallback(() => {
		loadingRef.current = false;
		setTransactions([]);
		processedIdsRef.current.clear();
		currentPageRef.current = 0;
		currentFilterRef.current = "";
		subscriptionRef.current?.unsubscribe();
		setIsLoading(false);
	}, []);

	// Setup real-time subscription
	const setupSubscription = useCallback(() => {
		subscriptionRef.current?.unsubscribe();
		subscriptionRef.current = transactionService.subscribeToTransactions(
			(newTransaction) => {
				// Only add transaction if it matches current filter
				if (
					!currentFilterRef.current ||
					newTransaction.data?.player === currentFilterRef.current
				) {
					if (!processedIdsRef.current.has(newTransaction.id)) {
						processedIdsRef.current.add(newTransaction.id);
						addNewTransaction(newTransaction);
					}
				}
			},
		);
	}, [addNewTransaction]);

	// Initialize data with filter
	const initializeData = useCallback(
		async (address: string) => {
			resetState();
			await loadMoreTransactions(address);
			setupSubscription();
		},
		[resetState, loadMoreTransactions, setupSubscription],
	);

	// Setup effect for filter changes
	useEffect(() => {
		initializeData(filterAddress);
		return () => {
			subscriptionRef.current?.unsubscribe();
		};
	}, [filterAddress, initializeData]);

	return { transactions, isLoading, loadMoreTransactions };
};

// Cache for avatar URLs
const avatarUrlCache = new Map<string, { url: string; timestamp: number }>();

// Get signed URL for avatar image
export const getAvatarUrl = async (url: string) => {
	const CACHE_DURATION = 3600000; // 1 hour in milliseconds
	const cached = avatarUrlCache.get(url);

	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.url;
	}

	try {
		const imgId = url.split("/").pop();
		if (!imgId) throw new Error("Invalid URL format");

		const { data, error } = await supabase.storage
			.from("avatar")
			.createSignedUrl(`uploads/${imgId}`, 3600);

		if (error) throw error;

		if (data?.signedUrl) {
			avatarUrlCache.set(url, {
				url: data.signedUrl,
				timestamp: Date.now(),
			});
			return data.signedUrl;
		}
		return null;
	} catch (err) {
		console.error("Error generating signed URL:", err);
		return null;
	}
};

// Custom hook for managing avatar URLs
export function useAvatarUrl(imageUrl: string | undefined | null) {
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	const fetchUrl = useCallback(async () => {
		if (!imageUrl?.trim()) {
			setAvatarUrl(null);
			return;
		}

		try {
			const url = await getAvatarUrl(imageUrl);
			setAvatarUrl(url);
		} catch (err) {
			console.error("Error fetching avatar URL:", err);
			setAvatarUrl(null);
		}
	}, [imageUrl]);

	useEffect(() => {
		fetchUrl();
	}, [fetchUrl]);

	return avatarUrl;
}
