"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Calendar,
	MapPin,
	Minus,
	Package,
	Plus,
	ShoppingCart,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/lib/auth";
import { CartService, type CartState } from "@/lib/cart";
import {
	mockProducts,
	mockRoutes,
	type Product,
	type Route,
} from "@/lib/mock-data";

const orderSchema = z.object({
	deliveryAddress: z.string().min(10, "Address must be at least 10 characters"),
	routeId: z.string().min(1, "Please select a delivery route"),
	deliveryDate: z.string().min(1, "Please select a delivery date"),
});

export default function PlaceOrderPage() {
	const [cart, setCart] = useState<CartState>({ items: [], total: 0 });
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof orderSchema>>({
		resolver: zodResolver(orderSchema),
		defaultValues: {
			deliveryAddress: "",
			routeId: "",
			deliveryDate: "",
		},
	});

	useEffect(() => {
		setCart(CartService.getCart());
	}, []);

	// Get unique categories
	const categories = [
		"all",
		...Array.from(new Set(mockProducts.map((p) => p.category))),
	];

	// Filter products by category
	const filteredProducts =
		selectedCategory === "all"
			? mockProducts
			: mockProducts.filter((p) => p.category === selectedCategory);

	// Calculate minimum delivery date (7 days from now)
	const minDeliveryDate = new Date();
	minDeliveryDate.setDate(minDeliveryDate.getDate() + 7);
	const minDateString = minDeliveryDate.toISOString().split("T")[0];

	const addToCart = (productId: number) => {
		const newCart = CartService.addToCart(productId, 1);
		setCart(newCart);
	};

	const updateQuantity = (productId: number, quantity: number) => {
		const newCart = CartService.updateQuantity(productId, quantity);
		setCart(newCart);
	};

	const removeFromCart = (productId: number) => {
		const newCart = CartService.removeFromCart(productId);
		setCart(newCart);
	};

	const getCartItemQuantity = (productId: number): number => {
		const item = cart.items.find((item) => item.productId === productId);
		return item ? item.quantity : 0;
	};

	const onSubmit = async (data: z.infer<typeof orderSchema>) => {
		if (cart.items.length === 0) {
			alert("Please add items to your cart before placing an order");
			return;
		}

		setIsSubmitting(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Generate order ID
			const orderId = `ORD${String(Date.now()).slice(-6)}`;

			// Clear cart
			CartService.clearCart();
			setCart({ items: [], total: 0 });

			// Redirect with success message
			router.push(`/dashboard/orders?success=true&orderId=${orderId}`);
		} catch (error) {
			alert("Failed to place order. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const formatCurrency = (amount: number) => {
		return `Rs. ${amount.toLocaleString()}`;
	};

	const formatCategory = (category: string) => {
		return category
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	return (
		<div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Place New Order</h1>
					<p className="">Browse products and add them to your cart</p>
				</div>
				<Button onClick={() => setIsCartOpen(!isCartOpen)} className="relative">
					<ShoppingCart className="h-4 w-4 mr-2" />
					Cart ({cart.items.length})
					{cart.items.length > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
						>
							{cart.items.reduce((sum, item) => sum + item.quantity, 0)}
						</Badge>
					)}
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Product Catalog */}
				<div className="lg:col-span-3 space-y-6">
					{/* Category Filter */}
					<Card>
						<CardHeader>
							<CardTitle>Categories</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{categories.map((category) => (
									<Button
										key={category}
										variant={
											selectedCategory === category ? "default" : "outline"
										}
										size="sm"
										onClick={() => setSelectedCategory(category)}
									>
										{formatCategory(category)}
									</Button>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Product Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						{filteredProducts.map((product) => {
							const cartQuantity = getCartItemQuantity(product.id);

							return (
								<Card
									key={product.id}
									className="hover:shadow-md transition-shadow"
								>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<CardTitle className="text-lg">
													{product.name}
												</CardTitle>
												<CardDescription className="capitalize">
													{formatCategory(product.category)}
												</CardDescription>
											</div>
											<Badge
												variant={product.stock > 10 ? "default" : "destructive"}
											>
												{product.stock > 0
													? `${product.stock} in stock`
													: "Out of stock"}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<span className="text-2xl font-bold text-blue-600">
													{formatCurrency(product.price)}
												</span>
											</div>

											{cartQuantity > 0 ? (
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-2">
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																updateQuantity(product.id, cartQuantity - 1)
															}
														>
															<Minus className="h-3 w-3" />
														</Button>
														<span className="font-medium w-8 text-center">
															{cartQuantity}
														</span>
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																updateQuantity(product.id, cartQuantity + 1)
															}
															disabled={cartQuantity >= product.stock}
														>
															<Plus className="h-3 w-3" />
														</Button>
													</div>
													<Button
														size="sm"
														variant="destructive"
														onClick={() => removeFromCart(product.id)}
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											) : (
												<Button
													className="w-full"
													onClick={() => addToCart(product.id)}
													disabled={product.stock === 0}
												>
													<Plus className="h-4 w-4 mr-2" />
													Add to Cart
												</Button>
											)}
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>

				{/* Cart Sidebar */}
				<div
					className={`lg:col-span-1 ${isCartOpen ? "block" : "hidden lg:block"}`}
				>
					<Card className="sticky top-6">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center space-x-2">
									<ShoppingCart className="h-5 w-5" />
									<span>Shopping Cart</span>
								</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									className="lg:hidden"
									onClick={() => setIsCartOpen(false)}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{cart.items.length === 0 ? (
								<p className="text-center text-gray-500 py-8">
									Your cart is empty
								</p>
							) : (
								<>
									{/* Cart Items */}
									<div className="space-y-3 max-h-60 overflow-y-auto">
										{cart.items.map((item) => (
											<div
												key={item.productId}
												className="flex items-center justify-between p-2 border rounded"
											>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium truncate">
														{item.product.name}
													</p>
													<p className="text-xs text-gray-500">
														{formatCurrency(item.product.price)} ×{" "}
														{item.quantity}
													</p>
												</div>
												<div className="flex items-center space-x-1">
													<span className="text-sm font-medium">
														{formatCurrency(item.product.price * item.quantity)}
													</span>
													<Button
														size="sm"
														variant="ghost"
														onClick={() => removeFromCart(item.productId)}
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											</div>
										))}
									</div>

									{/* Cart Total */}
									<div className="border-t pt-4">
										<div className="flex items-center justify-between font-bold">
											<span>Total:</span>
											<span className="text-lg text-blue-600">
												{formatCurrency(cart.total)}
											</span>
										</div>
									</div>

									{/* Order Form */}
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className="space-y-4"
										>
											<FormField
												control={form.control}
												name="deliveryAddress"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="flex items-center space-x-1">
															<MapPin className="h-4 w-4" />
															<span>Delivery Address</span>
														</FormLabel>
														<FormControl>
															<textarea
																className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
																placeholder="Enter full delivery address"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="routeId"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Delivery Route</FormLabel>
														<FormControl>
															<select
																className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
																{...field}
															>
																<option value="">Select route</option>
																{mockRoutes.map((route) => (
																	<option key={route.id} value={route.id}>
																		{route.name} ({route.city}) -{" "}
																		{route.maxDeliveryTime}
																	</option>
																))}
															</select>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="deliveryDate"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="flex items-center space-x-1">
															<Calendar className="h-4 w-4" />
															<span>Delivery Date</span>
														</FormLabel>
														<FormControl>
															<Input
																type="date"
																min={minDateString}
																{...field}
															/>
														</FormControl>
														<FormMessage />
														<p className="text-xs text-gray-500">
															Orders must be placed at least 7 days in advance
														</p>
													</FormItem>
												)}
											/>

											<Button
												type="submit"
												className="w-full"
												disabled={isSubmitting || cart.items.length === 0}
											>
												{isSubmitting ? (
													"Placing Order..."
												) : (
													<>
														<Package className="h-4 w-4 mr-2" />
														Place Order ({formatCurrency(cart.total)})
													</>
												)}
											</Button>
										</form>
									</Form>
								</>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
