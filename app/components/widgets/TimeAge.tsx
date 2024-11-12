import { useCurrentTime } from "@/app/hooks/useData";
import React, { useMemo } from "react";

interface TimeAgoProps {
	timestamp: number;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
	const currentTime = useCurrentTime();

	const timeAgo = useMemo(() => {
		// const now = Math.floor(Date.now() / 1000);
		const seconds = currentTime - timestamp;

		const timeUnits = [
			{ unit: 86400, label: "d" },
			{ unit: 3600, label: "h" },
			{ unit: 60, label: "m" },
			{ unit: 1, label: "s" },
		];

		for (let i = 0; i < timeUnits.length; i++) {
			const { unit, label } = timeUnits[i];
			const nextUnit = timeUnits[i + 1]?.unit ?? 1;

			if (seconds >= unit) {
				const value = Math.floor(seconds / unit);
				const remainder = Math.floor((seconds % unit) / nextUnit);
				return `${value}${label} ${remainder}${timeUnits[i + 1]?.label ?? ""}`;
			}
		}

		return "0s";
	}, [timestamp, currentTime]);

	return (
		<>
			{timeAgo}
			<span className='ml-1 hidden sm:inline-block'>{`ago`}</span>
		</>
	);
};

export default TimeAgo;
