import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { roundAtom, statePendingAtom, currentTimeAtom } from "@/app/state";
import { useTimer } from "react-timer-hook";

import { ButtonDefault } from "./buttons/Button";
import ParticlesComponent from "./widgets/ParticlesComponent";
import RegisterComponent from "./widgets/Register";
import { WaveformShader } from "./widgets/WaveformShader";

interface InnerTimerProps {
	expiryTimestamp: string;
	timerComplete: () => void;
}

/**
 * Inner timer component that handles the countdown logic
 */
function InnerTimer({ expiryTimestamp, timerComplete }: InnerTimerProps) {
	const { seconds, minutes, hours, days, isRunning } = useTimer({
		expiryTimestamp: new Date(expiryTimestamp),
		onExpire: () => {
			console.warn("onExpire called");
			timerComplete();
		},
	});

	useEffect(() => {
		if (!isRunning) {
			timerComplete();
		}
	}, [isRunning, timerComplete]);

	const formatTime = useCallback(
		(time: number) => (time < 10 ? `0${time}` : time.toString()),
		[],
	);

	return (
		<div className='textBox flex gap-2 text-4xl -tracking-[2px] sm:text-5xl'>
			<span className='font-major'>{formatTime(days)}</span>
			<span className='-mt-1'>:</span>
			<span className='font-major'>{formatTime(hours)}</span>
			<span className='-mt-1'>:</span>
			<span className='font-major'>{formatTime(minutes)}</span>
			<span className='-mt-1'>:</span>
			<span className='font-major'>{formatTime(seconds)}</span>
		</div>
	);
}

interface TimerProps {
	registered?: boolean;
	expiryTimestamp: string;
	className?: string;
	timerComplete: () => void;
}

/**
 * Main Timer component
 */
export function Timer({
	registered = false,
	expiryTimestamp,
	className,
	timerComplete,
}: TimerProps) {
	// const [game] = useAtom(gameAtom);
	const [round] = useAtom(roundAtom);
	const [statePending] = useAtom(statePendingAtom);
	const [isClient, setIsClient] = useState(false);
	const [timerKey, setTimerKey] = useState(0);
	const [, setIsTimerComplete] = useState(false);
	const [isCallTime, setIsCallTime] = useState(false);
	const [currentTime] = useAtom(currentTimeAtom);

	const timerCompleteChild = useCallback(() => {
		timerComplete();
		setIsTimerComplete(true);
		// console.log("timerCompleteChild", "Timer complete!");
	}, [timerComplete]);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		setTimerKey((prevKey) => prevKey + 1);
	}, [expiryTimestamp]);

	// useEffect(() => {
	// 	console.log(isTimerComplete, round?.isOver, round?.callCount);
	// }, [round?.callCount, isTimerComplete, round?.isOver]);

	useEffect(() => {
		if (
			round?.endTime &&
			currentTime > Number(round.endTime) &&
			round?.isOver === false
		) {
			setIsCallTime(true);
		} else {
			setIsCallTime(false);
		}
	}, [currentTime, round?.endTime, round?.isOver]);

	const particlesVelocity = useMemo(
		() => (statePending ? 0.1 : 0.009),
		[statePending],
	);

	return (
		<div
			className={`relative mx-auto flex size-[90vw] max-h-[500px] max-w-[500px] justify-center overflow-hidden rounded-full ${className}`}
		>
			<div
				style={{
					opacity: isCallTime ? 0 : 1,
					transition: "opacity 0.3s",
					position: isCallTime ? "absolute" : "relative",
					pointerEvents: isCallTime ? "none" : "auto",
				}}
			>
				<ParticlesComponent
					count={5000}
					pointColor1='#CCCCCC'
					pointColor2='#FFBE00'
					pointSize={2}
					angularVelocity={0.336}
					velocity={particlesVelocity}
				/>
			</div>
			<div
				style={{
					opacity: isCallTime ? 1 : 0,
					transition: "opacity 0.3s",
					position: "absolute",
					width: "100%",
					height: "100%",
					pointerEvents: isCallTime ? "auto" : "none",
				}}
			>
				<WaveformShader />
			</div>

			<div className='absolute top-[30%] text-center text-warning'>
				<div className='mb-5 text-3xl [text-shadow:_2px_2px_0_rgb(0_0_0)]'>
					ARK {round?.roundNumber}
				</div>
				{isCallTime ? (
					<>
						<div className='text-2xl font-bold text-error-600 [text-shadow:_2px_2px_0_rgb(0_0_0)]'>
							CALL COUNTDOWN
						</div>
						<div className='bg-base-black/80 p-2 text-2xl font-bold text-error-600 [text-shadow:_2px_2px_0_rgb(0_0_0)]'>
							{round?.callCount !== undefined ? 10 - round.callCount : null}
						</div>
					</>
				) : (
					<>
						<span className='[text-shadow:_2px_2px_0_rgb(0_0_0)]'>
							COUNTDOWN
						</span>
						<div className='bg-base-black/80 p-2'>
							{isClient ? (
								<InnerTimer
									key={timerKey}
									expiryTimestamp={expiryTimestamp}
									timerComplete={timerCompleteChild}
								/>
							) : (
								<div>Loading...</div>
							)}
						</div>
					</>
				)}

				<Link href='/rule'>
					<ButtonDefault className='h-8 scale-75 rounded-xl'>
						RULE
					</ButtonDefault>
				</Link>
				<div className='flex flex-col items-center'>
					{!registered && <RegisterComponent />}
				</div>
			</div>
		</div>
	);
}
