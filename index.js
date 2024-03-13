import { obj } from 'through2';
import heml from '@dragonzap/heml';
import path from 'path';
var ext = ".html";

export default options => {
    return obj((file, enc, cb) => {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            console.log("Gulp-HEML: Streaming not supported")
            return;
        }

        heml(file.contents.toString(), options).then(({html, metadata, errors}) => {
            file.contents = Buffer.from(html);
            var replaceExt = replaceExt || false;
            if (typeof ext === 'string' && ext.length > 0) {
                ext = ext.indexOf('.') === 0
                    ? ext
                    : '.' + ext;
                let filePath = path.parse(file.path);
                filePath.base = filePath.base.replace(
                    replaceExt
                    ? replaceExt
                    : path.extname(file.path),
                ext);
                // format the path back into an absolute
                file.path = path.format(filePath);
            }

            cb(null, file);
        });

    });
};

export { heml };
