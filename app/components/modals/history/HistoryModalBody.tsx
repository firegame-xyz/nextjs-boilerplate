import * as anchor from "@coral-xyz/anchor";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
	CloseIcon,
	FilterIcon,
	LinkExternalIcon,
} from "@/app/components/icons/Icon";
import TimeAgo from "@/app/components/widgets/TimeAge";
import {
	clx,
	formatAddress,
	formatAmount,
	formatTokenAmount,
} from "@/app/utils/helpers";
import { Transaction } from "@/app/hooks/useData";

const HistoryModalBody: React.FC<{ data: Transaction[] }> = React.memo(
	({ data }) => {
		const transactions = data;

		return (
			<div className='flex grow flex-col'>
				<div className='flex w-full py-5'>
					<span className='w-1/6 sm:w-1/6'>DATE</span>
					<span className='w-3/6 sm:w-2/6'>TYPE</span>
					<span className='w-2/6 sm:w-1/6'>ORE</span>
					{/* <span className="w-2/6 sm:w-1/6">FGC + FGV</span> */}
					<span className='hidden sm:flex sm:w-2/6'>ADDRESS</span>
					<span className='w-[30px]'>TXN</span>
				</div>
				<div className='flex flex-1 overflow-auto pb-5'>
					<div className='h-0 max-h-full min-h-[300px] w-full'>
						{transactions.map((transaction) => (
							<div
								key={transaction.id}
								className={clx(
									"flex border-b border-gray-700/40 py-4 text-xs",
									transaction.isNew ? "new-transaction" : "",
								)}
							>
								<span className='w-1/6 sm:w-1/6'>
									<TimeAgo timestamp={transaction.timestamp} />
								</span>
								<span className='w-3/6 sm:w-2/6'>
									{transaction.event_type?.split("Event")[0]}
								</span>
								<span className='w-2/6 sm:w-1/6'>
									{new anchor.BN(
										transaction.data?.purchaseQuantity || 0,
										16,
									).toString()}
								</span>
								<span className='hidden sm:flex sm:w-2/6'>
									{formatAddress(transaction.initiator, 12, -12)}
								</span>
								<span className='w-[30px]'>
									<Link
										href={`https://solscan.io/tx/${transaction.signature}`}
										target='_blank'
									>
										<LinkExternalIcon className='w-5' color='#525252' />
									</Link>
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	},
);

export default HistoryModalBody;
