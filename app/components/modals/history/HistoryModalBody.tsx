import * as anchor from "@coral-xyz/anchor";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { useAtom } from "jotai";
import { rpcEndpointAtom } from "@/app/state";

import { LinkExternalIcon } from "@/app/components/icons/Icon";
import TimeAgo from "@/app/components/widgets/TimeAge";
import { clx, formatAddress, getSolanaExplore } from "@/app/utils/helpers";
import { Transaction } from "@/app/hooks/useData";
import { supabase } from "@/app/config/supabase";
import { useWallet } from "@solana/wallet-adapter-react";
import { ButtonPrimary } from "../../buttons/Button";

const PAGE_SIZE = 7;

const HistoryModalBody: React.FC = React.memo(function HistoryModalBody({}) {
	const { publicKey } = useWallet();
	const [rpcEndpoint] = useAtom(rpcEndpointAtom);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const loadingHistoryRef = useRef(false);
	const currentHistoryPageRef = useRef(0);
	const historyListContainerRef = useRef<HTMLDivElement>(null);

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

	const fetchHistoryTransactions = async (
		filterAddress: string,
		start: number,
		end: number,
	) => {
		const query = supabase
			.from("transaction")
			.select("*")
			.order("timestamp", { ascending: false });

		// 添加过滤条件
		if (filterAddress && filterAddress.trim()) {
			query.eq("data->>player", filterAddress);
		}

		// 添加分页
		query.range(start, end);

		const { data, error } = await query;

		if (error) throw error;

		return (data || []).map((item) => ({
			...item,
			data: typeof item.data === "string" ? JSON.parse(item.data) : item.data,
		})) as Transaction[];
	};

	const loadMoreHistoryTransactions = useCallback(
		async (filterAddress: string): Promise<boolean> => {
			if (loadingHistoryRef.current) return false;

			loadingHistoryRef.current = true;
			setIsLoading(true);

			try {
				const start = currentHistoryPageRef.current * PAGE_SIZE;
				const end = start + (PAGE_SIZE - 1);

				const typedData = await fetchHistoryTransactions(
					filterAddress,
					start,
					end,
				);
				if (currentHistoryPageRef.current === 0) {
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

				currentHistoryPageRef.current += 1;
				const hasMoreData = typedData.length === PAGE_SIZE;
				setHasMore(hasMoreData);

				return hasMoreData;
			} catch (error) {
				console.error("Error fetching more transactions:", error);
				return false;
			} finally {
				loadingHistoryRef.current = false;
				setIsLoading(false);
			}
		},
		[],
	);

	useEffect(() => {
		if (!publicKey) return;
		loadMoreHistoryTransactions(publicKey.toString());

		const historySubscribe = supabase
			.channel("custom-address-channel")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "transaction",
					filter: `data->>'player'.eq.'${publicKey?.toString()}'`,
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
						addNewTransaction(newTransaction);
					}
				},
			)
			.subscribe();

		// Fix: Return just the unsubscribe function
		return () => {
			historySubscribe.unsubscribe();
		};
	}, [publicKey, loadMoreHistoryTransactions]);

	return (
		<div className='flex grow flex-col'>
			<div className='flex w-full py-5'>
				<span className='w-1/6 sm:w-1/6'>DATE</span>
				<span className='w-3/6 sm:w-2/6'>TYPE</span>
				<span className='w-2/6 sm:w-1/6'>ORE</span>
				{/* <span className="w-2/6 sm:w-1/6">FGC + FGV</span> */}
				<span className='hidden sm:flex sm:w-2/6'>ADDRESS</span>
				<span className='w-[30px]'>TXN</span>
			</div>
			<div
				ref={historyListContainerRef}
				className='flex flex-1 overflow-auto pb-5'
			>
				<div className='h-0 max-h-full min-h-[300px] w-full'>
					{transactions.map((transaction) => (
						<div
							key={`${transaction.signature}-${transaction.id}`}
							className={clx(
								"flex border-b border-gray-700/40 py-4 text-xs",
								transaction.isNew ? "new-transaction" : "",
							)}
						>
							<span className='w-1/6 sm:w-1/6'>
								<TimeAgo timestamp={transaction.timestamp} />
							</span>
							<span className='w-3/6 sm:w-2/6'>
								{transaction.event_type?.split("Event")[0]}
							</span>
							<span className='w-2/6 sm:w-1/6'>
								{new anchor.BN(
									transaction.data?.purchaseQuantity || 0,
									16,
								).toString()}
							</span>
							<span className='hidden sm:flex sm:w-2/6'>
								{formatAddress(transaction.data?.player ?? "", 12, -12)}
							</span>
							<span className='w-[30px]'>
								<Link
									href={getSolanaExplore(rpcEndpoint, transaction.signature)}
									target='_blank'
								>
									<LinkExternalIcon className='w-5' color='#525252' />
								</Link>
							</span>
						</div>
					))}

					{isLoading && transactions.length === 0 && (
						<div className='w-full'>Loading...</div>
					)}

					{hasMore && (
						<div className='flex justify-center pt-4'>
							<ButtonPrimary
								className='h-8 text-xs rounded-lg'
								onClick={() =>
									publicKey && loadMoreHistoryTransactions(publicKey.toString())
								}
								disabled={isLoading}
							>
								{isLoading ? "Loading..." : "Load More"}
							</ButtonPrimary>
						</div>
					)}
				</div>
			</div>
		</div>
	);
});

export default HistoryModalBody;
