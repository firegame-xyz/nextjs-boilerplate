import { useAtom } from "jotai";
import { balanceAtom } from "@/app/state";
import { useWallet } from "@solana/wallet-adapter-react";
import { formatTokenAmount } from "@/app/utils/helpers";

export const TokenBalance = () => {
	const { publicKey } = useWallet();
	const [balance] = useAtom(balanceAtom);

	return <>{publicKey && `${formatTokenAmount(balance?.amount || 0)}`}</>;
};
