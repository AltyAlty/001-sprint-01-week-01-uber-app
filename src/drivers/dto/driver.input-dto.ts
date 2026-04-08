import { VehicleFeature } from '../types/driver';

/*DTO для входных данных по водителям.*/
export type DriverInputDto = {
  name: string;
  phoneNumber: string;
  email: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
};
