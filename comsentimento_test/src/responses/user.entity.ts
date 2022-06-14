import { Entity } from "typeorm";

@Entity()
export class ResponseToken{
  token: string;
};

@Entity()
export class User{
  id: string;

  first_name: string;

  last_name: string;

  email: string;

  is_admin: Enumerator;
};
