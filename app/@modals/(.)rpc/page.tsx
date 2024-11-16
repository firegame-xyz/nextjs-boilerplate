"use client";

import { useRef } from "react";

import { Modal, ModalHandles } from "@/app/components/modals/Modal";
import { RpcModalBody } from "@/app/components/modals/rpc/RpcModalBody";

export default function RpcModal() {
	const modalRef = useRef<ModalHandles>(null);

	const handleModalClose = () => {
		modalRef.current?.triggerClose();
	};

	return (
		<Modal
			className='lg:w-[596px]'
			ref={modalRef}
			show={true}
			redirect={true}
			title={
				<div>
					<h1>RPC Configuration</h1>
				</div>
			}
		>
			<RpcModalBody modalClosed={handleModalClose} />
		</Modal>
	);
}
