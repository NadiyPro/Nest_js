import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.res.locals.user;
  },
);
// CurrentUser — це декоратор параметра,
// створений за допомогою функції createParamDecorator.
// createParamDecorator дозволяє створити користувацький декоратор,
// який може передавати дані з HTTP-запиту в метод контролера.
// context.switchToHttp().getRequest() отримує об'єкт request з HTTP-контексту запиту.
// request.res.locals.user — тут зберігається об’єкт користувача,
// який зазвичай додається після аутентифікації.
