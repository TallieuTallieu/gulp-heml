import { obj } from "through2";
import heml from "@dragonzap/heml";
import path from "path";
var ext = ".html";

export default (options) => {
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

    if (file.isBuffer()) {
      const content = String(file.contents);

      return heml(content, options).then((hemlResp) => {
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
        return cb();
      });
    }

    return cb();
  });
};

export { heml };
