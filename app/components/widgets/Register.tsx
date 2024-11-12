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
// import { useEffect, useState } from "react";

import { ButtonTertiary } from "@/app/components/buttons/Button";
import { findPlayerDataPDA } from "@/app/config/pda";
import useTransaction from "@/app/hooks/useTransaction";
import { useFetch } from "@/app/hooks/useFetch";

// import {
// 	isMainNet,
// 	ON_DEMAND_MAINNET_PID,
// 	ON_DEMAND_DEVNET_PID,
// 	ON_DEMAND_MAINNET_QUEUE,
// 	ON_DEMAND_DEVNET_QUEUE,
// } from "@/app/utils/helpers";
// import * as spl from "@solana/spl-token";

const RegisterComponent = () => {
	const searchParams = useSearchParams();
	const [program] = useAtom(programAtom);
	const [provider] = useAtom(providerAtom);
	const [registered] = useAtom(registeredAtom);
	const [game] = useAtom(gameAtom);
	const { fetchPlayerData } = useFetch();
	const { setVisible } = useWalletModal();
	const { connected, publicKey } = useWallet();
	const { executeTransaction, isTransactionInProgress } = useTransaction();

	const initializePlayer = async (): Promise<
		anchor.web3.TransactionInstruction[]
	> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		// const rngKp = anchor.web3.Keypair.generate();

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
