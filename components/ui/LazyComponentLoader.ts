import { ComponentType } from "react";

// This loader should prevent chunk loading errors
const componentLoader = (lazyComponent: any, attemptsLeft = 3) => {
  return new Promise((resolve, reject) => {
    lazyComponent()
      .then(resolve)
      .catch((error: any) => {
        setTimeout(() => {
          if (attemptsLeft === 1) {
            reject(error);
            return;
          }
          componentLoader(lazyComponent, attemptsLeft - 1).then(resolve, reject);
        }, 1000);
      });
  }) as Promise<{ default: ComponentType<any> }>;
};

export default componentLoader;
