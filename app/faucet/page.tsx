"use client";

import * as anchor from "@coral-xyz/anchor";
import {
	createMintToInstruction,
	getAssociatedTokenAddressSync,
	createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { useNotification } from "@/app/notifications";

import walletJson from "../../wallets/token.json";
import { ButtonPrimary } from "../components/buttons/Button";
import { useAtom } from "jotai";
import { providerAtom, programAtom } from "@/app/state";

export default function Faucet() {
	const [provider] = useAtom(providerAtom);
	const [program] = useAtom(programAtom);
	const notification = useNotification();
	const { connection } = useConnection();
	const { publicKey } = useWallet();
	const [pending, setPending] = useState(false);
	const [isAirdrop, setIsAirdrop] = useState(false);
	const [num, setNum] = useState(1000000000);

	const fetchBalance = async () => {
		if (publicKey) {
			try {
				const lamports = await connection.getBalance(publicKey);
				const solBalance = lamports / 1_000_000_000; // Convert lamports to SOL

				// Check if balance is less than 0.01 SOL and perform action
				if (solBalance < 0.01) {
					handleAirdrop();
					// Execute your action here
					console.warn("Balance is less than 0.01 SOL");
					// Example: Show an alert, log a message, or trigger some other logic
				}
			} catch (error) {
				console.error("Failed to fetch balance:", error);
			}
		}
	};

	const handleMintToken = async () => {
		if (!publicKey || !provider) return;

		fetchBalance();

		const coinWallet = anchor.web3.Keypair.fromSecretKey(
			Uint8Array.from(walletJson),
		);
		// 6KMXwypa4PqUnzGCUK3cttXu35xoKj9eMCd5ALmserCo
		const coinMint = coinWallet.publicKey;
		// Generate new keypair for Mint Account
		const mintKeypair = coinWallet;
		// Address for Mint Account
		const mint = mintKeypair.publicKey;

		const decimals = 6;
		const mintAuthority = mint;

		const tokenAccount = await connection.getParsedTokenAccountsByOwner(
			publicKey,
			{
				mint: mint,
			},
		);

		const createToInstruction = createAssociatedTokenAccountInstruction(
			publicKey,
			getAssociatedTokenAddressSync(mint, publicKey),
			publicKey,
			mint,
		);

		const mintToInstruction = createMintToInstruction(
			mint,
			getAssociatedTokenAddressSync(mint, publicKey),
			mintAuthority,
			1_000_000_000_000,
		);

		let tx = new anchor.web3.Transaction();
		tokenAccount.value.length < 1 && tx.add(createToInstruction);
		tx.add(mintToInstruction);

		const { blockhash } = await connection.getLatestBlockhash("finalized");
		tx.recentBlockhash = blockhash;
		tx.feePayer = provider.wallet.publicKey;

		tx.sign(mintKeypair);

		setPending(true);

		try {
			const signedTransaction = await provider.wallet.signTransaction(tx);
			const txid = await connection.sendRawTransaction(
				signedTransaction.serialize(),
				{ skipPreflight: false, preflightCommitment: "confirmed" },
			);

			const latestBlockhash = await connection.getLatestBlockhash();
			const confirmation = await connection.confirmTransaction({
				signature: txid,
				blockhash: latestBlockhash.blockhash,
				lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
			});

			if (confirmation.value.err) {
				console.error("Transaction failed:", confirmation.value.err);
				notification.error("Buy Error!", <>{confirmation.value.err}</>);
			} else {
				const transactionResult = await connection.getParsedTransaction(txid, {
					commitment: "confirmed",
				});

				if (
					transactionResult &&
					transactionResult.meta &&
					!transactionResult.meta.err
				) {
					setNum(0);
					console.log("Transaction confirmed:", transactionResult);
					notification.success("Mint Success!");
				} else {
					console.error("Transaction error details:", transactionResult);
					notification.error("Mint Error!", <>{transactionResult}</>);
				}
			}

			setPending(false);
		} catch (err) {
			setPending(false);
			console.error("Transaction error:", err);
			notification.error("Mint Error!", <>{(err as Error).message}</>);
		}
	};

	const handleSwap = async () => {
		if (!publicKey || !program || !provider) return;

		const claimVouchers = await program.methods
			.collateralExchange(new anchor.BN(num))
			.accounts({})
			.instruction();
		let tx = new anchor.web3.Transaction();
		tx.add(claimVouchers);
		const { blockhash } = await connection.getLatestBlockhash("finalized");
		tx.recentBlockhash = blockhash;
		tx.feePayer = provider.wallet.publicKey;
		setPending(true);
		try {
			const signedTransaction = await provider.wallet.signTransaction(tx);
			const txid = await connection.sendRawTransaction(
				signedTransaction.serialize(),
				{ skipPreflight: false, preflightCommitment: "confirmed" },
			);
			const latestBlockhash = await connection.getLatestBlockhash();
			const confirmation = await connection.confirmTransaction({
				signature: txid,
				blockhash: latestBlockhash.blockhash,
				lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
			});
			if (confirmation.value.err) {
				console.error("Transaction failed:", confirmation.value.err);
				notification.error("Swap Error!", <>{confirmation.value.err}</>);
			} else {
				const transactionResult = await connection.getParsedTransaction(txid, {
					commitment: "confirmed",
				});
				if (
					transactionResult &&
					transactionResult.meta &&
					!transactionResult.meta.err
				) {
					setNum(0);
					console.log("Transaction confirmed:", transactionResult);
					notification.success("Swap Success!");
				} else {
					console.error("Transaction error details:", transactionResult);
					notification.error("Swap Error!", <>{transactionResult}</>);
				}
			}
			setPending(false);
		} catch (err) {
			setPending(false);
			console.error("Transaction error:", err);
			notification.error("Swap Error!", <>{(err as Error).message}</>);
		}
	};

	const handleAirdrop = async () => {
		if (!publicKey) return;

		const airdropSignature = await connection.requestAirdrop(
			publicKey,
			1 * anchor.web3.LAMPORTS_PER_SOL,
		);

		const latestBlockHash = await connection.getLatestBlockhash();

		await connection.confirmTransaction({
			blockhash: latestBlockHash.blockhash,
			lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
			signature: airdropSignature,
		});
	};

	return (
		<div>
			<ButtonPrimary onClick={handleSwap}>{`Token > Voucher`}</ButtonPrimary>
			<ButtonPrimary onClick={handleMintToken}>Token</ButtonPrimary>
		</div>
	);
}
