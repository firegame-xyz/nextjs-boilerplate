import * as anchor from "@coral-xyz/anchor";
import Image from "next/image";
import React, {
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useAtom } from "jotai";
import { useWallet } from "@solana/wallet-adapter-react";

import { playerDataAtom, registeredAtom, roundAtom } from "@/app/state";
import { BoxBalance } from "@/app/components/widgets/BoxBalance";
import { Timer } from "@/app/components/Timer";
import { clx, formatAmount, formatTokenAmount } from "@/app/utils/helpers";
import { useQueryData, useCurrentTime } from "@/app/hooks/useData";
import EndList from "@/app/components/widgets/EndList";
import Exit from "@/app/components/widgets/Exit";
import PurchaseComponent from "@/app/components/widgets/Purchase";
import TopArea from "@/app/components/widgets/TopArea";
import TransactionsList from "@/app/components/widgets/TransactionsList";
import ConstructionWorkerSalariesBalance from "./widgets/ConstructionWorkerSalariesBalance";
import RandomnessStatus from "./RandomnessStatus";

const PRICE_PER_ORE = new anchor.BN(1_000_000_000);
const SECONDS_PER_YEAR = new anchor.BN(60 * 60 * 24 * 365);

const MainComponent: React.FC = () => {
	// Atoms
	const [playerData] = useAtom(playerDataAtom);
	const [registered] = useAtom(registeredAtom);
	const [round] = useAtom(roundAtom);

	// Hooks
	const { publicKey } = useWallet();
	const { transactions, isLoading, loadMoreTransactions } = useQueryData("");
	const currentTime = useCurrentTime();

	// State
	const [expiryTimestamp, setExpiryTimestamp] = useState<string>("0");
	const [exitRewardsValue, setExitRewardsValue] = useState<number>(0);
	const [, setIsTimerComplete] = useState<boolean>(false);
	const [pendingRewardsValue, setPendingRewardsValue] = useState<number>(0);
	const [tabActive, setTabActive] = useState<number>(0);

	// Callbacks
	const calculateExitRewards = useCallback(() => {
		if (!playerData) return;

		const currentTime = new anchor.BN(Math.floor(Date.now() / 1000));
		const timeDiff = currentTime.sub(playerData.lastPurchaseTimestamp);

		// Calculate pending rewards for this period
		const pendingExitRewards = playerData.oreAmount
			.mul(PRICE_PER_ORE)
			.div(SECONDS_PER_YEAR)
			.mul(timeDiff);

		// Add to existing pending rewards
		const totalPendingRewards =
			playerData.pendingExitRewards.add(pendingExitRewards);

		// Cap at max rewards (ore_amount * price)
		const maxExitRewards = playerData.oreAmount.mul(PRICE_PER_ORE);
		const exitRewards = anchor.BN.min(totalPendingRewards, maxExitRewards);

		setPendingRewardsValue(exitRewards.toNumber());
	}, [playerData]);

	const exitRewards = useCallback(() => {
		if (!round) return setExitRewardsValue(0);
		const _value = new anchor.BN(Math.floor(Date.now() / 1000))
			.sub(round.lastClaimedExitRewardsTimestamp)
			.mul(new anchor.BN(round?.exitRewardsPerSecond));

		setExitRewardsValue(formatAmount(_value).toNumber());
	}, [round]);

	const handleTabChange = useCallback((tabIndex: number) => {
		setTabActive(tabIndex);
	}, []);

	const timerComplete = useCallback(() => {
		// console.log("Timer complete!");
		setIsTimerComplete(true);
	}, []);

	// Effects
	useEffect(() => {
		calculateExitRewards();
	}, [calculateExitRewards, currentTime]);

	useEffect(() => {
		exitRewards();
	}, [exitRewards, currentTime]);

	useEffect(() => {
		if (!round?.endTime) return;
		const unixTimestamp = round.endTime.toNumber();
		const dateInMilliseconds = unixTimestamp * 1000;
		const date = new Date(dateInMilliseconds);
		const iso = date.toISOString(); //UTC;

		setExpiryTimestamp(iso);
	}, [round]);

	// Memoized Components
	const MemoizedEndList = useMemo(() => <EndList />, []);
	const MemoizedTransactionsList = useMemo(
		() => (
			<TransactionsList
				data={transactions}
				isLoading={isLoading}
				loadMoreTransactions={loadMoreTransactions}
			/>
		),
		[transactions, isLoading, loadMoreTransactions],
	);

	const renderRightColumn = useMemo(() => {
		if (!registered || !publicKey) return null;
		return (
			<div className='w-full sm:w-1/3'>
				<PurchaseComponent />
				<div className='banner mt-4 h-[60px]'>{`THE LAST 10 PURCHASE,THE BIG WINNER!`}</div>
				<div className='widget-base banner-base mt-4 p-4'>
					<div className='flex items-center gap-2'>
						<div className='relative h-[32px] w-[32px]'>
							<Image
								src='/images/ore.png'
								alt='Ore icon'
								fill
								sizes='32px'
								style={{ objectFit: "contain" }}
							/>
						</div>
						<div className='text-base-white'>
							<BoxBalance />
						</div>
					</div>
					<div className='flex mt-3 text-xs'>
						<div className='flex flex-1 gap-4'>
							<div className='flex flex-col'>
								<span>{`Exit Rewards`}</span>
								<span className='text-base-white'>{exitRewardsValue}</span>
							</div>
							<div className='flex flex-col'>
								<span>{`Pending Rewards`}</span>
								<span className='text-base-white'>
									{formatTokenAmount(
										formatAmount(new anchor.BN(pendingRewardsValue)),
										0,
									)}
								</span>
							</div>
							<div className='flex flex-col'>
								<span>{`Construction Worker Salaries`}</span>
								<span className='text-base-white'>
									<ConstructionWorkerSalariesBalance />
								</span>
							</div>
						</div>
						<Exit />
					</div>
				</div>
			</div>
		);
	}, [registered, publicKey, exitRewardsValue, pendingRewardsValue]);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<TopArea />
			<RandomnessStatus />
			<div className='my-4 flex flex-col sm:flex-row'>
				<div
					className={clx(
						registered && publicKey ? "w-full sm:w-2/3" : "w-full",
					)}
				>
					<Timer
						registered={registered}
						expiryTimestamp={expiryTimestamp}
						timerComplete={timerComplete}
					/>
				</div>
				{renderRightColumn}
			</div>

			<div className='flex gap-2 px-2'>
				<span
					className={clx(
						"cursor-pointer rounded-t-lg bg-gray-900 px-4 py-2 text-gray-600",
						tabActive === 0 && "bg-base-black text-base-white",
					)}
					onClick={() => handleTabChange(0)}
				>
					{`Transactions`}
				</span>
				<span
					className={clx(
						"cursor-pointer rounded-t-lg bg-gray-900 px-4 py-2 text-gray-600",
						tabActive === 1 && "bg-base-black text-base-white",
					)}
					onClick={() => handleTabChange(1)}
				>
					{`Last 10 Purchase`}
				</span>
			</div>
			{tabActive === 0 ? MemoizedTransactionsList : MemoizedEndList}
		</Suspense>
	);
};

export default React.memo(MainComponent);
