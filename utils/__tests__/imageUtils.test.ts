import {
  getImgixImageId,
  formatImagesForSEOmeta,
  getImagesWithoutSize,
  updateImageNameInUrl,
  replaceImageWithPicture,
  parseFirstImageAttributes,
  constructImgixUrl,
  addAspectRatioForLazyImageWrapper,
} from "../imageUtils";

import { imageLoadingPixel } from "components/ui/utils/uiUtils";

describe("getImgixImageId", () => {
  test("should parse 4950 form https://guidetoiceland.imgix.net/4950", () => {
    expect(getImgixImageId("https://guidetoiceland.imgix.net/4950")).toBe("4950");
  });

  test("should parse 5061 form https://guidetoiceland.imgix.net/5061/x/0/", () => {
    expect(getImgixImageId("https://guidetoiceland.imgix.net/5061/x/0/")).toBe("5061");
  });

  test("should parse 50611784 form https://guidetoiceland.imgix.net/50611784/x/0/caves-in-the-iceland", () => {
    expect(
      getImgixImageId("https://guidetoiceland.imgix.net/50611784/x/0/caves-in-the-iceland")
    ).toBe("50611784");
  });

  test("should return undefined if url is not imgix.net like", () => {
    expect(
      getImgixImageId("https://guidetoiceland.net/50611784/x/0/caves-in-the-iceland")
    ).toBeUndefined();
    expect(getImgixImageId("https://50611784/x/0/caves-in-the-iceland")).toBeUndefined();
    expect(getImgixImageId("https://guidetoiceland.imgix/4950")).toBeUndefined();
    expect(getImgixImageId("https://guidetoiceland.imagx.net/5061/x/0/")).toBeUndefined();
  });
});

describe("getImagesWithoutSize", () => {
  test("get images where h and w have been removed from the image urls", () => {
    const images = [
      {
        id: "50611784",
        url: "https://50611784/x/0?w=300&h=200",
        name: "Caves in the iceland",
      },
      {
        id: "5061",
        url: "https://50611784/x/0?w=200",
        name: "Summer Iceland.",
      },
      {
        id: "5061",
        url: "https://50611784/x/0?h=804",
        name: "Summer Iceland.",
      },
      {
        id: "5061",
        url: "https://50611784/x/0?arrow=300",
        name: "Summer Iceland.",
      },
      {
        id: "5061",
        url: "https://50611784/x/0?w=300&arrow=300",
        name: "Summer Iceland.",
      },
    ];
    const imagesWithoutSize = [
      {
        id: "50611784",
        url: "https://50611784/x/0?",
        name: "Caves in the iceland",
      },
      {
        id: "5061",
        url: "https://50611784/x/0?",
        name: "Summer Iceland.",
      },
      {
        id: "5061",
        url: "https://50611784/x/0?",
        name: "Summer Iceland.",
      },
      {
        id: "5061",
        url: "https://50611784/x/0?arrow=300",
        name: "Summer Iceland.",
      },
      {
        id: "5061",
        url: "https://50611784/x/0?arrow=300",
        name: "Summer Iceland.",
      },
    ];
    expect(getImagesWithoutSize(images)).toEqual(imagesWithoutSize);
  });
});

describe("updateImageNameInUrl", () => {
  test("update the file name in the image url if the url doesn't have it", () => {
    // no name in url, should add it
    expect(
      updateImageNameInUrl({
        id: "50611784",
        url: "https://50611784/x/0/",
        name: "Caves in the iceland",
      })
    ).toEqual({
      id: "50611784",
      url: "https://50611784/x/0/caves-in-the-iceland",
      name: "Caves in the iceland",
    });

    // no name in url, but has params, should add name without affecting params
    expect(
      updateImageNameInUrl({
        id: "50611784",
        url: "https://50611784/x/0/?w=300&h=200",
        name: "Caves in the iceland",
      })
    ).toEqual({
      id: "50611784",
      url: "https://50611784/x/0/caves-in-the-iceland?w=300&h=200",
      name: "Caves in the iceland",
    });

    // has name, shouldn't change anything
    expect(
      updateImageNameInUrl({
        id: "50611784",
        url: "https://50611784/x/0/caves?w=300&h=200",
        name: "Caves in the iceland",
      })
    ).toEqual({
      id: "50611784",
      url: "https://50611784/x/0/caves?w=300&h=200",
      name: "Caves in the iceland",
    });

    // if url has unexpected (not imgix like) format we don't modify it
    expect(
      updateImageNameInUrl({
        id: "50611784",
        url: "https://50611784/x/0caves?w=300&h=200",
        name: "Caves in the iceland",
      })
    ).toEqual({
      id: "50611784",
      url: "https://50611784/x/0caves?w=300&h=200",
      name: "Caves in the iceland",
    });
  });
});

