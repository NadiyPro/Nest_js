export class UserBaseResDto {
  id: string;
  name: string;
  email: string;
  bio?: string;
  image?: string;
  isFollowed?: boolean; // підписка на автора поста
}
