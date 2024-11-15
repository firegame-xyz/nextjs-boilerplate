import * as anchor from "@coral-xyz/anchor";
import { useAtom } from "jotai";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	useAnchorWallet,
	useConnection,
	useWallet,
} from "@solana/wallet-adapter-react";

import { ButtonPrimary } from "@/app/components/buttons/Button";
import useTransaction from "@/app/hooks/useTransaction";
import { useNotification } from "@/app/notifications";
import {
	balanceAtom,
	playerDataAtom,
	programAtom,
	providerAtom,
	randomnessAtom,
	roundAtom,
	rpcEndpointAtom,
	squadAtom,
	statePendingAtom,
	voucherBalanceAtom,
} from "@/app/state";
import {
	baseWinRate,
	// clx,
	discountRate,
	formatTokenAmount,
} from "@/app/utils/helpers";

import Reinvest from "./Reinvest";
import Switch from "./Switch";

// Custom hook for handling purchase calculations
const usePurchaseCalculations = (
	squadScore: anchor.BN,
	num: anchor.BN,
	voucherBalance: { amount: number } | null,
	balance: { amount: number } | null,
) => {
	const [error, setError] = useState(false);
	const [usedTokens, setUsedTokens] = useState([0, 0]);
	const [value, setValue] = useState("");

	// Calculate used tokens whenever relevant values change
	const calculateUsedTokens = useCallback(
		(inputValue: string) => {
			if (!inputValue) {
				setUsedTokens([0, 0]);
				return;
			}

			const requiredTotal = new anchor.BN(inputValue).mul(new anchor.BN(1000));
			const aToken = new anchor.BN(voucherBalance?.amount || 0);
			const bToken = new anchor.BN(balance?.amount || 0);

			const usedATokens = anchor.BN.min(aToken, requiredTotal);
			let usedBTokens = new anchor.BN(0);

			if (usedATokens.lt(requiredTotal)) {
				usedBTokens = requiredTotal.sub(usedATokens);
				if (usedBTokens.gt(bToken)) {
					usedBTokens = bToken;
				}
			}

			setUsedTokens([usedATokens.toNumber(), usedBTokens.toNumber()]);
		},
		[balance, voucherBalance],
	);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;

			if (newValue === "") {
				setError(false);
				setValue("");
				calculateUsedTokens("");
				return;
			}

			if (/^[1-9]\d*$/.test(newValue)) {
				const _value = new anchor.BN(newValue).mul(num);
				const _balanceVoucher = new anchor.BN(voucherBalance?.amount || 0);
				const _balance = new anchor.BN(balance?.amount || 0);
				const total = _balanceVoucher.add(_balance);
				const score = discountRate(squadScore).discount * 0.01;
				const scoredValue = _value.muln(score);

				setError(scoredValue.gt(total));
				setValue(newValue);
				calculateUsedTokens(newValue);
			}
		},
		[balance, calculateUsedTokens, num, squadScore, voucherBalance],
	);

	return { error, handleChange, setValue, usedTokens, value };
};

interface RevealKey {
	pubkey: string;
	isSigner: boolean;
	isWritable: boolean;
}

