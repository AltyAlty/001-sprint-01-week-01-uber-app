import { ValidationError } from '../../drivers/types/validationError';

/*Функция для формирования объекта, содержащего массив с сообщениями об ошибках валидации.*/
export const createErrorMessages = (
  errors: ValidationError[],
): { errorMessages: ValidationError[] } => {
  return { errorMessages: errors };
};
