"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Promise = require("bluebird");

var _require = require("graphql"),
    GraphQLObjectType = _require.GraphQLObjectType,
    GraphQLBoolean = _require.GraphQLBoolean,
    GraphQLString = _require.GraphQLString,
    GraphQLInt = _require.GraphQLInt,
    GraphQLFloat = _require.GraphQLFloat,
    GraphQLEnumType = _require.GraphQLEnumType;

var qs = require("qs");
var base64Img = require("base64-img");
var _ = require("lodash");

var ImageFormatType = new GraphQLEnumType({
  name: "ContentfulImageFormat",
  values: {
    NO_CHANGE: { value: "" },
    JPG: { value: "jpg" },
    PNG: { value: "png" },
    WEBP: { value: "webp" }
  }
});

var ImageResizingBehavior = new GraphQLEnumType({
  name: "ImageResizingBehavior",
  values: {
    NO_CHANGE: {
      value: ""
    },
    PAD: {
      value: "pad",
      description: "Same as the default resizing, but adds padding so that the generated image has the specified dimensions."
    },

    CROP: {
      value: "crop",
      description: "Crop a part of the original image to match the specified size."
    },
    FILL: {
      value: "fill",
      description: "Crop the image to the specified dimensions, if the original image is smaller than these dimensions, then the image will be upscaled."
    },
    THUMB: {
      value: "thumb",
      description: "When used in association with the f parameter below, creates a thumbnail from the image based on a focus area."
    },
    SCALE: {
      value: "scale",
      description: "Scale the image regardless of the original aspect ratio."
    }
  }
});

var ImageCropFocusType = new GraphQLEnumType({
  name: "ContentfulImageCropFocus",
  values: {
    TOP: { value: "top" },
    TOP_LEFT: { value: "top_left" },
    TOP_RIGHT: { value: "top_right" },
    BOTTOM: { value: "bottom" },
    BOTTOM_RIGHT: { value: "bottom_left" },
    BOTTOM_LEFT: { value: "bottom_right" },
    RIGHT: { value: "right" },
    LEFT: { value: "left" },
    FACES: { value: "faces" }
  }
});

var isImage = function isImage(image) {
  return _.includes(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"], image.file.contentType);
};

var getBase64Image = function getBase64Image(imgUrl) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var requestUrl = "https:" + imgUrl + "?w=20";
  // TODO add caching.
  var urlArgs = { width: 20, height: 20 / args.aspectRatio };
  return new Promise(function (resolve) {
    base64Img.requestBase64(requestUrl, function (a, b, body) {
      resolve(body);
    });
  });
};

var getBase64ImageAndBasicMeasurements = function getBase64ImageAndBasicMeasurements(image, args) {
  return new Promise(function (resolve) {
    getBase64Image(image.file.url, args).then(function (base64Str) {
      var aspectRatio = void 0;
      if (args.width && args.height) {
        aspectRatio = args.width / args.height;
      } else {
        aspectRatio = image.file.details.image.width / image.file.details.image.height;
      }

      resolve({
        contentType: image.file.contentType,
        base64Str: base64Str,
        aspectRatio: aspectRatio,
        width: image.file.details.image.width,
        height: image.file.details.image.height
      });
    });
  });
};
var createUrl = function createUrl(imgUrl) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Convert to Contentful names and filter out undefined/null values.
  var args = _.pickBy({
    w: options.width,
    h: options.height,
    fl: options.jpegProgressive ? "progressive" : null,
    q: options.quality,
    fm: options.toFormat ? options.toFormat : "",
    fit: options.resizingBehavior ? options.resizingBehavior : "",
    f: options.cropFocus ? options.cropFocus : ""
  }, _.identity);
  return imgUrl + "?" + qs.stringify(args);
};
exports.createUrl = createUrl;

