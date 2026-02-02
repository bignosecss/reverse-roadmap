export interface UserDto {
  _id: string;
  username: string;
  password: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  email?: string;
}
