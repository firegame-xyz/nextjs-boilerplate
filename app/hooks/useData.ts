// import * as anchor from "@coral-xyz/anchor";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const useQueryData = (address?: string) => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const processedIdsRef = useRef(new Set<number>());
	const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

	const addNewTransaction = useCallback((newTransaction: Transaction) => {
		setTransactions((prevTransactions) => {
			if (prevTransactions.some((t) => t.id === newTransaction.id)) {
				return prevTransactions;
			}
			return [{ ...newTransaction, isNew: true }, ...prevTransactions];
		});

		setTimeout(() => {
			setTransactions((prevTransactions) =>
				prevTransactions.map((t) =>
					t.id === newTransaction.id ? { ...t, isNew: false } : t,
				),
			);
		}, 500);
	}, []);

	const constructQueryOptions = useCallback((address?: string) => {
		const eventTypes = ["purchase", "reinvest", "autoReinvest", "exit"];
		const baseFilter = {
			or: eventTypes.map((type) => ({ eventType: { eq: type } })),
		};

		return {
			filter: {
				and: [baseFilter, ...(address ? [{ initiator: { eq: address } }] : [])],
			},
			sort: {
				field: "timestamp",
				order: "DESC",
			},
		};
	}, []);

	const setupSubscriptionAndQuery = useCallback(async () => {
		// const queryOptions = constructQueryOptions(address);

		// try {
		// 	const { data } = await client.models.Transaction.list(queryOptions);
		// 	const typedData = (data as unknown as Transaction[])
		// 		.sort((a, b) => b.timestamp - a.timestamp)
		// 		.map(parseTransactionData);

		// 	setTransactions(typedData);
		// 	typedData.forEach((t) => processedIdsRef.current.add(t.id));
		// } catch (error) {
		// 	console.error("Error fetching initial transactions:", error);
		// }

		try {
			const query = supabase
				.from("transaction")
				.select("*")
				.in("event_type", ["purchase", "reinvest", "autoReinvest", "exit"])
				.order("timestamp", { ascending: false });

			const { data } = await (address
				? query.eq("initiator", address)
				: query);

			const typedData = (data || []).map((item) => ({
				...item,
				data: typeof item.data === "string" ? JSON.parse(item.data) : item.data,
			})) as Transaction[];

			setTransactions(typedData);
			typedData.forEach((t) => processedIdsRef.current.add(t.id));
		} catch (error) {
			console.error("Error fetching initial transactions:", error);
		}

		subscriptionRef.current = supabase
			.channel("custom-all-channel")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "transaction",
					filter: `event_type=in.(purchase,reinvest,autoReinvest,exit)${
						address ? ` AND initiator=eq.${address}` : ""
					}`,
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

						if (!processedIdsRef.current.has(newTransaction.id)) {
							processedIdsRef.current.add(newTransaction.id);
							addNewTransaction(newTransaction);
						}
					}
				},
			)
			.subscribe();

		// const observable = client.models.Transaction.observeQuery(queryOptions);
		// subscriptionRef.current = observable.subscribe({
		// 	next: ({ items, isSynced }) => {
		// 		console.log(isSynced);
		// 		if (isSynced) {
		// 			const typedData = ((items as unknown) as Transaction[])
		// 				.sort((a, b) => b.timestamp - a.timestamp)
		// 				.map(parseTransactionData);

		// 			setTransactions(typedData);
		// 			typedData.forEach((t) => processedIdsRef.current.add(t.id));
		// 		} else {
		// 			const newTransactions = ((items as unknown) as Transaction[])
		// 				.filter((t) => !processedIdsRef.current.has(t.id))
		// 				// .sort((a, b) => b.timestamp - a.timestamp)
		// 				.map(parseTransactionData);

		// 			newTransactions.forEach((transaction, index) => {
		// 				processedIdsRef.current.add(transaction.id);
		// 				setTimeout(() => addNewTransaction(transaction), index * 200);
		// 			});
		// 		}
		// 	},
		// 	error: (error) => console.error("Subscription error:", error),
		// });
	}, [address, supabase, constructQueryOptions, addNewTransaction]);

	useEffect(() => {
		setupSubscriptionAndQuery();
		return () => subscriptionRef.current?.unsubscribe();
	}, []);

	return { transactions };
};

const avatarUrlCache = new Map<string, { url: string; timestamp: number }>();

export const getAvatarUrl = async (url: string) => {
	// Check cache first
	const cached = avatarUrlCache.get(url);
	if (cached && Date.now() - cached.timestamp < 3600000) {
		// 1 hour cache
		return cached.url;
	}

	const pathSegments = url.split("/");
	const imgId = pathSegments[pathSegments.length - 1];

	const { data } = await supabase.storage
		.from("avatar")
		.createSignedUrl(`uploads/${imgId}`, 3600);

	// Store in cache if successful
	if (data?.signedUrl) {
		avatarUrlCache.set(url, {
			url: data.signedUrl,
			timestamp: Date.now(),
		});
	}

	return data?.signedUrl;
};

export function useAvatarUrl(imageUrl: string | undefined | null) {
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!imageUrl?.trim()) {
			setAvatarUrl(null);
			return;
		}

		getAvatarUrl(imageUrl)
			.then((url) => setAvatarUrl(url || null))
			.catch((err) => {
				console.error("Error fetching avatar URL:", err);
				setAvatarUrl(null);
			});
	}, [imageUrl]);

	return avatarUrl;
}

export const useCurrentTime = () => {
	const [currentTime, setCurrentTime] = useState<number>(
		Math.floor(Date.now() / 1000),
	);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(Math.floor(Date.now() / 1000));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return currentTime;
};