describe("formatImagesForSEOmeta", () => {
  test("Should insert name of the file if there is no filename in the url and params for Google Discovery feed", () => {
    const images = [
      {
        id: "50611784",
        url: "https://50611784.com/x/0/",
        name: "Caves in the iceland",
      },
      {
        id: "5061",
        url: "https://50611784.com/x/0/",
        name: "Summer Iceland.",
      },
    ];

    const metaImages = formatImagesForSEOmeta(images);
    expect(metaImages[0].url).toBe(
      "https://50611784.com/x/0/caves-in-the-iceland?ar=1.91%3A1&w=1200&fit=crop"
    );
    expect(metaImages[1].url).toBe(
      "https://50611784.com/x/0/summer-iceland?ar=1.91%3A1&w=1200&fit=crop"
    );
  });
});

describe("parseFirstImageAttribute", () => {
  const imageSrc = "image source";
  const imageAlt = "image alt text";
  const imageTitle = "image title text";
  const imageWidth = "883";
  const imageHeight = "605";

  test("should parse first image attributes", () => {
    const htmlValue = `<div>Test text<img src="${imageSrc}"  title="${imageTitle}" alt="${imageAlt}" width="${imageWidth}" height="${imageHeight}"/><p>Lorem imsum text<img src="https://guidetoiceland.imgix.net/53535/34" alt="Alt text" title="title text"/></p></div>`;

    expect(parseFirstImageAttributes(htmlValue)).toEqual({
      imageSrc,
      imageAlt,
      imageTitle,
      imageWidth,
      imageHeight,
    });
  });

  test("should parse first image attributes (only src)", () => {
    const htmlValue = `<div>Test text<img src="${imageSrc}" /><p>Lorem imsum text<img src="https://guidetoiceland.imgix.net/53535/34" alt="Alt text" title="title text"/></p></div>`;

    expect(parseFirstImageAttributes(htmlValue)).toEqual({
      imageSrc,
      imageAlt: "",
      imageTitle: "",
      imageWidth: "",
      imageHeight: "",
    });
  });

  test("should parse html without image", () => {
    const htmlValue = `<div>Test text<p>Test paragraph</p></div>`;

    expect(parseFirstImageAttributes(htmlValue)).toEqual({
      imageSrc: "",
      imageAlt: "",
      imageTitle: "",
      imageWidth: "",
      imageHeight: "",
    });
  });
});

describe("replaceImageWithPicture", () => {
  const imageSrc = imageLoadingPixel;
  const imageTitle = "Image title";
  const imageAlt = "Image alt";
  const imageWidth = "883";
  const imageHeight = "605";

  test("should replace image with picture in html widget", () => {
    const pictureSource =
      "https://guidetoiceland.imgix.net/519503/x/0/lohnt-sich-ein-besuch-der-blauen-lagune-auf-island-2.jpg?auto=compress";

    const htmlValue = `<div class="x-8agq6r e1q7jrc70"><p>Lorem ipsum, text here</p><img alt="Der Kontrast der Farben des Wassers der Blauen Lagune und der moosbedeckten Lave auf Island - Guide to Iceland" width="883" height="588" src="${pictureSource}" title="Der Kontrast der Farben des Wassers der Blauen Lagune und der moosbedeckten Lave auf Island - Guide to Iceland"><div>Lorem ipsum</div><img alt="Der Kontrast der Farben des Wassers der Blauen Lagune und der moosbedeckten Lave auf Island - Guide to Iceland" width="883" height="588" src="https://guidetoiceland.imgix.net/53535/34" title="Der Kontrast der Farben des Wassers der Blauen Lagune und der moosbedeckten Lave auf Island - Guide to Iceland"><p>Text after image</p></div>`;

    const resultHtlm = `<div class="x-8agq6r e1q7jrc70"><p>Lorem ipsum, text here</p><picture><source srcset="${pictureSource}" media="(min-width: 720px)" /><img src="${imageSrc}" alt="${imageAlt}" title="${imageTitle}" width="${imageWidth}" height="${imageHeight}" data-src="${pictureSource}"/></picture><div>Lorem ipsum</div><img alt="Der Kontrast der Farben des Wassers der Blauen Lagune und der moosbedeckten Lave auf Island - Guide to Iceland" width="883" height="588" src="https://guidetoiceland.imgix.net/53535/34" title="Der Kontrast der Farben des Wassers der Blauen Lagune und der moosbedeckten Lave auf Island - Guide to Iceland"><p>Text after image</p></div>`;

    expect(
      replaceImageWithPicture({
        htmlValue,
        imageSrc,
        imageAlt,
        imageTitle,
        pictureSource,
        imageWidth,
        imageHeight,
      })
    ).toBe(resultHtlm);
  });

  test("should return the same html if source don't have `img` tag", () => {
    const pictureSource =
      "https://guidetoiceland.imgix.net/519503/x/0/lohnt-sich-ein-besuch-der-blauen-lagune-auf-island-2.jpg?auto=compress";

    const htmlValue = `<div class="x-8agq6r e1q7jrc70"><p>Lorem ipsum, text here</p><p>Text after image</p></div>`;

    expect(
      replaceImageWithPicture({
        htmlValue,
        imageSrc,
        imageAlt,
        imageTitle,
        pictureSource,
        imageWidth,
        imageHeight,
      })
    ).toBe(htmlValue);
  });
});

