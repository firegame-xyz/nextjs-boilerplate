"use client";

// import * as anchor from "@coral-xyz/anchor";
import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ButtonPrimary, ButtonTertiary } from "@/app/components/buttons/Button";
import { useAtom } from "jotai";
import {
	playerDataAtom,
	registeredAtom,
	balanceAtom,
	programAtom,
	Order,
} from "@/app/state";
import { clx, formatAmount, formatTokenAmount } from "@/app/utils/helpers";
import useTransaction from "../hooks/useTransaction";
import { findOrderPDA } from "../config/pda";

interface Orders extends Order {
	orderNumber: number;
}

export default function DepositPage() {
	const {
		executeTransaction,
		createRequestEarlyUnlockInstructions,
		createWithdrawInstructions,
		createDepositInstructions,
		isTransactionInProgress,
	} = useTransaction();
	const [amount, setAmount] = useState("");
	const { publicKey } = useWallet();
	const [program] = useAtom(programAtom);
	const [playerData] = useAtom(playerDataAtom);
	const [registered] = useAtom(registeredAtom);
	const [balance] = useAtom(balanceAtom);
	const [orderList, setOrderList] = useState<Orders[]>([]);

	const handleUnlock = useCallback(
		async (order: Orders) => {
			try {
				await executeTransaction(
					() => createRequestEarlyUnlockInstructions(order.orderNumber),
					"Early Unlock",
				);
			} catch (err) {
				console.error("Early Unlock error:", err);
			}
		},
		[executeTransaction, createRequestEarlyUnlockInstructions, orderList],
	);

	const handleWithdraw = useCallback(
		async (order: Orders) => {
			try {
				await executeTransaction(
					() => createWithdrawInstructions(order.orderNumber),
					"Withdraw",
				);
			} catch (err) {
				console.error("Withdraw error:", err);
			}
		},
		[executeTransaction, createWithdrawInstructions, orderList],
	);

	const handleDeposit = useCallback(async () => {
		try {
			await executeTransaction(
				() => createDepositInstructions(amount),
				"Deposit",
			);
			setAmount("");
		} catch (err) {
			console.error("Deposit error:", err);
		}
	}, [executeTransaction, createDepositInstructions, amount]);

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "" || /^\d*\.?\d*$/.test(value)) {
			setAmount(value);
		}
	};

	useEffect(() => {
		const fetchOrders = async () => {
			if (!playerData?.orderNumberList || !program) {
				setOrderList([]);
				return;
			}

			const orders = await Promise.all(
				playerData.orderNumberList.map(async (item) => {
					try {
						const orderPDA = findOrderPDA(item, program.programId);
						const order = await program.account.order.fetch(orderPDA);
						return {
							...order,
							orderNumber: item,
						} as Orders;
					} catch (error) {
						console.error("Error fetching order:", error);
						return null;
					}
				}),
			);
			setOrderList(orders.filter((order): order is Orders => order !== null));
		};

		fetchOrders();
	}, [program, playerData?.orderNumberList]);

	return (
		<div className='flex flex-col sm:flex-row gap-4'>
			{registered && publicKey ? (
				<div className='widget-base w-full sm:w-[280px] h-64 overflow-hidden'>
					<div className='mb-4 banner-base p-4'>
						<p className='text-sm mb-1'>Your Balance</p>
						<p className='text-base'>{`${formatTokenAmount(
							balance?.amount || 0,
						)} FGC`}</p>
					</div>

					<div className='px-4'>
						<div className='mb-3'>
							<label
								htmlFor='amount'
								className='block text-sm font-medium mb-3'
							>
								Amount to Deposit
							</label>
							<input
								id='amount'
								type='text'
								value={amount}
								onChange={handleAmountChange}
								className='input-base border-none bg-gray-900 w-full text-sm placeholder-gray-700 rounded-lg'
								placeholder='Enter amount (in millions)'
							/>
						</div>

						<ButtonPrimary
							onClick={handleDeposit}
							disabled={
								!amount ||
								parseFloat(amount) <= 0 ||
								parseFloat(amount) % 1000000 !== 0 ||
								parseFloat(amount) >
									Number(balance?.amount?.toString() || "0") ||
								isTransactionInProgress
							}
							className='w-full text-sm rounded-lg'
						>
							Deposit
						</ButtonPrimary>
					</div>
				</div>
			) : (
				<div className='text-center py-6 w-full'>
					<p className='text-xs'>
						Please connect your wallet and register to make a deposit.
					</p>
				</div>
			)}
			{registered && publicKey && (
				<div className='widget-base p-4 sm:flex-1 min-h-96'>
					<h2 className='text-sm font-semibold mb-3'>Your Locked Deposits</h2>
					<div className='overflow-x-auto border-collapse border border-gray-700/50 rounded-lg'>
						<table className='w-full table-auto border-collapse'>
							<thead>
								<tr className='text-left text-xs border-b border-gray-700 bg-blue-600/45'>
									<th className='px-4 py-3 font-medium border-r border-gray-700/25'>
										Amount (FGC)
									</th>
									<th className='px-4 py-3 font-medium border-r border-gray-700/25'>
										Rewards
									</th>
									<th className='px-4 py-3 font-medium border-r border-gray-700/25'>
										APR
									</th>
									<th className='px-4 py-3 font-medium border-r border-gray-700/25'>
										Unlock Date
									</th>
									<th className='px-4 py-3 font-medium border-r border-gray-700/25'>
										Status
									</th>
									<th className='px-4 py-3 font-medium'></th>
								</tr>
							</thead>
							<tbody>
								{Array.isArray(orderList) && orderList.length > 0 ? (
									orderList.map((deposit, index) => (
										<tr
											key={index}
											className={clx(
												"border-b border-gray-700/50 hover:bg-gray-800/50 transition-colors text-base-white",
												index === orderList.length - 1 && "border-b-0",
											)}
										>
											<td className='px-4 py-3 text-xs border-r border-gray-700/25'>
												{formatTokenAmount(formatAmount(deposit.depositAmount))}
											</td>
											<td className='px-4 py-3 text-xs border-r border-gray-700/25'>
												{formatTokenAmount(formatAmount(deposit.minedAmount))}
											</td>
											<td className='px-4 py-3 text-xs border-r border-gray-700/25'>
												{`${deposit.annualPercentageRate * 0.01}%`}
											</td>
											<td className='px-4 py-3 text-xs border-r border-gray-700/25'>
												{deposit.earlyUnlockRequested
													? new Date(
															deposit.earlyUnlockTimestamp.toNumber() * 1000,
													  ).toLocaleString()
													: new Date(
															deposit.withdrawableTimestamp.toNumber() * 1000,
													  ).toLocaleString()}
											</td>
											<td className='px-4 py-3 text-xs border-r border-gray-700/25'>
												{deposit.earlyUnlockRequested
													? "Early Unlock Requested"
													: "Locked"}
											</td>
											<td className='px-4 py-3 text-xs'>
												{deposit.earlyUnlockRequested ? (
													<ButtonTertiary
														className='w-24 h-6 rounded-lg'
														disabled={
															isTransactionInProgress ||
															deposit.earlyUnlockTimestamp.toNumber() >
																Math.floor(Date.now() / 1000)
														}
														onClick={() => handleWithdraw(deposit)}
													>
														Withdraw
													</ButtonTertiary>
												) : (
													<ButtonTertiary
														className='w-24 h-6 rounded-lg'
														disabled={isTransactionInProgress}
														onClick={() =>
															deposit.withdrawableTimestamp.toNumber() <
															Math.floor(Date.now() / 1000)
																? handleWithdraw(deposit)
																: handleUnlock(deposit)
														}
													>
														Unlock
													</ButtonTertiary>
												)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={6}
											className='px-4 py-4 text-center text-sm text-gray-500'
										>
											No deposits found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
