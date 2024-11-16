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

import {
	playerDataAtom,
	registeredAtom,
	roundAtom,
	currentTimeAtom,
} from "@/app/state";
import { BoxBalance } from "@/app/components/widgets/BoxBalance";
import { Timer } from "@/app/components/Timer";
import { clx, formatAmount, formatTokenAmount } from "@/app/utils/helpers";
import { useQueryData } from "@/app/hooks/useData";
import EndList from "@/app/components/widgets/EndList";
import Exit from "@/app/components/widgets/Exit";
import PurchaseComponent from "@/app/components/widgets/Purchase";
import TopArea from "@/app/components/widgets/TopArea";
import TransactionsList from "@/app/components/widgets/TransactionsList";
import ConstructionWorkerSalariesBalance from "./widgets/ConstructionWorkerSalariesBalance";
import RandomnessStatus from "./RandomnessStatus";
import ThreeScene from "./ThreeScene";
import { ButtonPrimary } from "./buttons/Button";
import RegisterComponent from "./widgets/Register";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const PRICE_PER_ORE = new anchor.BN(1_000_000_000);
const SECONDS_PER_YEAR = new anchor.BN(60 * 60 * 24 * 365);

const MainComponent: React.FC = () => {
	// Atoms
	const [playerData] = useAtom(playerDataAtom);
	const [registered] = useAtom(registeredAtom);
	const [round] = useAtom(roundAtom);
	const [currentTime] = useAtom(currentTimeAtom);

	// Hooks
	const { publicKey, connected } = useWallet();
	const { setVisible } = useWalletModal();
	const { transactions, isLoading, loadMoreTransactions } = useQueryData("");

	// State
	const [expiryTimestamp, setExpiryTimestamp] = useState<string>("0");
	const [exitRewardsValue, setExitRewardsValue] = useState<number>(0);
	const [, setIsTimerComplete] = useState<boolean>(false);
	const [pendingRewardsValue, setPendingRewardsValue] = useState<number>(0);
	const [tabActive, setTabActive] = useState<number>(0);

	// Callbacks
	const calculateExitRewards = useCallback(() => {
		if (!playerData || currentTime === 0) return;

		const nowTime = new anchor.BN(currentTime);
		const timeDiff = nowTime.sub(playerData.lastPurchaseTimestamp);

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
	}, [playerData, currentTime]);

	const exitRewards = useCallback(() => {
		if (!round || currentTime === 0) return setExitRewardsValue(0);
		const _value = new anchor.BN(currentTime)
			.sub(round.lastClaimedExitRewardsTimestamp)
			.mul(new anchor.BN(round?.exitRewardsPerSecond));

		setExitRewardsValue(formatAmount(_value).toNumber());
	}, [round, currentTime]);

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
		return (
			<div className='w-full min-h-[628px] sm:w-1/3 relative'>
				<div className={clx((!publicKey || !registered) && "blur-sm p-5")}>
					<div className='banner mb-4 h-[60px]'>{`THE LAST 10 PURCHASE,THE BIG WINNER!`}</div>

					<PurchaseComponent />

					<div className='widget-base banner-base mt-4 p-4'>
						<div className='flex justify-between'>
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
									{` ORE`}
								</div>
							</div>
							<div>
								<span>{`My Salary: `}</span>
								<ConstructionWorkerSalariesBalance />
								{` FGC`}
							</div>
						</div>
						<div className='flex flex-col mt-3 text-xs'>
							<div className='mb-1'>{`Claim these bonus rewards by exiting now:`}</div>
							<div className='widget-base flex gap-4 p-4'>
								<div className='flex flex-col flex-1 text-center'>
									<span>{`Real-time Rewards`}</span>
									<span className='text-base-white'>{exitRewardsValue}</span>
								</div>
								<div className='flex flex-col flex-1 text-center'>
									<span>{`Extra Salary`}</span>
									<span className='text-base-white'>
										<ConstructionWorkerSalariesBalance />
									</span>
								</div>
								<div className='flex flex-col flex-1 text-center'>
									<span>{`Ore Yield`}</span>
									<span className='text-base-white'>
										{formatTokenAmount(
											formatAmount(new anchor.BN(pendingRewardsValue)),
											0,
										)}
									</span>
								</div>
							</div>
							<div className='mt-4 text-center'>
								<Exit />
							</div>
							<div className='text-xs text-center text-base-white mt-2'>{`Tip: Claim all bonuses before game end`}</div>
						</div>
					</div>
				</div>
				{connected ? (
					!registered && (
						<div className='w-full h-full absolute top-0 left-0 bg-base-black/95 rounded-lg'>
							<div className='flex items-center justify-center w-full h-full'>
								<RegisterComponent />
							</div>
						</div>
					)
				) : (
					<div className='w-full h-full absolute top-0 left-0 bg-base-black/95 rounded-lg'>
						<div className='flex items-center justify-center w-full h-full'>
							<ButtonPrimary
								className='w-3/6 rounded-lg text-md'
								onClick={() => setVisible(true)}
							>
								Connect Wallet
							</ButtonPrimary>
						</div>
					</div>
				)}
			</div>
		);
	}, [registered, publicKey, exitRewardsValue, pendingRewardsValue]);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<TopArea />
			<RandomnessStatus />
			<div className='my-4 flex flex-col sm:flex-row'>
				<div className={clx("w-full sm:w-2/3", "flex items-center relative")}>
					<ThreeScene />
					<Timer
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
