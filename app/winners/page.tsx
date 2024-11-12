"use client";

import { clx } from "@/app/utils/helpers";
import { useAtom } from "jotai";
import { lastPeriodAtom, periodAtom } from "@/app/state";
import { TopSquadAccount, TopPlayerAccount, Period } from "@/app/state";

function ListItem(props: {
	topData: Period;
	item?: TopSquadAccount;
	index: number;
	isShowTop?: boolean;
}) {
	const { topData, item, index, isShowTop } = props;

	return (
		<div className='relative overflow-hidden rounded-md border border-gray-800 bg-base-black bg-contain p-2 text-xs'>
			{isShowTop && (
				<span
					className={clx(
						"item-badge font-bold text-base-black",
						(index + 1) % 1 === 0 && "bg-warning",
						(index + 1) % 2 === 0 && "bg-gray-300",
						(index + 1) % 3 === 0 && "bg-warning-900",
					)}
				>
					{(index % 3) + 1}
				</span>
			)}
			<div className='m-auto mt-6 size-28 rounded-full bg-blue-600'></div>
			<div className='my-4 text-center text-sm text-base-white'>
				{item?.squad.toString()}
			</div>
			<div className='flex flex-col gap-1 rounded-md bg-gray-800 p-2 text-xs'>
				<div className='flex justify-between'>
					<span className='text-gray'>Winner</span>
					<span>{item?.squad.toString()}</span>
				</div>
				<div className='flex justify-between'>
					<span className='text-gray'>Date</span>
					<span>
						{`${new Date(
							topData.startTime.toNumber() * 1000,
						).toLocaleString()} - ${new Date(
							topData.endTime.toNumber() * 1000,
						).toLocaleString()}`}
					</span>
				</div>
			</div>
		</div>
	);
}

function ListPlayerItem(props: {
	topData: Period;
	item?: TopPlayerAccount;
	index: number;
}) {
	const { topData, item, index } = props;

	return (
		<div className='relative overflow-hidden rounded-md border border-gray-800 bg-base-black bg-contain p-2 text-xs'>
			<div className='m-auto mt-6 size-28 rounded-full bg-blue-600'></div>
			<div className='my-4 text-center text-sm text-base-white'>
				{item?.player.toString()}
			</div>
			<div className='flex flex-col gap-1 rounded-md bg-gray-800 p-2 text-xs'>
				<div className='flex justify-between'>
					<span className='text-gray'>Winner</span>
					<span>{item?.player.toString()}</span>
				</div>
				<div className='flex justify-between'>
					<span className='text-gray'>Date</span>
					<span>
						{`${new Date(
							topData.startTime.toNumber() * 1000,
						).toLocaleString()} - ${new Date(
							topData.endTime.toNumber() * 1000,
						).toLocaleString()}`}
					</span>
				</div>
			</div>
		</div>
	);
}

export default function page() {
	const [lastPeriod] = useAtom(lastPeriodAtom);
	return (
		<div>
			<div>
				<div className='mb-4 banner'>Squad Winners</div>
				{lastPeriod?.length ? (
					<div className='space-y-8'>
						{lastPeriod.map((period, periodIndex) => (
							<div key={periodIndex}>
								<div className='grid gap-4 sm:grid-cols-5'>
									{period.topSquads?.map((item, index) => (
										<ListItem
											key={index}
											item={item}
											index={index}
											topData={period}
											isShowTop
										/>
									))}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='text-center'>No Data</div>
				)}
			</div>

			<div className='mt-4'>
				<div className='mb-4 banner'>Purchase Winners</div>
				{lastPeriod?.length ? (
					<div className='space-y-8'>
						{lastPeriod.map((period, periodIndex) => (
							<div key={periodIndex}>
								<div className='grid gap-4 sm:grid-cols-5'>
									{period.topPlayers?.map((item, index) => (
										<ListPlayerItem
											key={index}
											item={item}
											index={index}
											topData={period}
										/>
									))}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='text-center'>No Data</div>
				)}
			</div>
		</div>
	);
}
