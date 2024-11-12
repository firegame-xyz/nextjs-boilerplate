"use client";

import { useRef } from "react";

import { Modal, ModalHandles } from "@/app/components/modals/Modal";
import { SquadModalBody } from "@/app/components/modals/squad/SquadModalBody";

export default function SquadModal() {
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
					<h1>Update a squad</h1>
				</div>
			}
		>
			<SquadModalBody modalClosed={handleModalClose} />
		</Modal>
	);
}
