import * as anchor from "@coral-xyz/anchor";
import { useAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
	gameAtom,
	// playerDataAtom,
	programAtom,
	providerAtom,
	// roundAtom,
	// playerRoundAtom,
	statePendingAtom,
	// voucherAccountAtom,
	// voucherBalanceAtom,
} from "@/app/state";
// import { DEFAULT_PUBLICKEY } from "@/app/config/token";
import { useNotification } from "../notifications";

// Type definition for instruction creator functions
type InstructionCreator = () => Promise<anchor.web3.TransactionInstruction[]>;

/**
 * Custom hook for managing Solana transactions
 * @returns An object containing transaction-related functions and state
 */
export default function useTransaction() {
	const { connection } = useConnection();
	const { publicKey, signTransaction } = useWallet();
	const notification = useNotification();

	const [game] = useAtom(gameAtom);
	// const [playerData] = useAtom(playerDataAtom);
	const [program] = useAtom(programAtom);
	const [provider] = useAtom(providerAtom);
	// const [round] = useAtom(roundAtom);
	// const [playerRound] = useAtom(playerRoundAtom);
	const [, setStatePending] = useAtom(statePendingAtom);
	// const [voucherAccount] = useAtom(voucherAccountAtom);
	// const [voucherBalance] = useAtom(voucherBalanceAtom);

	const [isTransactionInProgress, setIsTransactionInProgress] = useState<
		boolean
	>(false);

	/**
	 * Checks if the required state is available for transactions
	 * @returns {boolean} True if all required state is present, false otherwise
	 */
	const checkRequiredState = useCallback(() => {
		if (!publicKey || !program || !provider) {
			notification.error(
				"Error",
				"Missing required state or wallet not connected",
			);
			return false;
		}
		return true;
	}, [publicKey, program, provider, notification]);

	/**
	 * Creates instructions for CollectReferrerRewards
	 * @returns {Promise<anchor.web3.TransactionInstruction[]>} Array of transaction instructions
	 */
	const createCollectReferrerRewardsInstructions = useCallback<
		() => Promise<anchor.web3.TransactionInstruction[]>
	>(async () => {
		if (!program || !checkRequiredState()) return [];

		return [
			await program.methods
				.collectReferrerRewards()
				.accounts({})
				.instruction(),
		];
	}, [program, checkRequiredState]);

	/**
	 * Creates instructions for deposit
	 * @returns {Promise<anchor.web3.TransactionInstruction[]>} Array of transaction instructions
	 */
	const createDepositInstructions = useCallback<
		(amount: string) => Promise<anchor.web3.TransactionInstruction[]>
	>(
		async (amount: string) => {
			if (!program || !checkRequiredState()) return [];

			return [
				await program.methods
					.deposit(new anchor.BN(amount))
					.accounts({})
					.instruction(),
			];
		},
		[program, checkRequiredState],
	);

	/**
	 * Creates instructions for exiting
	 */
	const createExitInstructions = useCallback<InstructionCreator>(async () => {
		if (!program || !checkRequiredState()) return [];
		return [
			await program.methods
				.exit()
				.accounts({})
				.instruction(),
		];
	}, [program, checkRequiredState]);

	// /**
	//  * Creates instructions for purchasing
	//  * @param {string} value - The amount to purchase
	//  * @returns {Promise<anchor.web3.TransactionInstruction[]>} Array of transaction instructions
	//  */
	// const createPurchaseInstructions = useCallback<
	// 	(value: string) => Promise<anchor.web3.TransactionInstruction[]>
	// >(
	// 	async (value: string) => {
	// 		if (!program || !checkRequiredState() || !game) return [];

	// 		const instructions: anchor.web3.TransactionInstruction[] = [];

	// 		// If player hasn't exited and is not in the current round, settle the previous round first
	// 		if (
	// 			playerData &&
	// 			playerData.hasExited === false &&
	// 			playerData.currentRound.toString() !== game.currentRound.toString()
	// 		) {
	// 			const settleInstruction = await createSettlePreviousRoundInstructions();
	// 			instructions.push(settleInstruction[0]);
	// 		}

	// 		// Check if the purchase value is greater than or equal to 100
	// 		// This condition is likely used to determine if special rewards or bonuses should be applied
	// 		// TODO: Implement logic for special rewards or bonuses for purchases >= 100
	// 		if (new anchor.BN(value).gte(new anchor.BN(100))) {
	// 			// Add logic here for purchases >= 100
	// 		}

	// 		instructions.push(
	// 			await program.methods
	// 				.purchase(new anchor.BN(value))
	// 				.accounts({randomnessAccountData: })
	// 				.instruction(),
	// 		);

	// 		return instructions;
	// 	},
	// 	[program, checkRequiredState, playerData, game],
	// );

	/**
	 * Creates instructions for referrer
	 * @returns {Promise<anchor.web3.TransactionInstruction[]>} Array of transaction instructions
	 */
	const createReferrerInstructions = useCallback<
		(
			publicKey: anchor.web3.PublicKey,
		) => Promise<anchor.web3.TransactionInstruction[]>
	>(
		async (publicKey: anchor.web3.PublicKey) => {
			if (!program || !checkRequiredState()) return [];

			return [
				await program.methods
					.setReferrer(publicKey)
					.accounts({})
					.instruction(),
			];
		},
		[program, checkRequiredState],
	);

	/**
	 * Creates instructions for reinvesting
	 * @returns {Promise<anchor.web3.TransactionInstruction[]>} Array of transaction instructions
	 */
	const createReinvestInstructions = useCallback<
		InstructionCreator
	>(async () => {
		if (!program || !checkRequiredState()) return [];

		return [
			await program.methods
				.reinvest()
				.accounts({})
				.instruction(),
		];
	}, [program, checkRequiredState]);

	/**
	 * Creates instructions for requestEarlyUnlock
	 * @returns {Promise<anchor.web3.TransactionInstruction[]>} Array of transaction instructions
	 */
	const createRequestEarlyUnlockInstructions = useCallback<
		(orderNumber: number) => Promise<anchor.web3.TransactionInstruction[]>
	>(
		async (orderNumber: number) => {
			if (!program || !checkRequiredState()) return [];

			return [
				await program.methods
					.requestEarlyUnlock(orderNumber)
					.accounts({})
					.instruction(),
			];
		},
		[program, checkRequiredState],
	);

	/**
	 * Creates instructions for setting auto-reinvest
	 * @param {boolean} isOn - Whether to turn auto-reinvest on or off
	 * @returns {Promise<anchor.web3.TransactionInstruction[]>} Array of transaction instructions
	 */
	const createSetAutoReinvestInstructions = useCallback<
		(isOn: boolean) => Promise<anchor.web3.TransactionInstruction[]>
	>(
		async (isOn: boolean) => {
			if (!program || !checkRequiredState()) return [];
			return [
				isOn
					? await program.methods
							.setAutoReinvest()
							.accounts({})
							.instruction()
					: await program.methods
							.cancelAutoReinvest()
							.accounts({})
							.instruction(),
			];
		},
		[program, checkRequiredState],
	);

	/**
	 * Creates instructions for settling the previous round
	 */
	const createSettlePreviousRoundInstructions = useCallback<
		InstructionCreator
	>(async () => {
		if (!program || !game || !checkRequiredState()) return [];
		return [
			await program.methods
				.settlePreviousRound()
				.accounts({})
				.instruction(),
		];
	}, [program, game, checkRequiredState]);

	/**
	 * Creates instructions for withdraw
	 * @returns {Promise<anchor.web3.TransactionInstruction[]>} Array of transaction instructions
	 */
	const createWithdrawInstructions = useCallback<
		(orderNumber: number) => Promise<anchor.web3.TransactionInstruction[]>
	>(
		async (orderNumber: number) => {
			if (!program || !checkRequiredState()) return [];

			return [
				await program.methods
					.withdraw(orderNumber)
					.accounts({})
					.instruction(),
			];
		},
		[program, checkRequiredState],
	);

	/**
	 * Executes a transaction with the given instructions
	 * @param {InstructionCreator} instructionsMethod - Function that creates the transaction instructions
	 * @param {string} messageType - Type of message for notifications
	 * @returns {Promise<any>} The result of the transaction
	 */
	const executeTransaction = useCallback(
		async (instructionsMethod: InstructionCreator, messageType: string) => {
			if (!provider || !checkRequiredState() || !game || !signTransaction) {
				notification.error(
					`${messageType} Error!`,
					"Invalid state or wallet not connected",
				);
				return;
			}

			setIsTransactionInProgress(true);
			setStatePending(true);

			try {
				// Create and send the transaction
				const instructions = await instructionsMethod();
				const {
					blockhash,
					lastValidBlockHeight,
				} = await connection.getLatestBlockhash("finalized");

				const tx = new anchor.web3.Transaction().add(...instructions);
				tx.recentBlockhash = blockhash;
				tx.feePayer = provider.wallet.publicKey;

				const signedTransaction = await signTransaction(tx);
				const txid = await connection.sendRawTransaction(
					signedTransaction.serialize(),
					{
						skipPreflight: false,
						preflightCommitment: "confirmed",
					},
				);

				// Confirm the transaction
				const confirmation = await connection.confirmTransaction({
					signature: txid,
					blockhash,
					lastValidBlockHeight,
				});

				if (confirmation.value.err) {
					throw new Error(`Transaction failed: ${confirmation.value.err}`);
				}

				// Get the parsed transaction result
				const transactionResult = await connection.getParsedTransaction(txid, {
					commitment: "confirmed",
				});

				if (transactionResult?.meta && !transactionResult.meta.err) {
					console.log("Transaction confirmed:", transactionResult);
					notification.success(`${messageType} Success!`);
					return transactionResult;
				} else {
					throw new Error(
						`Transaction error: ${JSON.stringify(transactionResult)}`,
					);
				}
			} catch (err) {
				if (err instanceof Error) {
					console.error("Transaction error:", err);
					notification.error(`${messageType} Error!`, err.message);
				} else {
					console.error("Unknown transaction error");
					notification.error(
						`${messageType} Error!`,
						"An unknown error occurred",
					);
				}
			} finally {
				setIsTransactionInProgress(false);
				setStatePending(false);
			}
		},
		[
			connection,
			provider,
			signTransaction,
			checkRequiredState,
			game,
			notification,
		],
	);

	// Memoize the returned object to prevent unnecessary re-renders
	return useMemo(
		() => ({
			createCollectReferrerRewardsInstructions,
			createDepositInstructions,
			createExitInstructions,
			// createPurchaseInstructions,
			createReferrerInstructions,
			createReinvestInstructions,
			createRequestEarlyUnlockInstructions,
			createSetAutoReinvestInstructions,
			createSettlePreviousRoundInstructions,
			createWithdrawInstructions,
			executeTransaction,
			isTransactionInProgress,
		}),
		[
			createCollectReferrerRewardsInstructions,
			createDepositInstructions,
			createExitInstructions,
			// createPurchaseInstructions,
			createReferrerInstructions,
			createReinvestInstructions,
			createRequestEarlyUnlockInstructions,
			createSetAutoReinvestInstructions,
			createSettlePreviousRoundInstructions,
			createWithdrawInstructions,
			executeTransaction,
			isTransactionInProgress,
		],
	);
}
