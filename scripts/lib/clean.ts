import {FileSystemUtils} from '../../src/core/utils/file-system.utils';
import * as os from 'os';

export class Clean {
  public static execute(args: string[]): Promise<void[]> {
    return this.extractFileNames(args)
      .then(fileNames => Promise.all(fileNames.map(filename => this.clean(filename))));
  }

  private static extractFileNames(args: string[]): Promise<string[]> {
    if (os.platform() === 'win32')
      return this.extractWin32PlatformFiles(args);
    else
      return Promise.resolve(args.slice(2, args.length));
  }

  private static extractWin32PlatformFiles(args: string[]): Promise<string[]> {
    const filename: string = args[2];
    return FileSystemUtils.readdir(filename.replace('*', ''));
  }

  private static clean(filename: string): Promise<void> {
    return FileSystemUtils.stat(filename)
      .then(fileStat => {
        if (fileStat.isFile())
          return FileSystemUtils.rm(filename);
        else
          return FileSystemUtils.rmdir(filename);
      })
      .then(() => {
        console.log(` ${ filename } deleted`);
      })
      .catch(error => {
        console.log(` ${ filename } not be deleted`);
      });
  }
}
