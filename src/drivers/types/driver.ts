/*Тип для списка фич машин.*/
export enum VehicleFeature {
  WiFi = 'wi-fi',
  ChildSeat = 'child-seat',
  PetFriendly = 'pet-friendly',
}

/*Тип для водителей.*/
export type Driver = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
  createdAt: Date;
};
