import {PackageInformation} from 'npm-pkg-utils';
import * as React from 'react';
import {connect} from 'react-redux';
import {RootState} from '../../store/state';
import {getDisplaySize} from '../../utils/size';
import {BarProperties} from '../BarGraph/Bar';
import {BarGraph} from '../BarGraph/BarGraph';

export interface PackageInfoGraphProperties {
  packagesInformation: PackageInformation[]
}

let PackageInfoGraph: React.FC<Partial<PackageInfoGraphProperties>> = props => {
    const pkgInfos = props.packagesInformation!.filter(info => info.size);

    const {biggestPackageSize, failedPackages} = getBiggestPackageSizeAndFailedPackages(props.packagesInformation!);

    const failedPackagesMessage =
        failedPackages.length > 0 ? `An issue occurred while processing the following packages: ${failedPackages.join(', ')}` : '';

    const barsProps = computeBarProperties(pkgInfos, biggestPackageSize);

    return (
        <div>
          <BarGraph barsProps={barsProps}/>
          {failedPackagesMessage ? <div className="bar-graph-error">{failedPackagesMessage}</div> : ''}
        </div>
    );
};

function getBiggestPackageSizeAndFailedPackages(packagesInformation: PackageInformation[])
    : {biggestPackageSize: number, failedPackages: string[]} {
  const failedPackages: string[] = [];
  let maxSize: number = 0;
  for (const pkgInfo of packagesInformation) {
    const pkgSize: number = pkgInfo.size;
    if (!pkgSize) {
      failedPackages.push(`${pkgInfo.pkgName}@${pkgInfo.pkgVersion}`);
    } else {
      maxSize = Math.max(pkgSize, maxSize);
    }
  }
  return {biggestPackageSize: maxSize, failedPackages};
}

function computeBarProperties(pkgInfos: PackageInformation[], maxSize: number): BarProperties[] {
    return pkgInfos
      .reduce((barsProps: BarProperties[], currentBarProp: PackageInformation) => {
        const name: string = `${currentBarProp.pkgName}@${currentBarProp.pkgVersion}`;
        const size: number = currentBarProp.size;
        barsProps.push(
            {
              height: `${size * 100 / maxSize}%`,
              description: `Minified size: ${getDisplaySize(size)}`,
              name: `${name} (minified)`,
              color: '#2B547E'
            }
        );

        const gzipSize: number = currentBarProp.gzip;
        barsProps.push(
            {
              height: `${gzipSize * 100 / maxSize}%`,
              description: `Gzipped size: ${getDisplaySize(gzipSize)}`,
              name: `${name} (gzipped)`,
              color: '#659EC7'
            }
        );
        return barsProps;
      }, []);
}

const mapStateToProps  = (state: RootState) => {
  return {
    packagesInformation: state.packageInfos
  };
};

PackageInfoGraph = connect(mapStateToProps)(PackageInfoGraph);

export default PackageInfoGraph;
