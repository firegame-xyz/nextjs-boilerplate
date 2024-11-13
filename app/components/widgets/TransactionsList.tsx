import * as anchor from "@coral-xyz/anchor";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { rpcEndpointAtom } from "@/app/state";
import Link from "next/link";
import { clx, formatAddress, getSolanaExplore } from "@/app/utils/helpers";
import TimeAgo from "./TimeAge";
import { FilterIcon, CloseIcon, LinkExternalIcon } from "../icons/Icon";
import { ButtonTertiary } from "../buttons/Button";
import type { Transaction } from "@/app/hooks/useData";

const debounce = <T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number,
) => {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
};

const throttle = <T extends (...args: unknown[]) => unknown>(
	func: T,
	limit: number,
) => {
	let inThrottle: boolean;
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
};

const TransactionsList: React.FC<{
	data: Transaction[];
	isLoading: boolean;
	isHistory?: boolean;
	loadMoreTransactions: (v: string) => Promise<boolean>;
}> = React.memo(
	({ data: transactions, isLoading, isHistory, loadMoreTransactions }) => {
		const [isLoadingMore, setIsLoadingMore] = useState(false);
		const filterOperationRef = useRef<string | null>(null);
		const [hasMore, setHasMore] = useState(true);
		const isLoadingRef = useRef(false);
		const listContainerRef = useRef<HTMLDivElement>(null);
		const [rpcEndpoint] = useAtom(rpcEndpointAtom);
		const [isFiltering, setIsFiltering] = useState(false);
		const [filterShow, setFilterShow] = useState(false);
		const [filterApply, setFilterApply] = useState(false);
		const [value, setValue] = useState<string>("");

		const handleFilter = useCallback(() => {
			setFilterShow((prev) => !prev);
		}, []);

		const handleApply = useCallback(async () => {
			if (!value.trim()) return;
			if (isLoadingRef.current) return; // 添加加载检查

			setIsFiltering(true);
			setFilterApply(true);
			setFilterShow(false);
			setHasMore(true);

			try {
				if (listContainerRef.current) {
					listContainerRef.current.scrollTop = 0;
				}
				const hasMoreData = await loadMoreTransactions(value);
				setHasMore(hasMoreData);
			} finally {
				setIsFiltering(false);
			}
		}, [value, loadMoreTransactions]);

		const handleClear = useCallback(async () => {
			if (isLoadingRef.current) return;

			filterOperationRef.current = ""; // 设置当前的过滤操作
			setIsFiltering(true);
			setFilterApply(false);
			setFilterShow(false);
			setValue("");
			setHasMore(true);

			try {
				if (listContainerRef.current) {
					listContainerRef.current.scrollTop = 0;
				}
				const hasMoreData = await loadMoreTransactions("");
				if (filterOperationRef.current === "") {
					// 检查是否仍是当前操作
					setHasMore(hasMoreData);
				}
			} finally {
				if (filterOperationRef.current === "") {
					// 检查是否仍是当前操作
					setIsFiltering(false);
				}
			}
		}, [loadMoreTransactions]);

		const handleSetFilterAddress = useCallback(
			async (address: string) => {
				if (!address.trim() || isLoadingRef.current) return;

				filterOperationRef.current = address; // 设置当前的过滤操作
				setIsFiltering(true);
				setValue(address);
				setFilterApply(true);
				setFilterShow(false);
				setHasMore(true);

				try {
					if (listContainerRef.current) {
						listContainerRef.current.scrollTop = 0;
					}
					const hasMoreData = await loadMoreTransactions(address);
					if (filterOperationRef.current === address) {
						// 检查是否仍是当前操作
						setHasMore(hasMoreData);
					}
				} finally {
					if (filterOperationRef.current === address) {
						// 检查是否仍是当前操作
						setIsFiltering(false);
					}
				}
			},
			[loadMoreTransactions],
		);

		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const newValue = e.target.value;
				if (newValue === "" || /^[a-zA-Z0-9]+$/.test(newValue)) {
					setValue(newValue);
				}
			},
			[],
		);

		useEffect(() => {
			const container = listContainerRef.current;
			if (!container) return;

			let lastLoadTime = 0;
			const LOAD_INTERVAL = 1000;

			const loadMore = async () => {
				if (
					isLoadingRef.current ||
					isLoading ||
					!hasMore ||
					isFiltering ||
					Date.now() - lastLoadTime < LOAD_INTERVAL
				)
					return;

				try {
					isLoadingRef.current = true;
					setIsLoadingMore(true);
					lastLoadTime = Date.now();

					const currentFilter = filterApply ? value : "";
					// 移除了 filterOperationRef.current === null 的检查
					const hasMoreData = await loadMoreTransactions(currentFilter);
					setHasMore(hasMoreData);
				} catch (error) {
					console.error("Failed to load more transactions:", error);
					setHasMore(false);
				} finally {
					isLoadingRef.current = false;
					setIsLoadingMore(false);
				}
			};

			const debouncedHandleScroll = debounce(() => {
				const { scrollHeight, scrollTop, clientHeight } = container;
				const scrollThreshold = Math.max(100, clientHeight * 0.2);
				if (scrollHeight - scrollTop - clientHeight <= scrollThreshold) {
					loadMore();
				}
			}, 150);

			// 移除了 filterOperationRef.current 的检查，让滚动监听器始终添加
			container.addEventListener("scroll", debouncedHandleScroll);

			return () => {
				container.removeEventListener("scroll", debouncedHandleScroll);
			};
		}, [
			loadMoreTransactions,
			value,
			isLoading,
			hasMore,
			filterApply,
			isFiltering,
		]);

		return (
			<>
				{isHistory ? (
					<div className='flex grow flex-col'>
						<div className='flex w-full py-5'>
							<span className='w-1/6 sm:w-1/6'>DATE</span>
							<span className='w-3/6 sm:w-2/6'>TYPE</span>
							<span className='w-2/6 sm:w-1/6'>ORE</span>
							<span className='hidden sm:flex sm:w-2/6'>ADDRESS</span>
							<span className='w-[30px]'>TXN</span>
						</div>
						<div
							ref={listContainerRef}
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
												href={getSolanaExplore(
													rpcEndpoint,
													transaction.signature,
												)}
												target='_blank'
											>
												<LinkExternalIcon className='w-5' color='#525252' />
											</Link>
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				) : (
					<div className='widget-base flex grow flex-col'>
						<div className='flex w-full border-b border-gray-800/40 p-5'>
							<span className='w-2/12 sm:w-1/12'>DATE</span>
							<span className='w-2/12 sm:w-2/12'>TYPE</span>
							<span className='w-2/12 sm:w-4/12'>ORE</span>
							<span className='flex w-4/12 items-center gap-1 sm:w-4/12'>
								<span>ADDRESS</span>
								<span className='cursor-pointer'>
									<FilterIcon onClick={handleFilter} />
								</span>
								{filterShow && (
									<div className='filter-base absolute z-10 w-96 bg-blue-700 p-5'>
										<div className='mb-2'>Filter Address</div>
										<div className='text-center'>
											<input
												className='input-base'
												value={value}
												onChange={handleChange}
											/>
											<div className='flex justify-center gap-2'>
												<ButtonTertiary
													className='mt-2 h-10 w-20 rounded-md text-xs'
													disabled={value === ""}
													onClick={handleApply}
												>
													Apply
												</ButtonTertiary>
												<ButtonTertiary
													className='mt-2 h-10 w-20 rounded-md text-xs'
													disabled={!filterApply}
													onClick={handleClear}
												>
													Clear
												</ButtonTertiary>
											</div>
										</div>
									</div>
								)}
							</span>
							<span className='hidden w-1/12 text-center sm:block'>TXN</span>
						</div>

						<div
							ref={listContainerRef}
							className='flex flex-1 overflow-auto px-5 pb-5'
						>
							{isFiltering ? (
								<div className='flex h-0 max-h-full min-h-[300px] w-full items-center justify-center text-center'>
									Loading...
								</div>
							) : (
								<div className='h-0 max-h-full min-h-[300px] w-full'>
									{transactions.length > 0 ? (
										transactions.map((transaction) => (
											<div
												key={transaction.id}
												className={clx(
													"flex border-b border-gray-800/40 py-4 text-xs",
													transaction.isNew ? "new-transaction" : "",
												)}
											>
												<span className='w-2/12 sm:w-1/12'>
													<TimeAgo timestamp={transaction.timestamp} />
												</span>
												<span className='w-2/12 sm:w-2/12'>
													{transaction.event_type}
												</span>
												<span className='w-2/12 sm:w-4/12'>
													{transaction.data?.purchaseQuantity
														? new anchor.BN(
																transaction.data.purchaseQuantity,
																16,
														  ).toString()
														: "0"}
												</span>
												<span className='flex w-4/12 items-center gap-1'>
													<span>
														{formatAddress(
															transaction.data?.player ?? "",
															12,
															-12,
														)}
													</span>
													<span className='cursor-pointer'>
														{transaction.data?.player === value &&
														filterApply ? (
															<CloseIcon onClick={handleClear} />
														) : (
															<FilterIcon
																onClick={() =>
																	handleSetFilterAddress(
																		transaction.data?.player ?? "",
																	)
																}
															/>
														)}
													</span>
												</span>
												<span className='hidden w-1/12 justify-center sm:flex'>
													<Link
														href={getSolanaExplore(
															rpcEndpoint,
															transaction.signature,
														)}
														target='_blank'
													>
														<LinkExternalIcon className='w-5' color='#525252' />
													</Link>
												</span>
											</div>
										))
									) : (
										<div className='absolute inset-y-0 m-auto h-6 w-full text-center'>
											No Data
										</div>
									)}
									{isLoadingMore && (
										<div className='py-4 text-center text-sm text-gray-500'>
											Loading more transactions...
										</div>
									)}
									{isLoading && transactions.length === 0 && (
										<div className='full'>Loading...</div>
									)}
								</div>
							)}
						</div>
					</div>
				)}
			</>
		);
	},
);

TransactionsList.displayName = "TransactionsList";

export default TransactionsList;
