import * as anchor from "@coral-xyz/anchor";
import { useAtom } from "jotai";
import {
	squadAtom,
	roundAtom,
	playerDataAtom,
	registeredAtom,
} from "@/app/state";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import {
	formatAmount,
	formatTokenAmount,
} from "@/app/utils/helpers";

export default function ConstructionWorkerSalariesBalance() {
	const { connected, publicKey } = useWallet();
	const [squad] = useAtom(squadAtom);
	const [round] = useAtom(roundAtom);
	const [playerData] = useAtom(playerDataAtom);
	const [registered] = useAtom(registeredAtom);
	const [total, setTotal] = useState<anchor.BN>(new anchor.BN(0));

	// const minConstructionWorkerSalaries = useMemo(() => {
	// 	if (!squad?.score || squad?.number === 0) return new anchor.BN(0);
	// 	const score = discountRate(squad?.score).discount * 0.01;
	// 	const scoredValue = 1000 * score;

	// 	return scoredValue;
	// }, [squad]);

	useEffect(() => {
		if (!round || !playerData) return;

		try {
			const roundEarningsPerOre = round.earningsPerOre;
			const playerDataEarningsPerOre = playerData.earningsPerOre;
			const playerDataOreAmount = playerData.oreAmount;
			const playerDataConstructionWorkerSalaries =
				playerData.constructionWorkerSalaries;

			// Calculate construction worker salaries following on-chain logic
			const earningsDifference = playerDataEarningsPerOre.gt(
				roundEarningsPerOre,
			)
				? new anchor.BN(0)
				: roundEarningsPerOre.sub(playerDataEarningsPerOre);

			const earningsTimesOre = earningsDifference.mul(playerDataOreAmount);
			if (earningsTimesOre.lt(new anchor.BN(0))) {
				throw new Error("Earnings times ore underflow");
			}

			const total = earningsTimesOre.add(playerDataConstructionWorkerSalaries);
			if (total.lt(new anchor.BN(0))) {
				throw new Error("Total underflow");
			}

			setTotal(total);
		} catch (error) {
			console.error("Error calculating construction worker salaries:", error);
			setTotal(new anchor.BN(0));
		}
	}, [round, playerData]);

	return (
		<>
			{connected && registered && (
				<>{formatTokenAmount(formatAmount(total), 0)}</>
			)}
		</>
	);
}
