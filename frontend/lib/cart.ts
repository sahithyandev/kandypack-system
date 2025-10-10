import { mockProducts, type Product } from "./mock-data";

export interface CartItem {
	productId: number;
	product: Product;
	quantity: number;
}

export interface CartState {
	items: CartItem[];
	total: number;
}

export class CartService {
	private static readonly STORAGE_KEY = "kandypack_cart";

	static getCart(): CartState {
		try {
			const cartData = localStorage.getItem(CartService.STORAGE_KEY);
			if (!cartData) {
				return { items: [], total: 0 };
			}

			const cart = JSON.parse(cartData);
			return {
				...cart,
				total: CartService.calculateTotal(cart.items),
			};
		} catch {
			return { items: [], total: 0 };
		}
	}

	static addToCart(productId: number, quantity: number = 1): CartState {
		const product = mockProducts.find((p) => p.id === productId);
		if (!product) {
			throw new Error("Product not found");
		}

		const cart = CartService.getCart();
		const existingItemIndex = cart.items.findIndex(
			(item) => item.productId === productId,
		);

		if (existingItemIndex >= 0) {
			cart.items[existingItemIndex].quantity += quantity;
		} else {
			cart.items.push({
				productId,
				product,
				quantity,
			});
		}

		cart.total = CartService.calculateTotal(cart.items);
		CartService.saveCart(cart);
		return cart;
	}

	static updateQuantity(productId: number, quantity: number): CartState {
		const cart = CartService.getCart();
		const itemIndex = cart.items.findIndex(
			(item) => item.productId === productId,
		);

		if (itemIndex >= 0) {
			if (quantity <= 0) {
				cart.items.splice(itemIndex, 1);
			} else {
				cart.items[itemIndex].quantity = quantity;
			}
		}

		cart.total = CartService.calculateTotal(cart.items);
		CartService.saveCart(cart);
		return cart;
	}

	static removeFromCart(productId: number): CartState {
		const cart = CartService.getCart();
		cart.items = cart.items.filter((item) => item.productId !== productId);
		cart.total = CartService.calculateTotal(cart.items);
		CartService.saveCart(cart);
		return cart;
	}

	static clearCart(): CartState {
		const emptyCart = { items: [], total: 0 };
		CartService.saveCart(emptyCart);
		return emptyCart;
	}

	private static calculateTotal(items: CartItem[]): number {
		return items.reduce(
			(total, item) => total + item.product.price * item.quantity,
			0,
		);
	}

	private static saveCart(cart: CartState): void {
		localStorage.setItem(CartService.STORAGE_KEY, JSON.stringify(cart));
	}
}