describe("constructImgix for base64 converting", () => {
  const imageUrl = "https://guidetoiceland.imgix.net/380401/x/0/image.jpg";

  test("should return empty result for incorrect URL", () => {
    expect(
      constructImgixUrl({
        imageUrl: "",
      })
    ).toBe("");

    expect(
      constructImgixUrl({
        imageUrl: "testimageurl",
      })
    ).toBe("");

    expect(
      constructImgixUrl({
        imageUrl: "http:/imgix/",
      })
    ).toBe("");
  });

  test("should return empty result for relative URL", () => {
    expect(
      constructImgixUrl({
        imageUrl: "/image.jpg",
      })
    ).toBe("");
  });

  test("should return imgix url for http URL", () => {
    expect(
      constructImgixUrl({
        imageUrl: "http://guidetoiceland.imgix.net/380401/x/0/image.jpg",
      })
    ).toBe(
      `http://guidetoiceland.imgix.net/380401/x/0/image.jpg?w=360&h=400&fit=crop&crop=faces,entropy,center&auto=format,compress&q=10&blur=15&dpr=2`
    );
  });

  test("should return imgix url with default parameters", () => {
    expect(
      constructImgixUrl({
        imageUrl,
      })
    ).toBe(
      `${imageUrl}?w=360&h=400&fit=crop&crop=faces,entropy,center&auto=format,compress&q=10&blur=15&dpr=2`
    );
  });

  test("should return imgix url with default parameters", () => {
    const imageUrlWithQueryParams = `${imageUrl}?param1=test&param2=123`;

    expect(
      constructImgixUrl({
        imageUrl: imageUrlWithQueryParams,
      })
    ).toBe(
      `${imageUrl}?w=360&h=400&fit=crop&crop=faces,entropy,center&auto=format,compress&q=10&blur=15&dpr=2`
    );
  });

  test("should return imgix url with given height", () => {
    expect(
      constructImgixUrl({
        imageUrl,
        imageHeight: 666,
      })
    ).toBe(
      `${imageUrl}?w=360&h=666&fit=crop&crop=faces,entropy,center&auto=format,compress&q=10&blur=15&dpr=2`
    );
  });

  test("should return imgix url with given quality", () => {
    expect(
      constructImgixUrl({
        imageUrl,
        imageQuality: 20,
      })
    ).toBe(
      `${imageUrl}?w=360&h=400&fit=crop&crop=faces,entropy,center&auto=format,compress&q=20&blur=15&dpr=2`
    );
  });

  test("should return imgix url with given blur", () => {
    expect(
      constructImgixUrl({
        imageUrl,
        imageBlur: 20,
      })
    ).toBe(
      `${imageUrl}?w=360&h=400&fit=crop&crop=faces,entropy,center&auto=format,compress&q=10&blur=20&dpr=2`
    );
  });

  test("should return imgix url with jpg format for gif", () => {
    const gifImageUrl = "https://guidetoiceland.imgix.net/380401/x/0/image.gif";

    expect(
      constructImgixUrl({
        imageUrl: gifImageUrl,
        imageBlur: 20,
      })
    ).toBe(
      `${gifImageUrl}?w=360&h=400&fit=crop&crop=faces,entropy,center&auto=format,compress&q=10&blur=20&dpr=2&fm=jpeg`
    );
  });
});

