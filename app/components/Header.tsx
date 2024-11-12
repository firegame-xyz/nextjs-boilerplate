"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { TokenBalance } from "@/app/components/widgets/TokenBalance";
import Dropdown from "./widgets/Dropdown";
import Nav from "./widgets/Nav";
import { VoucherBalance } from "./widgets/VoucherBalance";
import { useGlobal } from "../hooks/useGlobal";

export default function Header() {
	const { connected } = useWallet();
	const {} = useGlobal();

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
