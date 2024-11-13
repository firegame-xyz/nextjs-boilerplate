"use client";

import { useCallback, useMemo, useRef } from "react";
import { Modal, ModalHandles } from "@/app/components/modals/Modal";
import { useQueryData } from "@/app/hooks/useData";
import TransactionsList from "@/app/components/widgets/TransactionsList";
import { useWallet } from "@solana/wallet-adapter-react";

export default function HistoryModal() {
	const { publicKey } = useWallet();
	const { transactions, isLoading, loadMoreTransactions } = useQueryData(
		publicKey?.toString() ?? "",
	);
	const modalRef = useRef<ModalHandles>(null);

	const handleLoadMore = useCallback(
		async (filterAddress: string) => {
			return await loadMoreTransactions(
				(filterAddress || publicKey?.toString()) ?? "",
			);
		},
		[loadMoreTransactions, publicKey],
	);

	const MemoizedHistoryList = useMemo(
		() => (
			<TransactionsList
				data={transactions}
				isLoading={isLoading}
				isHistory={true}
				loadMoreTransactions={handleLoadMore}
			/>
		),
		[transactions, isLoading, handleLoadMore],
	);

	return (
		<Modal
			className='lg:w-[596px]'
			ref={modalRef}
			show={true}
			redirect={true}
			title={
				<div>
					<h1>History</h1>
				</div>
			}
		>
			{MemoizedHistoryList}
		</Modal>
	);
}