describe("addAspectRatioForLazyImageWrapper", () => {
  test("should return the same html if lazy load container not passed", () => {
    const htmlValue = "<div>Test</div>";

    expect(addAspectRatioForLazyImageWrapper(htmlValue)).toEqual(htmlValue);

    const htmlValueWithImage =
      "<div>Test<img alt='Les aurores' height='588' src='https://guidetoiceland.imgix.net/4704/x/0/' width='883' class='lazyload' title='Les'/></div>";

    expect(addAspectRatioForLazyImageWrapper(htmlValueWithImage)).toEqual(htmlValueWithImage);

    const emptyHtmlValue = "";

    expect(addAspectRatioForLazyImageWrapper(emptyHtmlValue)).toEqual(emptyHtmlValue);
  });

  test("should return the same html if images has wrong height or width", () => {
    const htmlValueWithImageZeroWidth =
      "<div>Test<img alt='Les aurores' height='588' src='https://guidetoiceland.imgix.net/4704/x/0/' width='0' class='lazyload' title='Les'/></div>";

    expect(addAspectRatioForLazyImageWrapper(htmlValueWithImageZeroWidth)).toEqual(
      htmlValueWithImageZeroWidth
    );

    const htmlValueWithImageZeroHeight =
      "<div>Test<img alt='Les aurores' height='0' src='https://guidetoiceland.imgix.net/4704/x/0/' width='123' class='lazyload' title='Les'/></div>";

    expect(addAspectRatioForLazyImageWrapper(htmlValueWithImageZeroHeight)).toEqual(
      htmlValueWithImageZeroHeight
    );

    const htmlValueWithWrongImageSizes =
      "<div>Test<img alt='Les aurores' height='' src='https://guidetoiceland.imgix.net/4704/x/0/' width='' class='lazyload' title='Les'/></div>";

    expect(addAspectRatioForLazyImageWrapper(htmlValueWithWrongImageSizes)).toEqual(
      htmlValueWithWrongImageSizes
    );

    const htmlValueWithoutImageSizes =
      "<div>Test<img alt='Les aurores' src='https://guidetoiceland.imgix.net/4704/x/0/' class='lazyload' title='Les'/></div>";

    expect(addAspectRatioForLazyImageWrapper(htmlValueWithoutImageSizes)).toEqual(
      htmlValueWithoutImageSizes
    );
  });

  test("should add aspect ratio for image wrapper", () => {
    const htmlValue = `<a href="https://guidetoiceland.is/fr/les-aurores-boreales">les aurores boréales en Islande</a></li></ul><hr><p><span class="lazyContainer" style="display: block;"><img alt="image1" height="588" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/eZ3PQAJLwNj1W9/OwAAAABJRU5ErkJggg==" width="883" data-src="https://guidetoiceland.imgix.net/4704/x/1" class="lazyload" title="image1"><noscript><img alt="Les aurores polaires en Islande sans paysage enneig&eacute;" height="588" src="https://guidetoiceland.imgix.net/4704/x/0/" width="883" class="lazyload" title="Les aurores polaires en Islande sans paysage enneig&eacute;"></noscript></span> <p>Lorem ipsum</p> <span class="lazyContainer" style="display: block;"><img alt="image2" height="250" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/eZ3PQAJLwNj1W9/OwAAAABJRU5ErkJggg==" width="883" data-src="https://guidetoiceland.imgix.net/5555/x/0/33-photos-des-aurores-boreales-en-islande-2?auto=compress" class="lazyload" title="image2"></span></p>`;

    expect(addAspectRatioForLazyImageWrapper(htmlValue)).toEqual(
      `<a href="https://guidetoiceland.is/fr/les-aurores-boreales">les aurores boréales en Islande</a></li></ul><hr><p><span class="lazyContainer" style="display: block; padding-bottom: 66.5911664779162%"><img alt="image1" height="588" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/eZ3PQAJLwNj1W9/OwAAAABJRU5ErkJggg==" width="883" data-src="https://guidetoiceland.imgix.net/4704/x/1" class="lazyload" title="image1"><noscript><img alt="Les aurores polaires en Islande sans paysage enneig&eacute;" height="588" src="https://guidetoiceland.imgix.net/4704/x/0/" width="883" class="lazyload" title="Les aurores polaires en Islande sans paysage enneig&eacute;"></noscript></span> <p>Lorem ipsum</p> <span class="lazyContainer" style="display: block; padding-bottom: 28.312570781426956%"><img alt="image2" height="250" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/eZ3PQAJLwNj1W9/OwAAAABJRU5ErkJggg==" width="883" data-src="https://guidetoiceland.imgix.net/5555/x/0/33-photos-des-aurores-boreales-en-islande-2?auto=compress" class="lazyload" title="image2"></span></p>`
    );
  });
});
