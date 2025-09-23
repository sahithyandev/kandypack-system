"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Pen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type MaximumWorkingHoursEntry = {
	appliesFor: string;
	weeklyMax: number;
};

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="overflow-hidden rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

interface EditProps {
	selectedItem: MaximumWorkingHoursEntry | null;
	onClose: () => void;
	onFinished?: () => void;
	isOpen: boolean;
}

const editSchema = z.object({
	weeklyMax: z
		.number()
		.min(1, "Must be at least 1 hour")
		.max(100, "Cannot exceed 100 hours"),
});

function Edit({ isOpen, selectedItem, onClose, onFinished }: EditProps) {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof editSchema>>({
		resolver: zodResolver(editSchema),
		defaultValues: { weeklyMax: selectedItem?.weeklyMax || 40 },
	});

	function onSubmit(values: z.infer<typeof editSchema>) {
		console.log(values);
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={() => (selectedItem === null ? null : onClose())}
		>
			<DialogContent className="sm:max-w-xl w-full">
				<DialogHeader>
					<DialogTitle>Edit Maximum Working Hours</DialogTitle>
					{selectedItem === null ? null : (
						<DialogDescription className="mb-2 max-w-prose">
							You are editing the weekly maximum working hours for{" "}
							<b>{selectedItem.appliesFor}</b>.
						</DialogDescription>
					)}
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="weeklyMax"
							render={({ field }) => (
								<FormItem className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-0 items-center mb-4">
									<FormLabel className="cursor-pointer font-semibold text-base">
										Weekly Max
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											className="col-start-2 row-span-full"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Only approved members can login.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="ml-auto"
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Loading..." : "Save"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default function MaximumWorkingHours() {
	const [selectedEntry, setSelectedEntry] =
		useState<MaximumWorkingHoursEntry | null>(null);
	const [action, setAction] = useState<"edit" | null>(null);

	const columns: ColumnDef<MaximumWorkingHoursEntry>[] = [
		{
			id: "appliesFor",
			accessorFn: (row) =>
				row.appliesFor.replace(/^\w/, (c) => c.toUpperCase()),
			header: "Applies For",
		},
		{
			accessorKey: "weeklyMax",
			header: "Max (per week)",
		},
		{
			header: "Actions",
			cell: (row) => {
				return (
					<div>
						<Button
							size="icon"
							variant="outline"
							className="cursor-pointer"
							onClick={() => {
								setSelectedEntry(row.row.original);
								setAction("edit");
							}}
						>
							<Pen className="size-4" />
						</Button>
					</div>
				);
			},
		},
	];
	return (
		<section>
			<h2 className="text-xl font-semibold mb-2">Maximum Working Hours</h2>
			<DataTable
				columns={columns}
				data={[
					{
						appliesFor: "driver",
						weeklyMax: 40,
					},
					{
						appliesFor: "assistant",
						weeklyMax: 60,
					},
				]}
			/>
			<Edit
				selectedItem={selectedEntry}
				onClose={() => {
					setSelectedEntry(null);
					setAction(null);
				}}
				isOpen={action === "edit" && selectedEntry !== null}
			/>
		</section>
	);
}
