import * as anchor from "@coral-xyz/anchor";
import React, { useCallback, useMemo, useState } from "react";

import { useAtom } from "jotai";
import { rpcEndpointAtom } from "@/app/state";

import Link from "next/link";
import { clx, formatAddress, getSolanaExplore } from "@/app/utils/helpers";
import TimeAgo from "./TimeAge";
import { FilterIcon, CloseIcon, LinkExternalIcon } from "../icons/Icon";
import { ButtonTertiary } from "../buttons/Button";
import type { Transaction } from "@/app/hooks/useData";

const TransactionsList: React.FC<{ data: Transaction[] }> = React.memo(
	({ data }) => {
		const [rpcEndpoint] = useAtom(rpcEndpointAtom);
		const [filterShow, setFilterShow] = useState(false);
		const [filterApply, setFilterApply] = useState(false);
		const [value, setValue] = useState<string>("");

		const transactions = data;

		const handleFilter = useCallback(() => {
			setFilterShow((prev) => !prev);
		}, []);

		const handleApply = useCallback(() => {
			setFilterApply(true);
			setFilterShow(false);
		}, []);

		const handleClear = useCallback(() => {
			setFilterApply(false);
			setFilterShow(false);
			setValue("");
		}, []);

		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const newValue = e.target.value;
				if (newValue === "" || /^[a-zA-Z0-9]+$/.test(newValue)) {
					setValue(newValue);
				}
			},
			[],
		);

		const handleSetFilterAddress = useCallback((address: string) => {
			setValue(address);
			setFilterApply(true);
			setFilterShow(false);
		}, []);

		const filteredTransactions = useMemo(() => {
			return filterApply
				? transactions.filter((t) => t.data?.player === value)
				: transactions;
		}, [transactions, filterApply, value]);

		return (
			<div className='widget-base flex grow flex-col'>
				{/* Header */}
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

				{/* Transaction List */}
				<div className='flex flex-1 overflow-auto px-5 pb-5'>
					<div className='h-0 max-h-full min-h-[300px] w-full'>
						{filteredTransactions.length > 0 ? (
							filteredTransactions.map((transaction) => (
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
											{formatAddress(transaction.data?.player ?? "", 12, -12)}
										</span>
										<span className='cursor-pointer'>
											{transaction.data?.player === value && filterApply ? (
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
					</div>
				</div>
			</div>
		);
	},
);

TransactionsList.displayName = "TransactionsList";

export default TransactionsList;
