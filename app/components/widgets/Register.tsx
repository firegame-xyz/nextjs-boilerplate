import * as anchor from "@coral-xyz/anchor";
import { useAtom } from "jotai";
import {
	providerAtom,
	programAtom,
	registeredAtom,
	gameAtom,
} from "@/app/state";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ButtonPrimary, ButtonTertiary } from "@/app/components/buttons/Button";
import { findPlayerDataPDA } from "@/app/config/pda";
import { useGlobal } from "@/app/hooks/useGlobal";
import useTransaction from "@/app/hooks/useTransaction";

import {
	isMainNet,
	ON_DEMAND_MAINNET_PID,
	ON_DEMAND_DEVNET_PID,
	ON_DEMAND_MAINNET_QUEUE,
	ON_DEMAND_DEVNET_QUEUE,
} from "@/app/utils/helpers";
import * as spl from "@solana/spl-token";

const RegisterComponent = () => {
	const searchParams = useSearchParams();
	const [program] = useAtom(programAtom);
	const [provider] = useAtom(providerAtom);
	const [registered] = useAtom(registeredAtom);
	const [game] = useAtom(gameAtom);
	const { fetchPlayerData } = useGlobal();
	const { setVisible } = useWalletModal();
	const { connected, publicKey, signTransaction } = useWallet();
	const { executeTransaction, isTransactionInProgress } = useTransaction();

	const initializePlayer = async (): Promise<anchor.web3.TransactionInstruction[]> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		const rngKp = anchor.web3.Keypair.generate();

		const link_code = searchParams.get("link_code");

		let inviterPublicKey = anchor.web3.PublicKey.default;

		if (
			link_code &&
			link_code.toLowerCase() !== publicKey.toString().toLowerCase()
		) {
			try {
				const inputInviterPublicKey = new anchor.web3.PublicKey(link_code);
				const playerDataPDA = findPlayerDataPDA(
					inputInviterPublicKey,
					program.programId,
				);

				await program.account.playerData.fetch(playerDataPDA);
				inviterPublicKey = inputInviterPublicKey;
			} catch (err) {
				console.warn("Invalid or non-existent inviter account:", err);
				// Fallback to DEFAULT_PUBLICKEY
			}
		}

		const initializeTokenInstruction = await program.methods
			.initializeToken()
			.accounts({})
			.instruction();

		const initializePlayerInstruction = await program.methods
			.initializePlayer(inviterPublicKey)
			.accounts({})
			.instruction();

		try {
			const sbProgramId = isMainNet
				? ON_DEMAND_MAINNET_PID
				: ON_DEMAND_DEVNET_PID;

			const sbIdl = await anchor.Program.fetchIdl(sbProgramId, provider);

			const sbProgram = new anchor.Program(sbIdl!, provider);
			const queue = isMainNet
				? ON_DEMAND_MAINNET_QUEUE
				: ON_DEMAND_DEVNET_QUEUE;

			const lutSigner = anchor.web3.PublicKey.findProgramAddressSync(
				[Buffer.from("LutSigner"), rngKp.publicKey.toBuffer()],
				sbProgram.programId,
			)[0];
			const recentSlot = await sbProgram.provider.connection.getSlot(
				"finalized",
			);
			const [_, lut] = anchor.web3.AddressLookupTableProgram.createLookupTable({
				authority: lutSigner,
				payer: anchor.web3.PublicKey.default,
				recentSlot,
			});
			const programState = anchor.web3.PublicKey.findProgramAddressSync(
				[Buffer.from("STATE")],
				sbProgram.programId,
			)[0];

			const createRandomnessInstruction = await sbProgram.methods
				.randomnessInit({
					recentSlot: new anchor.BN(recentSlot.toString()),
				})
				.accounts({
					randomness: rngKp.publicKey,
					queue,
					authority: publicKey,
					payer: publicKey,
					rewardEscrow: spl.getAssociatedTokenAddressSync(
						spl.NATIVE_MINT,
						rngKp.publicKey,
					),
					systemProgram: anchor.web3.SystemProgram.programId,
					tokenProgram: spl.TOKEN_PROGRAM_ID,
					associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
					wrappedSolMint: spl.NATIVE_MINT,
					programState: programState,
					lutSigner,
					lut,
					addressLookupTableProgram:
						anchor.web3.AddressLookupTableProgram.programId,
				})
				.instruction();
		} catch (err) {
			console.error(err);
		}

		return [initializeTokenInstruction, initializePlayerInstruction];
	};

	const handle = async () => {
		if (!connected) {
			setVisible(true);
			return;
		}

		try {
			await executeTransaction(initializePlayer, "Register");
			await fetchPlayerData();
		} catch (err) {
			console.error("Registration error:", err);
		}
	};

	return (
		<>
			{!(connected && registered) && (
				<>
					<ButtonTertiary
						className='h-8 rounded-lg'
						disabled={isTransactionInProgress}
						onClick={handle}
					>
						Register
					</ButtonTertiary>
					{game?.remainingRegistrationRewardSlots && (
						<div className='text-xs'>
							{`Registration reward quota: `}
							{game?.remainingRegistrationRewardSlots.toString()}
						</div>
					)}
				</>
			)}
		</>
	);
};

export default RegisterComponent;
