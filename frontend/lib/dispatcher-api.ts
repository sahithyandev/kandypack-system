import { AXIOS_INSTANCE } from "./mutator";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PendingOrder {
	orderId: string;
	customerName: string;
	destinationCity: string;
	placedOn: string;
	requiredDeliveryDate: string;
	totalValue: number;
	totalSpaceUnits: number;
}

export interface TrainTrip {
	trainTripId: string;
	trainName: string;
	fromCity: string;
	toCity: string;
	scheduledDeparture: string;
	scheduledArrival: string;
	capacityUnits: number;
	allocatedUnits: number;
	availableUnits: number;
}

export interface CreateShipmentBody {
	orderId: string;
	trainTripId: string;
}

export interface CreateShipmentResponse {
	shipmentId: string;
	orderId: string;
	trainTripId: string;
	status: string;
	message: string;
}

export interface ShipmentAtStore {
	shipmentId: string;
	orderId: string;
	customerName: string;
	deliveryAddress: string;
	routeId: string;
	routeName: string;
}

export interface Worker {
	workerId: string;
	name: string;
}

export interface Truck {
	truckId: string;
	vehicleNo: string;
}

export interface AvailableResources {
	drivers: Worker[];
	assistants: Worker[];
	trucks: Truck[];
}

export interface CreateTruckTripBody {
	shipmentId: string;
	truckId: string;
	routeId: string;
	driverId: string;
	assistantId?: string;
	scheduledStart: string;
	scheduledEnd: string;
}

export interface CreateTruckTripResponse {
	truckTripId: string;
	status: string;
	message: string;
}

export interface TrainTripOverview {
	trainTripId: string;
	trainName: string;
	toCity: string;
	scheduledDeparture: string;
	status: string;
	shipmentCount: number;
}

export interface TruckTripOverview {
	truckTripId: string;
	vehicleNo: string;
	routeName: string;
	driverName: string;
	scheduledStart: string;
	status: string;
}

export interface ScheduleOverview {
	trainTrips: TrainTripOverview[];
	truckTrips: TruckTripOverview[];
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get all pending orders awaiting scheduling
 */
export const getPendingOrders = async (): Promise<PendingOrder[]> => {
	const { data } = await AXIOS_INSTANCE.get<PendingOrder[]>("/api/orders/pending");
	return data;
};

/**
 * Get scheduled train trips with capacity information
 */
export const getTrainTrips = async (destinationCityId?: string): Promise<TrainTrip[]> => {
	const params = destinationCityId ? { destinationCityId } : {};
	const { data } = await AXIOS_INSTANCE.get<TrainTrip[]>("/api/train-trips", { params });
	return data;
};

/**
 * Create a shipment by assigning an order to a train trip
 */
export const createShipment = async (body: CreateShipmentBody): Promise<CreateShipmentResponse> => {
	const { data } = await AXIOS_INSTANCE.post<CreateShipmentResponse>("/api/shipments", body);
	return data;
};

/**
 * Get shipments that have arrived at a store and are ready for truck delivery
 */
export const getShipmentsAtStore = async (storeId?: string): Promise<ShipmentAtStore[]> => {
	const params = storeId ? { storeId } : {};
	const { data } = await AXIOS_INSTANCE.get<ShipmentAtStore[]>("/api/shipments/at-store", { params });
	return data;
};

/**
 * Get all available drivers, assistants, and trucks for scheduling
 */
export const getAvailableResources = async (): Promise<AvailableResources> => {
	const { data } = await AXIOS_INSTANCE.get<AvailableResources>("/api/resources/available");
	return data;
};

/**
 * Schedule a new truck trip
 */
export const createTruckTrip = async (body: CreateTruckTripBody): Promise<CreateTruckTripResponse> => {
	const { data } = await AXIOS_INSTANCE.post<CreateTruckTripResponse>("/api/truck-trips", body);
	return data;
};

/**
 * Get comprehensive overview of all scheduled train and truck trips
 */
export const getScheduleOverview = async (): Promise<ScheduleOverview> => {
	const { data } = await AXIOS_INSTANCE.get<ScheduleOverview>("/api/schedules/overview");
	return data;
};
