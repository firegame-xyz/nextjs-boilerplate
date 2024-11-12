"use client";

import * as anchor from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { BackIcon } from "@/app/components/icons/Icon";
import { SolanaAvatar } from "@/app/components/widgets/SolanaAvatar";
import {
	clx,
	discountRate,
	formatAddress,
	formatAmount,
	formatTokenAmount,
} from "@/app/utils/helpers";

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
