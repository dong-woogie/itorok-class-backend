import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ItorokResolver {
  @Query((returns) => String)
  itorok() {
    return 'itorok';
  }

  @Query((returns) => String)
  post() {
    return 'post';
  }
}
