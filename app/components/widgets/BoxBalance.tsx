import * as anchor from "@coral-xyz/anchor";
import { useAtom } from "jotai";
import { playerDataAtom } from "@/app/state";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useEffect, useState } from "react";

import { formatTokenAmount } from "@/app/utils/helpers";

export const BoxBalance: FC = () => {
	const { publicKey } = useWallet();
	const [playerData] = useAtom(playerDataAtom);

	return <>{publicKey && `${playerData?.oreAmount || 0}`}</>;
};
