"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

import { BackIcon } from "@/app/components/icons/Icon";



type Props = {
	params: { address: string };
};

export default function Page({ params }: Props) {
	const { publicKey } = useWallet();

	return (
		<>
			<div className='flex items-center'>
				<Link href='/squad'>
					<div className='flex items-center gap-0.5'>
						<BackIcon />
						{`Back`}
					</div>
				</Link>
			</div>
		</>
	);
}
