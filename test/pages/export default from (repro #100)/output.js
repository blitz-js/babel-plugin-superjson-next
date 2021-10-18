import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps } from 'babel-plugin-superjson-next/tools';
import { ssrUserPage } from 'lib/ssr_user_page';
export const getServerSideProps = _withSuperJSONProps(ssrUserPage, ['smth']);
import __superjsonLocalExport from './user';
export default _withSuperJSONPage(__superjsonLocalExport);
