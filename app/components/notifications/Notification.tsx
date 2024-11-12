import { useEffect, useRef, useState } from "react";

import { useNotification } from "@/app/notifications";
import { clx } from "@/app/utils/helpers";

import { CloseIcon } from "../icons/Icon";

interface Props {
	id: number;
	children?: React.ReactNode;
	className?: string;
	rootClassName?: string;
	titleArea: React.ReactNode;
	titleAreaClassName?: string;
	msgAreaClassName?: string;
	messageArea?: React.ReactNode;
	type: string;
	liveTime?: number;
}

export const Notification: React.FC<Props> = ({
	id,
	children,
	className,
	rootClassName,
	messageArea,
	msgAreaClassName,
	titleArea,
	titleAreaClassName,
	type,
	liveTime = 6000,
}) => {
	const [dismissed, setDismissed] = useState(false);
	const progressRef = useRef<HTMLDivElement>(null);
	const notification = useNotification();
	const timer = useRef<NodeJS.Timeout | null>(null);

	const dismiss = () => {
		setDismissed(true);
		setTimeout(() => {
			notification.remove(id);
		}, 300);
	};

	useEffect(() => {
		timer.current = setTimeout(() => {
			dismiss();
		}, liveTime);
		return () => {
			clearTimeout(timer.current);
		};
	}, []);

	const handleMouseEnter = () => {
		if (progressRef.current !== null) {
			clearTimeout(timer.current);
			progressRef.current.style.animationPlayState = "paused";
		}
	};

	const handleMouseLeave = () => {
		if (
			progressRef.current !== null &&
			progressRef.current.parentElement !== null
		) {
			const remainingTime =
				(progressRef.current.offsetWidth /
					progressRef.current.parentElement?.offsetWidth) *
				liveTime;

			progressRef.current.style.animationPlayState = "running";

			timer.current = setTimeout(() => {
				dismiss();
			}, remainingTime);
		}
	};

	return (
		<div
			className={clx(
				"notification relative flex justify-end",
				dismissed && "notification-dismissed",
				rootClassName,
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div
				className={clx(
					"relative min-w-[240px] max-w-xs overflow-hidden rounded-xl border border-blue-600 bg-blue-700 p-4",
					className,
				)}
			>
				<div
					className={clx(
						"mb-1 text-sm font-semibold text-base-white",
						titleAreaClassName,
					)}
				>
					{titleArea}
				</div>
				<div className={clx("text-sm text-base-white/90", msgAreaClassName)}>
					{messageArea}
				</div>
				<div className='absolute bottom-0 left-0 h-px w-full bg-transparent'>
					<div
						ref={progressRef}
						className={`notification-bar ${type}`}
						style={{ animationDuration: `${liveTime / 1000}s` }}
					></div>
				</div>
			</div>
			<div
				onClick={dismiss}
				className='absolute -right-2 -top-2 flex size-5 cursor-pointer items-center justify-center rounded-[32px] border border-gray-800 bg-gray-900 p-1'
			>
				<CloseIcon />
			</div>
			{children}
		</div>
	);
};