var resolveResponsiveResolution = function resolveResponsiveResolution(image, options) {
  if (isImage(image)) {
    return new Promise(function (resolve) {
      getBase64ImageAndBasicMeasurements(image, options).then(function (_ref) {
        var contentType = _ref.contentType,
            base64Str = _ref.base64Str,
            width = _ref.width,
            height = _ref.height,
            aspectRatio = _ref.aspectRatio;

        var desiredAspectRatio = aspectRatio;

        // If we're cropping, calculate the specified aspect ratio.
        if (options.height) {
          desiredAspectRatio = options.width / options.height;
        }

        // If the user selected a height (so cropping) and options for focus
        // and fit aren't set, we'll set our defaults
        if (options.height) {
          if (!options.resizingBehavior) {
            options.resizingBehavior = "fill";
          }
          if (!options.cropFocus) {
            options.cropFocus = "faces";
          }
        }

        // Create sizes (in width) for the image. If the width of the
        // image is 800px, the sizes would then be: 800, 1200, 1600,
        // 2400.
        //
        // This is enough sizes to provide close to the optimal image size for every
        // device size / screen resolution
        var sizes = [];
        sizes.push(options.width);
        sizes.push(options.width * 1.5);
        sizes.push(options.width * 2);
        sizes.push(options.width * 3);
        sizes = sizes.map(Math.round);

        // Filter out sizes larger than the image's width.
        var filteredSizes = sizes.filter(function (size) {
          return size < width;
        });

        // Sort sizes for prettiness.
        var sortedSizes = _.sortBy(filteredSizes);

        // Create the srcSet.
        var srcSet = sortedSizes.map(function (size, i) {
          var resolution = void 0;
          switch (i) {
            case 0:
              resolution = "1x";
              break;
            case 1:
              resolution = "1.5x";
              break;
            case 2:
              resolution = "2x";
              break;
            case 3:
              resolution = "3x";
              break;
            default:
          }
          var h = Math.round(size / desiredAspectRatio);
          return createUrl(image.file.url, _extends({}, options, {
            width: size,
            height: h
          })) + " " + resolution;
        }).join(",\n");

        var pickedHeight = void 0;
        if (options.height) {
          pickedHeight = options.height;
        } else {
          pickedHeight = options.width / desiredAspectRatio;
        }

        return resolve({
          base64: base64Str,
          aspectRatio: aspectRatio,
          width: Math.round(options.width),
          height: Math.round(pickedHeight),
          src: createUrl(image.file.url, _extends({}, options, {
            width: options.width
          })),
          srcSet: srcSet
        });
      });
    });
    return null;
  }
};
exports.resolveResponsiveResolution = resolveResponsiveResolution;

var resolvefluid = function resolvefluid(image, options) {
  if (isImage(image)) {
    return new Promise(function (resolve) {
      getBase64ImageAndBasicMeasurements(image, options).then(function (_ref2) {
        var contentType = _ref2.contentType,
            base64Str = _ref2.base64Str,
            width = _ref2.width,
            height = _ref2.height,
            aspectRatio = _ref2.aspectRatio;

        var desiredAspectRatio = aspectRatio;

        // If we're cropping, calculate the specified aspect ratio.
        if (options.maxHeight) {
          desiredAspectRatio = options.maxWidth / options.maxHeight;
        }

        // If the users didn't set a default sizes, we'll make one.
        if (!options.sizes) {
          options.sizes = "(max-width: " + options.maxWidth + "px) 100vw, " + options.maxWidth + "px";
        }

        // Create sizes (in width) for the image. If the max width of the container
        // for the rendered markdown file is 800px, the sizes would then be: 200,
        // 400, 800, 1200, 1600, 2400.
        //
        // This is enough sizes to provide close to the optimal image size for every
        // device size / screen resolution
        var sizes = [];
        sizes.push(options.maxWidth / 4);
        sizes.push(options.maxWidth / 2);
        sizes.push(options.maxWidth);
        sizes.push(options.maxWidth * 1.5);
        sizes.push(options.maxWidth * 2);
        sizes.push(options.maxWidth * 3);
        sizes = sizes.map(Math.round);

        // Filter out sizes larger than the image's maxWidth.
        var filteredSizes = sizes.filter(function (size) {
          return size < width;
        });

        // Add the original image to ensure the largest image possible
        // is available for small images.
        filteredSizes.push(width);

        // Sort sizes for prettiness.
        var sortedSizes = _.sortBy(filteredSizes);

        // Create the srcSet.
        var srcSet = sortedSizes.map(function (width) {
          var h = Math.round(width * desiredAspectRatio);
          return createUrl(image.file.url, _extends({}, options, {
            width: width,
            height: h
          })) + " " + Math.round(width) + "w";
        }).join(",\n");

        return resolve({
          base64: base64Str,
          aspectRatio: aspectRatio,
          src: createUrl(image.file.url, _extends({}, options, {
            width: options.maxWidth,
            height: options.maxHeight
          })),
          srcSet: srcSet,
          sizes: options.sizes
        });
      });
    });
    return null;
  }
};
exports.resolvefluid = resolvefluid;

