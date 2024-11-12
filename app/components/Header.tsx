"use client";

import * as anchor from "@coral-xyz/anchor";
import { Idl } from "@coral-xyz/anchor";
import { useAtom } from "jotai";
import {
	useWallet,
	useAnchorWallet,
	useConnection,
} from "@solana/wallet-adapter-react";
import Image from "next/image";
import { useEffect } from "react";

import {
	// playerRoundAtom,
	programAtom,
	providerAtom,
} from "@/app/state";

import { TokenBalance } from "@/app/components/widgets/TokenBalance";
import { useGlobal } from "@/app/hooks/useGlobal";
// import cashierIdl from "@/idl/cashier.json";
import gameIdl from "@/idl/game.json";

import Dropdown from "./widgets/Dropdown";
import Nav from "./widgets/Nav";
import { VoucherBalance } from "./widgets/VoucherBalance";

export default function Header() {
	const {} = useGlobal();
	const { connection } = useConnection();
	const { connected } = useWallet();
	const wallet = useAnchorWallet();

	// const [playerRound] = useAtom(playerRoundAtom);
	const [, setProgram] = useAtom(programAtom);
	const [, setProvider] = useAtom(providerAtom);

	// const [signature, setSignature] = useState<string | null>(null);
	// const [user, setUser] = useState<TelegramUser | null>(null);

	// const handleTelegramResponse = async (telegramUser: TelegramUser) => {
	// 	const response = await fetch("/api/telegram-auth", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(telegramUser),
	// 	});

	// 	if (response.ok) {
	// 		setUser(telegramUser);
	// 	} else {
	// 		console.error("Telegram authentication failed");
	// 	}
	// };

	// const onSignMessage = useCallback(async () => {
	// 	if (!publicKey || !signMessage) {
	// 		console.log(
	// 			"Wallet not connected or does not support signing functionality.",
	// 		);
	// 		return;
	// 	}

	// 	try {
	// 		const message = new TextEncoder().encode("Hello, Solana!");
	// 		const signedMessage = await signMessage(message);
	// 		console.log(publicKey.toString());
	// 		console.log(Buffer.from(signedMessage).toString("base64"));
	// 		console.log(signedMessage);
	// 		setSignature(Buffer.from(signedMessage).toString("base64"));
	// 	} catch (error) {
	// 		console.error("Signature failed:", error);
	// 	}
	// }, [publicKey, signMessage]);

	useEffect(() => {
		const provider = new anchor.AnchorProvider(connection, wallet!, {});
		const gameIdlProgram = new anchor.Program(gameIdl as Idl, provider);
		// const cashierIdlProgram = new anchor.Program(cashierIdl as any, provider);

		setProvider(provider);
		setProgram(gameIdlProgram);
	}, [wallet, connection]);

	return (
		<div className='flex justify-between border-b-2 border-b-warning p-5 sm:justify-start'>
			<div className='flex w-20 items-center sm:w-28'>
				<Image
					alt='logo'
					src={"/images/logo.png"}
					priority
					width={176}
					height={46}
				/>
			</div>
			<div className='mx-12 hidden flex-1 sm:flex'>
				<Nav />
			</div>
			<div className='flex items-center'>
				{/* <ButtonPrimary onClick={onSignMessage}>Signature</ButtonPrimary> */}
				{/* <TelegramLoginWidget
					botName='myTestFir_bot'
					onAuth={handleTelegramResponse}
				/> */}
				{connected && (
					<>
						<div className='mr-4 flex items-center'>
							<Image
								alt='fgv'
								src={"/images/fgv.png"}
								width={32}
								height={32}
								className='h-[32px] w-auto'
							/>
							<div className='ml-2 flex flex-col text-xs leading-4'>
								<span>FGV</span>
								<span>
									<VoucherBalance />
								</span>
							</div>
						</div>
						<div className='mr-4 flex items-center'>
							<Image
								alt='fgc'
								src={"/images/fgc.png"}
								width={32}
								height={32}
								className='h-[32px] w-auto'
							/>
							<div className='ml-2 flex flex-col text-xs leading-4'>
								<span>FGC</span>
								<span>
									<TokenBalance />
								</span>
							</div>
						</div>
					</>
				)}
				<Dropdown />
			</div>
		</div>
	);
}
