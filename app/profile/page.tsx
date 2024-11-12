"use client";

import * as anchor from "@coral-xyz/anchor";
import { useAtom } from "jotai";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useCallback, useEffect, useState } from "react";

import { ButtonPrimary, ButtonTertiary } from "../components/buttons/Button";
import CopyComponent from "../components/widgets/Copy";
import { SolanaAvatar } from "../components/widgets/SolanaAvatar";
import ConstructionWorkerSalariesBalance from "../components/widgets/ConstructionWorkerSalariesBalance";
import {
	clx,
	formatAddress,
	formatAmount,
	formatTokenAmount,
} from "@/app/utils/helpers";
import { roundAtom, gameAtom, playerDataAtom } from "@/app/state";
import useTransaction from "../hooks/useTransaction";

// import {
// 	getPurchaseRank,
// 	getSquadRank,
// 	SquadRank,
// 	PurchaseRank,
// } from "@/services/api/rankApi";
// import RankTop from "../components/widgets/RankTop";
// import SelectDropdown from "../components/widgets/SelectDropdown";
// import { TriangleIcon } from "../components/icons/Icon";
// import Image from "next/image";

export default function Page() {
	const {
		executeTransaction,
		createReferrerInstructions,
		createCollectReferrerRewardsInstructions,
		isTransactionInProgress,
	} = useTransaction();
	const [round] = useAtom(roundAtom);
	const [playerData] = useAtom(playerDataAtom);
	const { publicKey } = useWallet();
	const [referrer, setReferrer] = useState("");
	const [inputError, setInputError] = useState("");
	const [validateRes, setValidateRes] = useState(false);
	const [currentUrl, setCurrentUrl] = useState("");

	const validateReferrer = useCallback((input: string) => {
		if (!input) {
			setInputError("Referrer address cannot be empty");
			setValidateRes(false);
			return false;
		}
		try {
			new anchor.web3.PublicKey(input);
			setInputError("");
			setValidateRes(true);
			return true;
		} catch (error) {
			setInputError("Invalid Solana address");
			setValidateRes(false);
			return false;
		}
	}, []);

	const getCurrentUrl = useCallback(() => {
		if (typeof window !== "undefined") {
			const baseUrl = window.location.origin;
			const linkCode = publicKey?.toString() || "";
			return `${baseUrl}/?link_code=${linkCode}`;
		}
		return "";
	}, [publicKey]);

	const handleClaim = useCallback(async () => {
		try {
			await executeTransaction(
				() => createCollectReferrerRewardsInstructions(),
				"Claim Referrer Rewards",
			);
		} catch (err) {
			console.error("Claim Referrer Rewards error:", err);
		}
	}, [executeTransaction, createCollectReferrerRewardsInstructions]);

	const handleReferrer = useCallback(async () => {
		if (!validateReferrer(referrer)) {
			return;
		}
		try {
			await executeTransaction(
				() => createReferrerInstructions(new anchor.web3.PublicKey(referrer)),
				"Set Referrer",
			);
		} catch (err) {
			console.error("Set Referrer error:", err);
		}
	}, [
		executeTransaction,
		createReferrerInstructions,
		referrer,
		validateReferrer,
	]);

	const handleReferrerChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const input = event.target.value;
			setReferrer(input);
			validateReferrer(input);
		},
		[validateReferrer],
	);

	useEffect(() => {
		setCurrentUrl(getCurrentUrl());
	}, [getCurrentUrl]);

	return (
		<>
			<div className='widget-base mt-4 flex flex-col p-4 sm:flex-row sm:p-5'>
				<div className='w-full flex sm:flex-row flex-col'>
					<div className='flex flex-col gap-8 sm:flex-row'>
						<div className='flex flex-col items-center justify-center'>
							<SolanaAvatar
								className='h-20 w-20'
								address={publicKey?.toString()!}
							/>
						</div>
						<div className='flex flex-col gap-4'>
							<div className='flex flex-col gap-1'>
								<span className='text-base-white'>
									{formatAddress(publicKey?.toString()!, 12, -12)}
								</span>
							</div>

							<div className='flex gap-10'>
								<div className='flex flex-col'>
									<span>Exit Rewards Claimed</span>
									<div className='flex items-center gap-2 text-xs text-base-white'>
										{formatTokenAmount(
											formatAmount(playerData?.totalExitRewardsClaimed!),
										)}
									</div>
								</div>
								<div className='flex flex-col'>
									<span>Construction Worker Salaries</span>
									<span className='text-xs text-base-white'>
										<ConstructionWorkerSalariesBalance />
									</span>
								</div>
							</div>

							<div className='flex sm:gap-10 gap-4 sm:flex-row flex-col'>
								<div className='flex flex-col'>
									<span>My Referral Code</span>
									<div className='flex items-center gap-2 text-xs text-base-white'>
										{formatAddress(publicKey?.toString()!)}
										<CopyComponent
											address={publicKey?.toString()!}
											endText='Copied'
										/>
									</div>
								</div>
								<div className='flex flex-col'>
									<span>URL</span>
									<div className='flex items-center gap-2 text-xs text-base-white'>
										{formatAddress(currentUrl?.toString()!)}
										<CopyComponent address={currentUrl} endText='Copied' />
									</div>
								</div>
								<div className='flex flex-col'>
									<span>Referral Count</span>
									<span className='text-xs text-base-white'>
										{playerData?.referralCount.toString()}
									</span>
								</div>
								{playerData?.referrer.toString() !==
									"11111111111111111111111111111111" && (
									<div className='flex flex-col'>
										<span>Referral</span>
										<span className='text-xs text-base-white'>
											{formatAddress(playerData?.referrer.toString()!, 12, -12)}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
					<div className='mt-4 sm:mt-0 sm:flex-1'>
						<div className='ml-auto w-full overflow-hidden rounded-lg border border-warning sm:w-32'>
							<div className='bg-warning px-2 py-1 text-base-black text-center'>{`Referral Rewards`}</div>
							<div className='flex flex-col p-4'>
								<div className='text-center text-base-white'>
									{formatTokenAmount(
										formatAmount(
											playerData?.pendingReferrerRewards || new anchor.BN(0),
										),
										0,
									)}
								</div>
								<ButtonTertiary
									className='mt-2 rounded-lg'
									disabled={
										playerData?.pendingReferrerRewards.isZero() ||
										isTransactionInProgress
									}
									onClick={handleClaim}
								>
									Claim
								</ButtonTertiary>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='mt-6 flex items-center justify-between'>
				<div className='flex rounded-lg bg-gray-800'>
					<span
						className={clx(
							"cursor-pointer rounded-lg bg-base-black px-4 py-2 text-base-white",
						)}
					>
						{`Referral Code`}
					</span>
				</div>
			</div>
			<div className='widget-base mt-4 flex flex-col p-4 sm:flex-row sm:p-5'>
				<div className='flex w-full'>
					<input
						className='input-base'
						placeholder='Input referral code'
						onChange={handleReferrerChange}
					/>
					<ButtonPrimary
						className='border-l-0 border-gray-600'
						disabled={
							!validateRes ||
							publicKey?.toString() === referrer ||
							playerData?.referrer.toString() !==
								"11111111111111111111111111111111"
						}
						onClick={handleReferrer}
					>
						Submit
					</ButtonPrimary>
				</div>
			</div>
		</>
	);
}
