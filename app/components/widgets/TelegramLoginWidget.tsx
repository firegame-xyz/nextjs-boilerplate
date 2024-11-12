import React, { useEffect, useRef } from "react";

interface TelegramUser {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
	photo_url?: string;
	auth_date: number;
	hash: string;
}

interface TelegramLoginWidgetProps {
	botName: string;
	onAuth: (user: TelegramUser) => void;
	buttonSize?: "large" | "medium" | "small";
	cornerRadius?: number;
	requestAccess?: "write" | "read";
}

declare global {
	interface Window {
		TelegramLoginWidget: {
			dataOnauth: (user: TelegramUser) => void;
		};
	}
}

const TelegramLoginWidget: React.FC<TelegramLoginWidgetProps> = ({
	botName,
	onAuth,
	buttonSize = "medium",
	cornerRadius = 5,
	requestAccess = "write",
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://telegram.org/js/telegram-widget.js?22";
		script.setAttribute("data-telegram-login", botName);
		script.setAttribute("data-size", buttonSize);
		script.setAttribute("data-radius", cornerRadius.toString());
		script.setAttribute("data-request-access", requestAccess);
		script.setAttribute("data-userpic", "false");
		script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)");
		script.async = true;

		containerRef.current?.appendChild(script);

		window.TelegramLoginWidget = {
			dataOnauth: (user: TelegramUser) => {
				onAuth(user);
			},
		};

		return () => {
			containerRef.current?.removeChild(script);
		};
	}, [botName, onAuth, buttonSize, cornerRadius, requestAccess]);

	return <div ref={containerRef} />;
};

export default TelegramLoginWidget;