const PurchaseComponent = () => {
	// Atoms
	const [rpcEndpoint] = useAtom(rpcEndpointAtom);
	const [balance] = useAtom(balanceAtom);
	const [playerData] = useAtom(playerDataAtom);
	const [program] = useAtom(programAtom);
	const [provider] = useAtom(providerAtom);
	const [randomness, setRandomness] = useAtom(randomnessAtom);
	const [round] = useAtom(roundAtom);
	const [squad] = useAtom(squadAtom);
	const [, setStatePending] = useAtom(statePendingAtom);
	const [voucherBalance] = useAtom(voucherBalanceAtom);

	// Hooks
	const { connection } = useConnection();
	const notification = useNotification();
	const wallet = useAnchorWallet();
	const { publicKey, signTransaction } = useWallet();
	const { createSetAutoReinvestInstructions, executeTransaction } =
		useTransaction();

	// State
	const [isOn, setIsOn] = useState(false);
	const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);

	// Memoized values
	const num = useMemo(() => new anchor.BN(1000), []);
	const squadScore = useMemo(() => new anchor.BN(0), [squad]);

	const { error, handleChange, setValue, usedTokens, value } =
		usePurchaseCalculations(
			squadScore,
			num,
			voucherBalance ? { amount: voucherBalance.amount.toNumber() } : null,
			balance ? { amount: balance.amount.toNumber() } : null,
		);

	const discountedPrice = useMemo(() => {
		return formatTokenAmount(
			(num.toNumber() * discountRate(squadScore).discount) / 100,
		);
	}, [num, squadScore]);

	const specialRewardsProbability = useMemo(() => {
		return `${(baseWinRate(Number(value)) / 100).toFixed(2)}%`;
	}, [value]);

	const isShowBuy = useMemo(() => {
		if (!value || isNaN(Number(value))) {
			return false;
		}
		// Convert price to integer considering decimals (e.g., 1.5 -> 1500000 for 6 decimals)
		const priceInteger = Math.floor(
			Number(num) * Math.pow(10, balance?.decimals ?? 6),
		);
		const res = new anchor.BN(value).mul(new anchor.BN(priceInteger));

		return res.gt(new anchor.BN(balance?.valueAmount ?? 0));
	}, [balance, value, num]);

	// Callbacks
	const handleSetAutoReinvest = useCallback(
		async (isOn: boolean) => {
			try {
				setStatePending(true);
				setIsTransactionInProgress(true);
				await executeTransaction(
					() => createSetAutoReinvestInstructions(isOn),
					"AutoReinvest",
				);
			} catch (err) {
				console.error("AutoReinvest error:", err);
			} finally {
				setStatePending(false);
				setIsTransactionInProgress(false);
			}
		},
		[createSetAutoReinvestInstructions, executeTransaction],
	);

	const fetchReveal = useCallback(
		async (randomnessPubkey: string) => {
			if (
				!provider ||
				!wallet ||
				!signTransaction ||
				!connection ||
				!program ||
				!rpcEndpoint
			) {
				throw new Error("Please connect your wallet to continue");
			}
			try {
				setRandomness((prev) => ({
					...prev,
					revealing: {
						...prev.revealing,
						error: null,
						isProcessing: true,
						response: null,
						txSignature: undefined,
					},
				}));

				const revealResponse = await fetch("/api/reveal", {
					body: JSON.stringify({
						randomnessPubkey: randomnessPubkey,
						wallet,
						rpc: encodeURIComponent(rpcEndpoint),
					}),
					headers: { "Content-Type": "application/json" },
					method: "POST",
				});

				const revealData = await revealResponse.json();
				console.log("revealData", revealData);

				const { revealIx } = revealData;

				setRandomness((prev) => ({
					...prev,
					revealing: {
						...prev.revealing,
						response: revealData,
					},
				}));

				const revealIxInstruction = new anchor.web3.TransactionInstruction({
					data: Buffer.from(revealIx.data),
					keys: revealIx.keys.map((key: RevealKey) => ({
						...key,
						pubkey: new anchor.web3.PublicKey(key.pubkey),
					})),
					programId: new anchor.web3.PublicKey(revealIx.programId),
				});

				const revealDrawLotteryResultIx = await program.methods
					.revealDrawLotteryResult()
					.accounts({})
					.instruction();

				const { blockhash, lastValidBlockHeight } =
					await connection.getLatestBlockhash("finalized");

				const tx = new anchor.web3.Transaction().add(revealIxInstruction);
				tx.add(revealDrawLotteryResultIx);
				tx.feePayer = provider.wallet.publicKey;
				tx.recentBlockhash = blockhash;

				const signedTransaction = await signTransaction(tx);
				const txid = await connection.sendRawTransaction(
					signedTransaction.serialize(),
					{
						preflightCommitment: "confirmed",
						skipPreflight: false,
					},
				);

				const confirmation = await connection.confirmTransaction({
					blockhash,
					lastValidBlockHeight,
					signature: txid,
				});

				if (confirmation.value.err) {
					throw new Error(`Transaction failed: ${confirmation.value.err}`);
				}

				const transactionResult = await connection.getParsedTransaction(txid, {
					commitment: "confirmed",
				});

				if (transactionResult?.meta && !transactionResult.meta.err) {
					notification.success(`Reveal Create Success!`);
					setRandomness((prev) => ({
						...prev,
						revealing: {
							...prev.revealing,
							isProcessing: false,
							txSignature: txid,
						},
					}));
					setValue("");
				} else {
					throw new Error(
						`Transaction error: ${JSON.stringify(transactionResult)}`,
					);
				}
			} catch (err) {
				if (err instanceof Error) {
					console.error("Transaction error:", err);
					notification.error(`Transaction Error!`, err.message);
					setRandomness((prev) => ({
						...prev,
						revealing: {
							...prev.revealing,
							error: err.message,
							isProcessing: false,
						},
					}));
				} else {
					console.error("Unknown transaction error");
					notification.error(`Transaction Error!`, "An unknown error occurred");
				}
			} finally {
				setIsTransactionInProgress(false);
				setStatePending(false);
			}
		},
		[
			connection,
			program,
			notification,
			provider,
			wallet,
			rpcEndpoint,
			setValue,
			signTransaction,
			setRandomness,
			setIsTransactionInProgress,
			setStatePending,
		],
	);

	const fetchCommit = useCallback(
		async (randomnessPubkey: string) => {
			if (
				!provider ||
				!wallet ||
				!signTransaction ||
				!program ||
				!connection ||
				!rpcEndpoint
			) {
				throw new Error("Missing wallet, provider, program or connection");
			}

			try {
				setRandomness((prev) => ({
					...prev,
					committing: {
						...prev.committing,
						error: null,
						isProcessing: true,
						response: null,
						txSignature: undefined,
					},
				}));

				const commitResponse = await fetch("/api/commit", {
					body: JSON.stringify({
						randomnessPubkey: randomnessPubkey,
						wallet,
						rpc: encodeURIComponent(rpcEndpoint),
					}),
					headers: { "Content-Type": "application/json" },
					method: "POST",
				});

				const commitData = await commitResponse.json();
				console.log("commitData", commitData);

				const { commitIx } = commitData;

				setRandomness((prev) => ({
					...prev,
					committing: {
						...prev.committing,
						response: commitData,
					},
				}));

				const commitIxInstruction = new anchor.web3.TransactionInstruction({
					data: Buffer.from(commitIx.data),
					keys: commitIx.keys.map((key: RevealKey) => ({
						...key,
						pubkey: new anchor.web3.PublicKey(key.pubkey),
					})),
					programId: new anchor.web3.PublicKey(commitIx.programId),
				});

				const purchaseIx = await program.methods
					.purchase(new anchor.BN(value))
					.accounts({ randomnessAccountData: randomnessPubkey })
					.instruction();

				const { blockhash, lastValidBlockHeight } =
					await connection.getLatestBlockhash("finalized");

				const tx = new anchor.web3.Transaction().add(commitIxInstruction);
				tx.add(purchaseIx);
				tx.feePayer = provider.wallet.publicKey;
				tx.recentBlockhash = blockhash;

				const signedTransaction = await signTransaction(tx);
				const txid = await connection.sendRawTransaction(
					signedTransaction.serialize(),
					{
						preflightCommitment: "confirmed",
						skipPreflight: false,
					},
				);

				const confirmation = await connection.confirmTransaction({
					blockhash,
					lastValidBlockHeight,
					signature: txid,
				});

				if (confirmation.value.err) {
					throw new Error(`Transaction failed: ${confirmation.value.err}`);
				}

				const transactionResult = await connection.getParsedTransaction(txid, {
					commitment: "confirmed",
				});

				if (transactionResult?.meta && !transactionResult.meta.err) {
					notification.success(`Commit Create Success!`);
					setRandomness((prev) => ({
						...prev,
						committing: {
							...prev.committing,
							isProcessing: false,
							txSignature: txid,
						},
					}));
					await fetchReveal(randomnessPubkey);
				} else {
					throw new Error(
						`Transaction error: ${JSON.stringify(transactionResult)}`,
					);
				}
			} catch (err) {
				if (err instanceof Error) {
					console.error("Transaction error:", err);
					notification.error(`Transaction Error!`, err.message);
					setRandomness((prev) => ({
						...prev,
						committing: {
							...prev.committing,
							error: err.message,
							isProcessing: false,
						},
					}));
				} else {
					console.error("Unknown transaction error");
					notification.error(`Transaction Error!`, "An unknown error occurred");
				}
			} finally {
				setIsTransactionInProgress(false);
				setStatePending(false);
			}
		},
		[
			connection,
			fetchReveal,
			notification,
			provider,
			rpcEndpoint,
			signTransaction,
			wallet,
			value,
		],
	);

	const fetchRandomness = useCallback(async () => {
		if (
			!provider ||
			!publicKey ||
			!wallet ||
			!signTransaction ||
			!connection ||
			!rpcEndpoint
		) {
			throw new Error("Please connect your wallet to continue");
		}
		if (randomness.revealing.txSignature) {
			setRandomness((prev) => ({
				...prev,
				creating: {
					error: null,
					isProcessing: false,
					response: null,
					txSignature: undefined,
				},
				committing: {
					error: null,
					isProcessing: false,
					response: null,
					txSignature: undefined,
				},
				revealing: {
					error: null,
					isProcessing: false,
					response: null,
					txSignature: undefined,
				},
			}));
		}
		if (randomness.creating?.error) {
			setRandomness((prev) => ({
				...prev,
				creating: {
					error: null,
					isProcessing: false,
					response: null,
					txSignature: undefined,
				},
				committing: {
					error: null,
					isProcessing: false,
					response: null,
					txSignature: undefined,
				},
				revealing: {
					error: null,
					isProcessing: false,
					response: null,
					txSignature: undefined,
				},
			}));
		} else {
			if (
				randomness.creating?.response?.randomnessPubkey &&
				!randomness.committing?.txSignature
			) {
				await fetchCommit(randomness.creating.response.randomnessPubkey);
				return;
			}

			// Check if we have a commit but reveal failed
			if (
				randomness.committing?.txSignature &&
				!randomness.revealing?.txSignature &&
				randomness.creating?.response?.randomnessPubkey
			) {
				await fetchReveal(randomness.creating.response.randomnessPubkey);
				return;
			}
		}

		setRandomness((prev) => ({
			...prev,
			creating: {
				...prev.creating,
				error: null,
				isProcessing: true,
				response: null,
				txSignature: undefined,
			},
		}));

		const response = await fetch("/api/randomness", {
			body: JSON.stringify({
				publicKey: publicKey.toBase58(),
				wallet,
				rpc: encodeURIComponent(rpcEndpoint),
			}),
			headers: { "Content-Type": "application/json" },
			method: "POST",
		});

		if (!response.ok) {
			throw new Error("Failed to get randomness");
		}

		const randomnessData = await response.json();
		const { randomnessPubkey } = randomnessData;

		setRandomness((prev) => ({
			...prev,
			creating: {
				...prev.creating,
				response: randomnessData,
			},
		}));

		const { blockhash, lastValidBlockHeight } =
			await connection.getLatestBlockhash("finalized");

		const tx = anchor.web3.Transaction.from(
			Buffer.from(randomnessData.tx, "base64"),
		);

		const signedTransaction = await signTransaction(tx);
		const txid = await connection.sendRawTransaction(
			signedTransaction.serialize(),
			{
				preflightCommitment: "confirmed",
				skipPreflight: false,
			},
		);

		const confirmation = await connection.confirmTransaction({
			blockhash,
			lastValidBlockHeight,
			signature: txid,
		});

		if (confirmation.value.err) {
			throw new Error(`Transaction failed: ${confirmation.value.err}`);
		}

		const transactionResult = await connection.getParsedTransaction(txid, {
			commitment: "confirmed",
		});

		if (transactionResult?.meta && !transactionResult.meta.err) {
			notification.success(`Randomness Account Create Success!`);
			setRandomness((prev) => ({
				...prev,
				creating: {
					...prev.creating,
					isProcessing: false,
					txSignature: txid,
				},
			}));
			await fetchCommit(randomnessPubkey);
		} else {
			throw new Error(
				`Transaction error: ${JSON.stringify(transactionResult)}`,
			);
		}
	}, [
		connection,
		notification,
		provider,
		publicKey,
		rpcEndpoint,
		signTransaction,
		wallet,
		setRandomness,
		fetchCommit,
	]);

	const handlePurchase = useCallback(async () => {
		if (!provider || !program || !signTransaction) {
			throw new Error("Missing provider or program");
		}

		const id = Math.floor(Math.random() * 10000000);

		try {
			notification.pending(
				id,
				`Waiting For Wallet To Sign Transaction`,
				`Pending wallet to sign`,
			);
			setStatePending(true);
			setIsTransactionInProgress(true);

			if (new anchor.BN(value).gte(new anchor.BN(100))) {
				await fetchRandomness();
			} else {
				const instructions: anchor.web3.TransactionInstruction[] = [];
				instructions.push(
					await program.methods
						.purchase(new anchor.BN(value))
						.accounts({ randomnessAccountData: anchor.web3.PublicKey.default })
						.instruction(),
				);
				const { blockhash, lastValidBlockHeight } =
					await connection.getLatestBlockhash("finalized");

				const tx = new anchor.web3.Transaction().add(...instructions);
				tx.feePayer = provider.wallet.publicKey;
				tx.recentBlockhash = blockhash;

				const signedTransaction = await signTransaction(tx);
				const txid = await connection.sendRawTransaction(
					signedTransaction.serialize(),
					{
						preflightCommitment: "confirmed",
						skipPreflight: false,
					},
				);

				const confirmation = await connection.confirmTransaction({
					blockhash,
					lastValidBlockHeight,
					signature: txid,
				});

				if (confirmation.value.err) {
					throw new Error(`Transaction failed: ${confirmation.value.err}`);
				}

				const transactionResult = await connection.getParsedTransaction(txid, {
					commitment: "confirmed",
				});

				if (transactionResult?.meta && !transactionResult.meta.err) {
					notification.success(`Purchase Success!`);
					setValue("");
				} else {
					throw new Error(
						`Transaction error: ${JSON.stringify(transactionResult)}`,
					);
				}
			}
		} catch (err) {
			if (err instanceof Error) {
				console.error("Transaction error:", err);
				notification.error(`Transaction Error!`, err.message);
				if (new anchor.BN(value).gte(new anchor.BN(100))) {
					setRandomness((prev) => ({
						...prev,
						creating: {
							...prev.creating,
							error: err.message,
							isProcessing: false,
						},
					}));
				}
			} else {
				console.error("Unknown transaction error");
				notification.error(`Transaction Error!`, "An unknown error occurred");
			}
		} finally {
			notification.remove(id);
			setIsTransactionInProgress(false);
			setStatePending(false);
		}
	}, [
		connection,
		fetchRandomness,
		notification,
		program,
		provider,
		setValue,
		signTransaction,
		value,
		setRandomness,
		setIsTransactionInProgress,
		setStatePending,
	]);

	const handleToggle = useCallback(() => {
		if (!playerData || isTransactionInProgress) return;
		handleSetAutoReinvest(!isOn);
	}, [handleSetAutoReinvest, isOn, isTransactionInProgress, playerData]);

	// Effects
	useEffect(() => {
		if (!playerData) return;
		setIsOn(playerData.autoReinvest);
	}, [playerData]);

	return (
		<div className='flex flex-col'>
			<div className='mb-4 flex items-center justify-between'>
				<div>
					<div className='buyBtn'>
						<span>BUY FGC</span>
						<svg width='13px' height='10px' viewBox='0 0 13 10'>
							<path d='M1,5 L11,5'></path>
							<polyline points='8 1 12 5 8 9'></polyline>
						</svg>
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<span className='text-xs'>Auto Reinvest</span>
					<Switch
						disabled={isTransactionInProgress || round?.isOver}
						handleToggle={handleToggle}
						isOn={isOn}
					/>
				</div>
			</div>
			<div className='m-auto w-full rounded-lg border border-gray-700 p-5'>
				<div className='flex items-center justify-between'>
					<input
						className='h-12 w-full bg-transparent text-lg text-gray-300 placeholder-gray-700'
						onChange={handleChange}
						placeholder='amount'
						value={value}
					/>
					<span className='flex items-center gap-2'>
						<div className='relative h-[32px] w-[32px]'>
							<Image
								alt='Ore icon'
								fill
								sizes='32px'
								src='/images/ore.png'
								style={{ objectFit: "contain" }}
							/>
						</div>
						{`ORE`}
					</span>
				</div>
			</div>
			<div className='p-2 text-xs'>
				{value && (
					<>
						<div className='flex justify-between'>
							<span>{`Price`}</span>
							<span className='flex gap-1'>
								<div className='relative h-[16px] w-[16px]'>
									<Image
										alt='Ore icon'
										fill
										sizes='16px'
										src='/images/ore.png'
										style={{ objectFit: "contain" }}
									/>
								</div>
								<span>{`=`}</span>
								<span>{discountedPrice}</span>
							</span>
						</div>
						<div className='flex justify-between'>
							<span>Cost</span>
							<span>{`${formatTokenAmount(
								usedTokens[0],
							)} FGV + ${formatTokenAmount(usedTokens[1])} FGC`}</span>
						</div>
					</>
				)}
				{value && (
					<div className='flex justify-between'>
						<span>Probability of Winning Special Rewards</span>
						<span>{specialRewardsProbability}</span>
					</div>
				)}
			</div>

			<div className='mt-8 flex justify-between'>
				<div className='flex flex-col relative'>
					{isShowBuy && (
						<div className='absolute w-full text-center -top-6 text-xs text-base-white'>
							Not Enough FGC.{" "}
							<a href='#' className='text-warning underline'>
								Get More
							</a>
						</div>
					)}
					<ButtonPrimary
						className='rounded-lg'
						disabled={
							isTransactionInProgress || !value || error || round?.isOver
						}
						onClick={handlePurchase}
					>
						Purchase and Construction
					</ButtonPrimary>
				</div>

				<Reinvest />
			</div>
		</div>
	);
};

export default PurchaseComponent;