var resolveResize = function resolveResize(image, options) {
  return new Promise(function (resolve) {
    if (isImage(image)) {
      getBase64ImageAndBasicMeasurements(image, options).then(function (_ref3) {
        var contentType = _ref3.contentType,
            base64Str = _ref3.base64Str,
            width = _ref3.width,
            height = _ref3.height,
            aspectRatio = _ref3.aspectRatio;

        // If the user selected a height (so cropping) and options for focus
        // and fit aren't set, we'll set our defaults
        if (options.height) {
          if (!options.resizingBehavior) {
            options.resizingBehavior = "fill";
          }
          if (!options.cropFocus) {
            options.cropFocus = "faces";
          }
        }

        if (options.base64) {
          return resolve(base64Str);
        } else {
          var pickedWidth = options.width;
          var pickedHeight = void 0;
          if (options.height) {
            pickedHeight = options.height;
          } else {
            pickedHeight = pickedWidth / aspectRatio;
          }
          resolve({
            src: createUrl(image.file.url, options),
            width: Math.round(pickedWidth),
            height: Math.round(pickedHeight),
            aspectRatio: aspectRatio,
            base64: base64Str
          });
        }
      });
    } else {
      resolve();
    }
  });
};

exports.resolveResize = resolveResize;

exports.extendNodeType = function (_ref4) {
  var type = _ref4.type;

  if (type.name !== "ContentfulAsset") {
    return {};
  }

  return {
    responsiveResolution: {
      type: new GraphQLObjectType({
        name: "ContentfulResponsiveResolution",
        fields: {
          base64: { type: GraphQLString },
          aspectRatio: { type: GraphQLFloat },
          width: { type: GraphQLFloat },
          height: { type: GraphQLFloat },
          src: { type: GraphQLString },
          srcSet: { type: GraphQLString }
        }
      }),
      args: {
        width: {
          type: GraphQLInt,
          defaultValue: 400
        },
        height: {
          type: GraphQLInt
        },
        quality: {
          type: GraphQLInt,
          defaultValue: 50
        },
        toFormat: {
          type: ImageFormatType,
          defaultValue: ""
        },
        resizingBehavior: {
          type: ImageResizingBehavior
        },
        cropFocus: {
          type: ImageCropFocusType,
          defaultValue: null
        }
      },
      resolve: function resolve(image, options, context) {
        return resolveResponsiveResolution(image, options);
      }
    },
    fluid: {
      type: new GraphQLObjectType({
        name: "Contentfulfluid",
        fields: {
          base64: { type: GraphQLString },
          aspectRatio: { type: GraphQLFloat },
          src: { type: GraphQLString },
          srcSet: { type: GraphQLString },
          sizes: { type: GraphQLString }
        }
      }),
      args: {
        maxWidth: {
          type: GraphQLInt,
          defaultValue: 800
        },
        maxHeight: {
          type: GraphQLInt
        },
        quality: {
          type: GraphQLInt,
          defaultValue: 50
        },
        toFormat: {
          type: ImageFormatType,
          defaultValue: ""
        },
        resizingBehavior: {
          type: ImageResizingBehavior
        },
        cropFocus: {
          type: ImageCropFocusType,
          defaultValue: null
        },
        sizes: {
          type: GraphQLString
        }
      },
      resolve: function resolve(image, options, context) {
        return resolvefluid(image, options);
      }
    },
    resize: {
      type: new GraphQLObjectType({
        name: "ContentfulResize",
        fields: {
          src: { type: GraphQLString },
          width: { type: GraphQLInt },
          height: { type: GraphQLInt },
          aspectRatio: { type: GraphQLFloat }
        }
      }),
      args: {
        width: {
          type: GraphQLInt,
          defaultValue: 400
        },
        height: {
          type: GraphQLInt
        },
        quality: {
          type: GraphQLInt,
          defaultValue: 50
        },
        jpegProgressive: {
          type: GraphQLBoolean,
          defaultValue: true
        },
        resizingBehavior: {
          type: ImageResizingBehavior
        },
        base64: {
          type: GraphQLBoolean,
          defaultValue: false
        },
        toFormat: {
          type: ImageFormatType,
          defaultValue: ""
        },
        cropFocus: {
          type: ImageCropFocusType,
          defaultValue: null
        }
      },
      resolve: function resolve(image, options, context) {
        return resolveResize(image, options);
      }
    }
  };
};