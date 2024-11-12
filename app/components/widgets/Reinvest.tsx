import * as anchor from "@coral-xyz/anchor";
import { useAtom } from "jotai";
import {
	squadAtom,
	playerDataAtom,
	voucherBalanceAtom,
	balanceAtom,
	roundAtom,
} from "@/app/state";
import { useEffect, useMemo, useState, useCallback } from "react";

import useTransaction from "@/app/hooks/useTransaction";
import { useNotification } from "@/app/notifications";

import { ButtonTertiary } from "../buttons/Button";

/**
 * Reinvest component for handling reinvestment functionality
 */
export default function Reinvest() {
	const [squad] = useAtom(squadAtom);
	const [playerData] = useAtom(playerDataAtom);
	const [round] = useAtom(roundAtom);
	const [voucherBalance] = useAtom(voucherBalanceAtom);
	const [balance] = useAtom(balanceAtom);
	const {
		executeTransaction,
		createReinvestInstructions,
		isTransactionInProgress,
	} = useTransaction();
	const notification = useNotification();
	const [total, setTotal] = useState<anchor.BN>(new anchor.BN(0));

	/**
	 * Handle reinvest action
	 */
	const handleReinvest = useCallback(async () => {
		try {
			await executeTransaction(() => createReinvestInstructions(), "Reinvest");
		} catch (err) {
			console.error("Reinvest error:", err);
		}
	}, [executeTransaction, createReinvestInstructions, notification]);

	/**
	 * Calculate total reinvestment amount
	 */
	useEffect(() => {
		if (!round || !playerData) return;

		try {
			const roundEarningsPerOre = round.earningsPerOre;
			const playerDataEarningsPerOre = playerData.earningsPerOre;
			const playerDataOreAmount = playerData.oreAmount;
			const playerDataConstructionWorkerSalaries =
				playerData.constructionWorkerSalaries;

			// Calculate construction worker salaries following on-chain logic
			// Handle case where player earnings are higher than round earnings
			let earningsDifference;
			if (roundEarningsPerOre.gte(playerDataEarningsPerOre)) {
				earningsDifference = roundEarningsPerOre.sub(playerDataEarningsPerOre);
			} else {
				earningsDifference = new anchor.BN(0);
			}

			const earningsTimesOre = earningsDifference.mul(playerDataOreAmount);
			const total = earningsTimesOre.add(playerDataConstructionWorkerSalaries);

			setTotal(total);
		} catch (error) {
			console.error("Error calculating construction worker salaries:", error);
			setTotal(new anchor.BN(0));
		}
	}, [round, playerData]);

	/**
	 * Determine if the reinvest button should be disabled
	 */
	const isReinvestDisabled = useMemo(() => {
		return (
			isTransactionInProgress || round?.isOver || total.lt(new anchor.BN(1000))
		);
	}, [isTransactionInProgress, round, total, playerData]);

	return (
		<ButtonTertiary
			className='rounded-lg'
			disabled={isReinvestDisabled}
			onClick={handleReinvest}
		>
			Reinvest
		</ButtonTertiary>
	);
}
