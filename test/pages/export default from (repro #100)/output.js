import { ssrUserPage } from 'lib/ssr_user_page';
import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps } from 'babel-plugin-superjson-next/tools';

export const getServerSideProps = _withSuperJSONProps(ssrUserPage);

import __superjsonDefaultImport from './user';
export default _withSuperJSONPage(__superjsonDefaultImport);
