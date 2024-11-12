import { useAtom } from "jotai";
import { playerDataAtom } from "@/app/state";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC } from "react";


export const BoxBalance: FC = () => {
	const { publicKey } = useWallet();
	const [playerData] = useAtom(playerDataAtom);

	return <>{publicKey && `${playerData?.oreAmount || 0}`}</>;
};
