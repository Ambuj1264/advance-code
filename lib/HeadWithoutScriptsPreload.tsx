import { Head } from "next/document";

class HeadWithoutScriptsPreload extends Head {
  // eslint-disable-next-line class-methods-use-this
  getPreloadDynamicChunks() {
    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  getPreloadMainLinks() {
    return [];
  }

  render() {
    this.context = { ...this.context, disableOptimizedLoading: true };
    return super.render();
  }
}

export default HeadWithoutScriptsPreload;
