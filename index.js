const { obj } = require("through2");
const heml = require("@dragonzap/heml");
const path = require("path");
var ext = ".html";

exports.default = (options) => {
  return obj((file, enc, cb) => {
    console.log("Gulp-HEML: starting to process file: " + file.path);

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      console.log("Gulp-HEML: Streaming not supported");
      return cb();
    }

    return heml(file.contents.toString(), options)
      .then((hemlResp) => {
        console.log("Gulp-HEML: starting to process file: " + file.path);
        file.contents = Buffer.from(hemlResp.html);
        var replaceExt = replaceExt || false;
        if (typeof ext === "string" && ext.length > 0) {
          ext = ext.indexOf(".") === 0 ? ext : "." + ext;
          let filePath = path.parse(file.path);
          filePath.base = filePath.base.replace(
            replaceExt ? replaceExt : path.extname(file.path),
            ext,
          );
          // format the path back into an absolute
          file.path = path.format(filePath);
        }

        console.log("Gulp-HEML: finished processing file: " + file.path);

        this.push(file);
      })
      .then(() => cb());
  });
};
