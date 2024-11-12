import { useAtom } from "jotai";
import { voucherBalanceAtom } from "@/app/state";
import { useWallet } from "@solana/wallet-adapter-react";

import { formatTokenAmount } from "@/app/utils/helpers";

export const VoucherBalance = () => {
	const { publicKey } = useWallet();
	const [voucherBalance] = useAtom(voucherBalanceAtom);

	return (
		<>{publicKey && `${formatTokenAmount(voucherBalance?.amount || 0)}`}</>
	);
};
