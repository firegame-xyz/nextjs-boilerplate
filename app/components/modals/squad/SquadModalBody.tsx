import * as anchor from "@coral-xyz/anchor";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAtom } from "jotai";

import { ButtonPrimary } from "../../buttons/Button";
import { PhotoIcon } from "../../icons/Icon";
import { programAtom, providerAtom, squadAtom } from "@/app/state";
import { useAvatarUrl } from "@/app/hooks/useData";
import useTransaction from "@/app/hooks/useTransaction";
import { useWallet } from "@solana/wallet-adapter-react";

interface ModalProps {
	modalClosed: () => void;
}

export const SquadModalBody: React.FC<ModalProps> = ({ modalClosed }) => {
	const { publicKey } = useWallet();
	const [squad] = useAtom(squadAtom);
	const [program] = useAtom(programAtom);
	const [provider] = useAtom(providerAtom);
	const { executeTransaction, isTransactionInProgress } = useTransaction();

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
	const [uploadedImageName, setUploadedImageName] = useState<string | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [name, setName] = useState<string>("");
	const [xName, setXName] = useState<string>("");
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const FILE_SIZE_LIMIT = 1 * 1024 * 1024; // 1MB
	const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

	useEffect(() => {
		if (!squad?.name || !squad?.description) return;
		setName((prev) => (prev === "" ? squad.name || "" : prev));
		setXName((prev) => (prev === "" ? squad.description || "" : prev));
	}, [squad]);

	const processImage = useCallback((dataUrl: string, file: File) => {
		const img = document.createElement("img");
		img.src = dataUrl;

		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			const targetSize = 400;
			const scale = Math.max(targetSize / img.width, targetSize / img.height);
			const scaledWidth = img.width * scale;
			const scaledHeight = img.height * scale;

			canvas.width = scaledWidth;
			canvas.height = scaledHeight;
			ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

			const croppedCanvas = document.createElement("canvas");
			const croppedCtx = croppedCanvas.getContext("2d");
			if (!croppedCtx) return;

			croppedCanvas.width = targetSize;
			croppedCanvas.height = targetSize;

			const sx = (scaledWidth - targetSize) / 2;
			const sy = (scaledHeight - targetSize) / 2;

			croppedCtx.drawImage(
				canvas,
				sx,
				sy,
				targetSize,
				targetSize,
				0,
				0,
				targetSize,
				targetSize,
			);

			croppedCanvas.toBlob((blob) => {
				if (blob) {
					const croppedFile = new File([blob], file.name, { type: file.type });
					setSelectedFile(croppedFile);
					setImagePreview(URL.createObjectURL(croppedFile));
				}
			}, file.type);
		};
	}, []);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files ? event.target.files[0] : null;

		if (!file) {
			setSelectedFile(null);
			setImagePreview(null);
			return;
		}

		if (!ALLOWED_FILE_TYPES.includes(file.type)) {
			setMessage(
				"File format not supported. Please upload files in PNG or JPG format.",
			);
			setSelectedFile(null);
			setImagePreview(null);
			return;
		}

		if (file.size > FILE_SIZE_LIMIT) {
			setMessage(
				"File size exceeds the limit (1MB). Please upload a smaller file.",
			);
			setSelectedFile(null);
			setImagePreview(null);
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = (e) => {
			if (e.target?.result) {
				processImage(e.target.result as string, file);
			}
		};
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			setMessage("Please select a file first");
			return;
		}

		setUploading(true);
		setMessage("");

		const formData = new FormData();
		formData.append("file", selectedFile);

		try {
			const response = await fetch("/api/s3", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("File upload failed");
			}

			const data = await response.json();
			setMessage("File uploaded successfully");
			setUploadedImageUrl(data.url);
			setUploadedImageName(data.fileName);
			return data;
		} catch (error) {
			console.error(error);
			setMessage("File upload failed");
			return undefined;
		} finally {
			setUploading(false);
		}
	};

	const updateSquadInfoInstruction = async (data: {
		name: string;
		description: string;
		logoUrl: string;
	}): Promise<anchor.web3.TransactionInstruction[]> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		const instruction = await program.methods
			.updateSquadInfo(data.name, data.logoUrl, data.description)
			.accounts({})
			.instruction();

		return [instruction];
	};

	const handleUpdate = async () => {
		const imageName = uploadedImageName ?? "";
		const data: {
			name: string;
			description: string;
			logoUrl: string;
		} = {
			name: name,
			description: xName,
			logoUrl: squad?.logoUrl ?? imageName,
		};

		if (selectedFile) {
			const fileData = await handleUpload();
			if (fileData) data.logoUrl = fileData.url;
		}

		await executeTransaction(
			() => updateSquadInfoInstruction(data),
			"Update squad info",
		);
	};

	const handleIconClick = () => {
		fileInputRef.current?.click();
	};

	const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		if (newValue === "") {
			setName("");
			return;
		}

		const maxLength = 20;
		const allowedPattern = /^[a-zA-Z0-9_]+$/;

		if (!allowedPattern.test(newValue) || newValue.length > maxLength) {
			setError(
				`Only letters, numbers, and underscores are allowed And the length cannot exceed ${maxLength} characters.`,
			);
		} else {
			setError(null);
			setName(newValue);
		}
	};

	const changeXName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		if (newValue === "") {
			setXName("");
			return;
		}

		const maxLength = 15;
		const allowedPattern = /^[a-zA-Z0-9_]+$/;

		if (!allowedPattern.test(newValue) || newValue.length > maxLength) {
			setError(
				`Only letters, numbers, and underscores are allowed And the length cannot exceed ${maxLength} characters.`,
			);
		} else {
			setError(null);
			setXName(newValue);
		}
	};

	const isUpdateButtonDisabled = () => {
		const isNameChanged = name.trim() !== squad?.name?.trim();
		const isXNameChanged = xName.trim() !== squad?.description?.trim();
		const isImageChanged = Boolean(selectedFile);

		const hasChanges = isNameChanged || isXNameChanged || isImageChanged;

		return (
			isTransactionInProgress ||
			uploading ||
			!xName.trim() ||
			!name.trim() ||
			Boolean(error) ||
			!hasChanges
		);
	};

	const avatarUrl = useAvatarUrl(squad?.logoUrl);

	return (
		<div>
			<div className='flex justify-center'>
				<input
					type='file'
					ref={fileInputRef}
					style={{ display: "none" }}
					onChange={handleFileChange}
				/>
				<div
					className='relative size-28 cursor-pointer overflow-hidden rounded-full bg-gray-400'
					onClick={handleIconClick}
				>
					<span className='center'>
						<PhotoIcon width={40} />
					</span>

					{imagePreview ? (
						<Image src={imagePreview} width={112} height={112} alt='' />
					) : (
						<img
							width={112}
							height={112}
							alt=''
							src={avatarUrl ?? "/images/default.jpg"}
						/>
					)}
				</div>
			</div>

			<div className='flex flex-col gap-2'>
				<div>Squad Name</div>
				<input
					className='input-base rounded-lg'
					value={name}
					onChange={changeName}
				/>
			</div>

			<div className='mt-2 flex flex-col gap-2'>
				<div>X Name</div>
				<input
					className='input-base rounded-lg'
					value={xName}
					onChange={changeXName}
				/>
			</div>

			{error && <div className='text-red-500 text-sm mt-2'>{error}</div>}
			{message && <div className='text-blue-500 text-sm mt-2'>{message}</div>}

			<div className='mt-4 flex justify-center'>
				<ButtonPrimary
					className='w-full rounded-lg'
					disabled={isUpdateButtonDisabled()}
					onClick={handleUpdate}
				>
					Update
				</ButtonPrimary>
			</div>
		</div>
	);
};
