import * as hoistNonReactStatics from 'hoist-non-react-statics';
import type { GetServerSideProps } from 'next';
import * as React from 'react';
import SuperJSON from 'superjson';

type SuperJSONProps<P> = P & {
  _superjson?: ReturnType<typeof SuperJSON.serialize>['meta'];
};

export function withSuperJSONProps<P>(
  gssp: GetServerSideProps<P>,
  exclude: string[] = []
): GetServerSideProps<SuperJSONProps<P>> {
  return async function withSuperJSON(...args) {
    const result = await gssp(...args);

    if (!('props' in result)) {
      return result;
    }

    if (!result.props) {
      return result;
    }

    const excludedPropValues = exclude.map((propKey) => {
      const value = (result.props as any)[propKey];
      delete (result.props as any)[propKey];
      return value;
    });

    const { json, meta } = SuperJSON.serialize(result.props);
    const props = json as any;

    if (meta) {
      props._superjson = meta;
    }

    exclude.forEach((key, index) => {
      const excludedPropValue = excludedPropValues[index];
      if (typeof excludedPropValue !== 'undefined') {
        props[key] = excludedPropValue;
      }
    });

    return {
      ...result,
      props,
    };
  };
}

export function deserializeProps<P>(serializedProps: SuperJSONProps<P>): P {
  const { _superjson, ...props } = serializedProps;
  return SuperJSON.deserialize({ json: props as any, meta: _superjson });
}

export function withSuperJSONPage<P>(
  Page: React.ComponentType<P>
): React.ComponentType<SuperJSONProps<P>> {
  function WithSuperJSON(serializedProps: SuperJSONProps<P>) {
    return <Page {...deserializeProps<P>(serializedProps)} />;
  }

  hoistNonReactStatics(WithSuperJSON, Page);

  return WithSuperJSON;
}
