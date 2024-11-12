import React from "react";

import { clx } from "@/app/utils/helpers";

interface TitleProps {
	children?: React.ReactNode;
	className?: string;
	title: string;
}

interface Props {
	children?: React.ReactNode;
	className?: string;
	icon?: React.ReactNode;
	title: string;
}

export const NotificationTitle: React.FC<Props> = ({
	children,
	className,
	icon,
	title,
}) => {
	return (
		<div className={clx("flex items-center gap-x-2", className)}>
			{icon} <span>{title}</span>
			{children}
		</div>
	);
};

export const ErrorTitle: React.FC<TitleProps> = ({
	children,
	className,
	title = "Error detected",
}) => {
	return (
		<NotificationTitle title={title} className={className}>
			{children}
		</NotificationTitle>
	);
};

export const SuccessTitle: React.FC<TitleProps> = ({
	children,
	className,
	title,
}) => {
	return (
		<NotificationTitle title={title} className={className}>
			{children}
		</NotificationTitle>
	);
};

export const InfoTitle: React.FC<TitleProps> = ({
	children,
	className,
	title,
}) => {
	return (
		<NotificationTitle title={title} className={className}>
			{children}
		</NotificationTitle>
	);
};

export const WarningTitle: React.FC<TitleProps> = ({
	children,
	className,
	title,
}) => {
	return (
		<NotificationTitle title={title} className={className}>
			{children}
		</NotificationTitle>
	);
};

export const InProgressTitle: React.FC<TitleProps> = ({
	children,
	className,
	title,
}) => {
	return (
		<NotificationTitle title={title} className={className}>
			{children}
		</NotificationTitle>
	);
};
