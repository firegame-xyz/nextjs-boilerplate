import { useRouter } from "next/navigation";
import React, {
	useEffect,
	useRef,
	useState,
	forwardRef,
	useImperativeHandle,
} from "react";

import { clx } from "@/app/utils/helpers";

import Portal from "../Portal";

interface Props {
	children?: React.ReactNode;
	className?: string;
	closeButton?: boolean;
	redirect?: boolean;
	show?: boolean;
	title?: string | React.ReactElement | null;
	triggerAlert?: () => void;
}

export interface ModalHandles {
	triggerClose: () => void;
}

export const Modal = React.forwardRef<ModalHandles, Props>(function ModalHandle(
	{
		children,
		className,
		closeButton = true,
		redirect = false,
		show = false,
		title,
	},
	ref,
) {
	useImperativeHandle(ref, () => ({
		triggerClose() {
			animateClosing();
		},
	}));

	const [isOpen, setIsOpen] = useState<boolean>(show);
	const router = useRouter();
	const modalRef = useRef<HTMLDivElement | null>(null);
	const [isAnimating, setIsAnimating] = useState<boolean>(false);
	const animateClosing = () => {
		setIsAnimating(true);
		setTimeout(() => {
			setIsAnimating(false);
			setIsOpen(false);
			redirect && router.back();
		}, 200);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				animateClosing();
			}
		};
		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				animateClosing();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscKey);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscKey);
		};
	}, []);

	const classes = clx("modal-base", className);
	const wrapClassName = clx(
		"wrap-modal-base",
		isOpen && "block",
		isAnimating && "fadeOut",
	);

	return (
		<Portal>
			<div className={wrapClassName}>
				<div className={classes} ref={modalRef}>
					<div className='modal-head'>
						<div>
							<h5 className='font-medium text-base-white'>{title}</h5>
						</div>
						{closeButton && (
							<button className='close-modal' onClick={animateClosing} />
						)}
					</div>
					{children}
				</div>
			</div>
		</Portal>
	);
});
