import { useEffect, useState } from 'react';

type ImageLoadState = 'loading' | 'loaded' | 'error';

export function useImageLoadState(src: string): ImageLoadState {
  const [imageState, setImageState] = useState<ImageLoadState>(() => (src ? 'loading' : 'error'));

  useEffect(() => {
    if (!src) {
      setImageState('error');
      return;
    }

    let isCancelled = false;
    const image = new Image();

    const handleLoad = () => {
      if (!isCancelled) {
        setImageState('loaded');
      }
    };

    const handleError = () => {
      if (!isCancelled) {
        setImageState('error');
      }
    };

    setImageState('loading');
    image.onload = handleLoad;
    image.onerror = handleError;
    image.src = src;

    if (image.complete) {
      if (image.naturalWidth > 0) {
        handleLoad();
      } else {
        handleError();
      }
    }

    return () => {
      isCancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  return imageState;
}
