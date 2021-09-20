import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps } from 'babel-plugin-superjson-next/tools';
export const getServerSideProps = _withSuperJSONProps(
  withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  })(async ({ AuthUser }) => {
    // ...
    return {
      props,
    };
  }),
  ['smth']
);
export default _withSuperJSONPage(withAuthUser()(Component));