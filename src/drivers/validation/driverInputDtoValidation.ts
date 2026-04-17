import { VehicleFeature } from '../types/driver';
import { DriverInputDto } from '../dto/driver.input-dto';
import { ValidationError } from '../types/validationError';

/*Это регулярное выражение проверяет следующее:
1. Есть ли что-то до символа "@" (кроме пробелов и символа "@").
2. Есть ли символ "@".
3. Есть ли что-то после символа "@" (кроме пробелов и символа "@").
4. Есть ли точка.
5. Есть ли что-то после точки (кроме пробелов и символов "@").*/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*Функция для валидации DTO для входных данных по водителям.*/
export const driverInputDtoValidation = (data: DriverInputDto): ValidationError[] => {
  const errors: ValidationError[] = [];

  /*Валидация поля "name".*/
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2 || data.name.trim().length > 15) {
    errors.push({ field: 'name', message: 'Invalid name' });
  }

  /*Валидация поля "phoneNumber".*/
  if (
    !data.phoneNumber ||
    typeof data.phoneNumber !== 'string' ||
    data.phoneNumber.trim().length < 8 ||
    data.phoneNumber.trim().length > 15
  ) {
    errors.push({ field: 'phoneNumber', message: 'Invalid phoneNumber' });
  }

  /*Валидация поля "email".*/
  if (
    !data.email ||
    typeof data.email !== 'string' ||
    data.email.trim().length < 5 ||
    data.email.trim().length > 100 ||
    !EMAIL_REGEX.test(data.email)
  ) {
    errors.push({ field: 'email', message: 'Invalid email' });
  }

  /*Валидация поля "vehicleMake".*/
  if (
    !data.vehicleMake ||
    typeof data.vehicleMake !== 'string' ||
    data.vehicleMake.trim().length < 3 ||
    data.vehicleMake.trim().length > 100
  ) {
    errors.push({ field: 'vehicleMake', message: 'Invalid vehicleMake' });
  }

  /*Валидация поля "vehicleModel".*/
  if (
    !data.vehicleModel ||
    typeof data.vehicleModel !== 'string' ||
    data.vehicleModel.trim().length < 2 ||
    data.vehicleModel.trim().length > 100
  ) {
    errors.push({ field: 'vehicleModel', message: 'Invalid vehicleModel' });
  }

  /*Валидация поля "vehicleYear".*/
  if (!data.vehicleYear || typeof data.vehicleYear !== 'number') {
    errors.push({ field: 'vehicleYear', message: 'Invalid vehicleYear' });
  }

  /*Валидация поля "vehicleLicensePlate".*/
  if (
    !data.vehicleLicensePlate ||
    typeof data.vehicleLicensePlate !== 'string' ||
    data.vehicleLicensePlate.trim().length < 6 ||
    data.vehicleLicensePlate.trim().length > 10
  ) {
    errors.push({
      field: 'vehicleLicensePlate',
      message: 'Invalid vehicleLicensePlate',
    });
  }

  /*Валидация поля "vehicleDescription".*/
  if (
    data.vehicleDescription !== null &&
    (typeof data.vehicleDescription !== 'string' ||
      data.vehicleDescription.trim().length < 10 ||
      data.vehicleDescription.trim().length > 200)
  ) {
    errors.push({
      field: 'vehicleDescription',
      message: 'Invalid vehicleDescription',
    });
  }

  /*Валидация поля "vehicleFeatures".*/
  if (!Array.isArray(data.vehicleFeatures)) {
    errors.push({
      field: 'vehicleFeatures',
      message: 'vehicleFeatures must be array',
    });
  } else if (data.vehicleFeatures.length) {
    const existingFeatures = Object.values(VehicleFeature);

    if (data.vehicleFeatures.length > existingFeatures.length || data.vehicleFeatures.length < 1) {
      errors.push({
        field: 'vehicleFeatures',
        message: 'Invalid vehicleFeatures',
      });
    }

    for (const feature of data.vehicleFeatures) {
      if (!existingFeatures.includes(feature)) {
        errors.push({
          field: 'features',
          message: 'Invalid vehicleFeature:' + feature,
        });

        break;
      }
    }
  }

  return errors;
};
