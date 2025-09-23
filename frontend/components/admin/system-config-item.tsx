"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ConfigType = "number-input";

interface Option {
	type: ConfigType;
	value: number;
}

interface ReportGeneratorControlProps {
	title: string;
	description?: string;
	options?: Option[];
}

export default function SystemConfigItem({
	title,
	description,
	options,
}: ReportGeneratorControlProps) {
	return (
		<div className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto_auto] w-full">
			<h3 className="col-start-1 row-start-1 text-lg font-semibold">{title}</h3>
			<p className="col-start-1 row-start-2 max-w-prose">{description}</p>
			{options && options.length > 0 ? (
				<div className="col-start-1 row-start-3">
					{options.map((option) => {
						if (option.type === "number-input") {
							return (
								<Input
									key={option.type}
									type="number"
									defaultValue={option.value}
									className="mt-2 w-[200px]"
								/>
							);
						}
					})}
				</div>
			) : null}
			<Button
				size="icon"
				className="cursor-pointer col-start-2 row-span-full my-auto"
			>
				<Check />
			</Button>
		</div>
	);
}
