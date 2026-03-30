import { env } from '@/lib/env/env';
import { queryCachePersistOptions, queryCachePersister } from '@/app/query/query-persistence';
import { queryClient } from '@/app/query/query-client';
import { LoadingState } from '@/components/ui/LoadingState';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { type ReactNode, Suspense, lazy } from 'react';

const ReactQueryDevtools = lazy(async () => {
  const module = await import('@tanstack/react-query-devtools');

  return { default: module.ReactQueryDevtools };
});

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const content = (
    <>
      {children}
      {import.meta.env.DEV && env.enableQueryDevtools ? (
        <Suspense fallback={<LoadingState className="sr-only" label="Loading developer tools" />}>
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </Suspense>
      ) : null}
    </>
  );

  if (queryCachePersister) {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: queryCachePersister,
          ...queryCachePersistOptions,
        }}
      >
        {content}
      </PersistQueryClientProvider>
    );
  }

  return <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>;
}
