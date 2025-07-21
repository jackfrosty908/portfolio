"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/client/utils/trpc";

const HealthCheck = () => {
	const healthCheck = useQuery(trpc.healthCheck.queryOptions());

	return (
		<div className="flex items-center gap-2">
			<div
				className={`h-2 w-2 rounded-full ${
					healthCheck.data ? "bg-green-500" : "bg-red-500"
				}`}
			/>
			<span className="text-muted-foreground text-sm">
				{healthCheck.isLoading
					? "Checking..."
					: healthCheck.data
						? "Connected"
						: "Disconnected"}
			</span>
		</div>
	);
};

export default HealthCheck;
