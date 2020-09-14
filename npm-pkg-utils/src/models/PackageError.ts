export class PackageError {
  public name: string = '';
  public message: string = '';
  constructor(error: any, public pkgName: string, public pkgVersion: string){
    if (error) {
      this.name = error.name;
      this.message = error.message;
    }
  }
}
