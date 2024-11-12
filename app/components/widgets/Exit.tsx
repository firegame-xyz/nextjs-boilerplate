import * as anchor from "@coral-xyz/anchor";
import { useAtom } from "jotai";
import {
	gameAtom,
	statePendingAtom,
	playerDataAtom,
	roundAtom,
} from "@/app/state";
import { useCallback, useMemo } from "react";
import { ButtonTertiary } from "../buttons/Button";
import useTransaction from "@/app/hooks/useTransaction";
import { clx } from "@/app/utils/helpers";

/**
 * Exit component for handling settle and exit operations
 */
export default function Exit() {
	const [game] = useAtom(gameAtom);
	const [round] = useAtom(roundAtom);
	const [playerData] = useAtom(playerDataAtom);
	const [, setStatePending] = useAtom(statePendingAtom);

	const {
		executeTransaction,
		createSettlePreviousRoundInstructions,
		createExitInstructions,
		isTransactionInProgress,
	} = useTransaction();

	/**
	 * Handle settle operation
	 */
	const handleSettle = useCallback(async () => {
		if (!playerData || !game) return;
		setStatePending(true);
		try {
			await executeTransaction(createSettlePreviousRoundInstructions, "Settle");
		} finally {
			setStatePending(false);
		}
	}, [
		playerData,
		game,
		executeTransaction,
		createSettlePreviousRoundInstructions,
		setStatePending,
	]);

	/**
	 * Handle exit operation
	 */
	const handleExit = useCallback(async () => {
		await executeTransaction(createExitInstructions, "Exit");
	}, [executeTransaction, createExitInstructions]);

	/**
	 * Determine if the button should be disabled
	 */
	const isDisabled = useMemo(() => {
		return (
			isTransactionInProgress ||
			!playerData ||
			playerData?.oreAmount.lt(new anchor.BN(1))
		);
	}, [isTransactionInProgress, playerData]);

	return (
		<ButtonTertiary
			className={clx(
				"rounded-lg heightLightButton h-8 text-base-white",
				!isDisabled && "animate",
			)}
			disabled={isDisabled}
			onClick={round?.isOver ? handleSettle : handleExit}
		>
			Exit
		</ButtonTertiary>
	);
}
