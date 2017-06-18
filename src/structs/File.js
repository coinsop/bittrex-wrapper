import * as fs from 'fs';

class File {
  constructor(path) {
    this.path = path;
  }

  open(rewrite) {
    return new Promise((resolve, reject) => {
      fs.open(this.path, 'wx', (eo, fd) => {
        if (eo) {
          if (rewrite && eo.code === 'EEXIST') {
            fs.unlink(this.path, (eu) => {
              if (eu) {
                reject(eu);
              } else {
                fs.open(this.path, 'wx', (_eo, _fd) => {
                  if (_eo) {
                    reject(_eo);
                  } else {
                    resolve(_fd);
                  }
                });
              }
            });
          } else {
            reject(eo);
          }
        } else {
          resolve(fd);
        }
      });
    });
  }

  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  write(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.path, data, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  delete() {
    return new Promise((resolve, reject) => {
      fs.unlink(this.path, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  close(fd) { // eslint-disable-line class-methods-use-this
    return new Promise((resolve, reject) => {
      fs.close(fd, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}

export default File;
