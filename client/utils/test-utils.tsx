import React, { useEffect, useState } from "react";
import { render as defaultRender } from "@testing-library/react";
import { createMemoryHistory, Location } from "history";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

export * from "@testing-library/react";

// --------------------------------------------------
// Override the default test render with our own
//
// You can override the router mock like this:
//
// const { baseElement } = render(<MyComponent />, {
//   router: { pathname: '/my-custom-pathname' },
// });
// --------------------------------------------------
type DefaultParams = Parameters<typeof defaultRender>;
type RenderUI = DefaultParams[0];
type RenderOptions = DefaultParams[1] & { router?: Partial<NextRouter> };

const history = createMemoryHistory();

const History: React.FC<{
  children: (router: NextRouter) => React.ReactNode;
}> = (props) => {
  const [location, setLocation] = useState(history.location);
  const mockRouter: NextRouter = {
    isLocaleDomain: true,
    isPreview: false,
    basePath: "",
    pathname: location.pathname,
    route: "/",
    asPath: "/",
    query: (location as any).query || {},
    push: history.push as any,
    replace: history.replace as any,
    reload: jest.fn(),
    back: history.back,
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isReady: true,
  };
  useEffect(() => {
    const unlisten = history.listen((listener) => {
      setLocation(listener.location);
    });
    return unlisten;
  }, []);
  return <>{props.children(mockRouter)}</>;
};

export function render(
  ui: RenderUI,
  { wrapper, router, ...options }: RenderOptions = {}
) {
  if (!wrapper) {
    wrapper = ({ children }) => (
      <History>
        {(mockRouter) => (
          <RouterContext.Provider value={{ ...mockRouter, ...router }}>
            {children}
          </RouterContext.Provider>
        )}
      </History>
    );
  }

  return {
    ...defaultRender(ui, { wrapper, ...options }),
  };
}
