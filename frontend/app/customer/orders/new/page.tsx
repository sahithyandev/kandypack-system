"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { customerAPI, type Product } from "@/lib/customer-api";
import { toast } from "sonner";

interface OrderItem {
	productId: string;
	productName: string;
	unitPrice: number;
	quantity: number;
}

export default function NewOrderPage() {
	const router = useRouter();
	
	const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
	const [deliveryAddress, setDeliveryAddress] = useState("");
	const [requiredDate, setRequiredDate] = useState("");
	const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Load products on component mount
	useEffect(() => {
		const loadProducts = async () => {
			try {
				const products = await customerAPI.getProducts();
				setAvailableProducts(products);
			} catch (error) {
				console.error("Error loading products:", error);
				toast.error("Failed to load products");
			} finally {
				setIsLoading(false);
			}
		};

		loadProducts();
	}, []);

	const addProduct = (product: Product) => {
		const existing = orderItems.find(item => item.productId === product.productId);
		if (existing) {
			setOrderItems(items => 
				items.map(item => 
					item.productId === product.productId 
						? { ...item, quantity: item.quantity + 1 }
						: item
				)
			);
		} else {
			setOrderItems(items => [...items, {
				productId: product.productId,
				productName: product.name,
				unitPrice: product.unitPrice,
				quantity: 1,
			}]);
		}
	};

	const updateQuantity = (productId: string, quantity: number) => {
		if (quantity <= 0) {
			setOrderItems(items => items.filter(item => item.productId !== productId));
		} else {
			setOrderItems(items => 
				items.map(item => 
					item.productId === productId 
						? { ...item, quantity }
						: item
				)
			);
		}
	};

	const getTotalValue = () => {
		return orderItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const orderData = {
				deliveryAddress,
				requiredDeliveryDate: requiredDate,
				items: orderItems.map(item => ({
					productId: item.productId,
					quantity: item.quantity,
				})),
			};

			const result = await customerAPI.createOrder(orderData);
			toast.success(`Order created successfully! Order ID: ${result.orderId}`);
			
			// Redirect to orders page
			router.push("/customer/orders");
		} catch (error) {
			console.error("Error creating order:", error);
			toast.error("Failed to create order. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Get minimum date (7 days from now)
	const getMinDate = () => {
		const date = new Date();
		date.setDate(date.getDate() + 7);
		return date.toISOString().split('T')[0];
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">New Order</h1>
				<p className="text-muted-foreground">Create a new order for delivery</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Order Details</CardTitle>
						<CardDescription>Provide delivery information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="deliveryAddress">Delivery Address</Label>
							<Textarea
								id="deliveryAddress"
								placeholder="Enter full delivery address"
								value={deliveryAddress}
								onChange={(e) => setDeliveryAddress(e.target.value)}
								required
							/>
						</div>
						<div>
							<Label htmlFor="requiredDate">Required Delivery Date</Label>
							<Input
								id="requiredDate"
								type="date"
								min={getMinDate()}
								value={requiredDate}
								onChange={(e) => setRequiredDate(e.target.value)}
								required
							/>
							<p className="text-sm text-muted-foreground mt-1">
								Orders must be placed at least 7 days in advance
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Available Products</CardTitle>
						<CardDescription>Select products to add to your order</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{[1, 2, 3, 4, 5, 6].map((i) => (
									<div key={i} className="border rounded-lg p-4 space-y-3 animate-pulse">
										<div className="h-4 bg-gray-200 rounded w-3/4"></div>
										<div className="h-6 bg-gray-200 rounded w-1/2"></div>
										<div className="h-8 bg-gray-200 rounded"></div>
									</div>
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{availableProducts.map((product) => (
								<div key={product.productId} className="border rounded-lg p-4 space-y-3">
									<div>
										<h3 className="font-semibold">{product.name}</h3>
										<p className="text-lg font-bold text-green-600">
											${product.unitPrice.toFixed(2)}
										</p>
									</div>
									<Button 
										type="button"
										onClick={() => addProduct(product)}
										className="w-full"
										variant="outline"
									>
										<Plus className="w-4 h-4 mr-2" />
										Add to Order
									</Button>
								</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{orderItems.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Order Summary</CardTitle>
							<CardDescription>Review your selected items</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{orderItems.map((item) => (
									<div key={item.productId} className="flex items-center justify-between p-3 border rounded-lg">
										<div>
											<h4 className="font-medium">{item.productName}</h4>
											<p className="text-sm text-muted-foreground">
												${item.unitPrice.toFixed(2)} each
											</p>
										</div>
										<div className="flex items-center gap-3">
											<div className="flex items-center gap-2">
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => updateQuantity(item.productId, item.quantity - 1)}
												>
													<Minus className="w-4 h-4" />
												</Button>
												<span className="w-8 text-center">{item.quantity}</span>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => updateQuantity(item.productId, item.quantity + 1)}
												>
													<Plus className="w-4 h-4" />
												</Button>
											</div>
											<div className="text-right min-w-[80px]">
												<p className="font-bold">
													${(item.unitPrice * item.quantity).toFixed(2)}
												</p>
											</div>
										</div>
									</div>
								))}
								
								<div className="border-t pt-4">
									<div className="flex justify-between items-center text-lg font-bold">
										<span>Total:</span>
										<span>${getTotalValue().toFixed(2)}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				<div className="flex gap-4">
					<Button 
						type="button" 
						variant="outline" 
						onClick={() => router.back()}
					>
						Cancel
					</Button>
					<Button 
						type="submit" 
						disabled={isSubmitting || orderItems.length === 0 || !deliveryAddress || !requiredDate}
					>
						<ShoppingCart className="w-4 h-4 mr-2" />
						{isSubmitting ? "Creating Order..." : "Place Order"}
					</Button>
				</div>
			</form>
		</div>
	);
}