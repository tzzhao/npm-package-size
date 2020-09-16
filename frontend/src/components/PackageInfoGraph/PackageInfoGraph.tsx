import {PackageError, PackageInformation} from 'npm-pkg-utils';
import * as React from 'react';
import {connect} from 'react-redux';
import {RootState} from '../../store/state';
import {getDisplaySize} from '../../utils/size';
import {BarProperties} from '../BarGraph/Bar';
import {BarGraph} from '../BarGraph/BarGraph';

export interface PackageInfoGraphProperties {
  packagesInformation: PackageInformation[]
}

const PackageInfoGraphNotConnected: React.FC<Partial<PackageInfoGraphProperties>> = props => {
    const pkgInfos = props.packagesInformation!.filter(info => info.size);

    const {biggestPackageSize, failedPackages} = getBiggestPackageSizeAndFailedPackages(props.packagesInformation!);

    const failedPackagesMessage =
        failedPackages.length > 0 ? `An issue occurred while processing the following packages: ${failedPackages.join(', ')}` : '';

    const barsProps = computeBarProperties(pkgInfos, biggestPackageSize);

    return (
        <div>
          <BarGraph barsProps={barsProps} title={props.packagesInformation![0]?.pkgName}/>
          {failedPackagesMessage ? <div className="bar-graph-error">{failedPackagesMessage}</div> : ''}
        </div>
    );
};

function getBiggestPackageSizeAndFailedPackages(packagesInformation: PackageInformation[])
    : {biggestPackageSize: number, failedPackages: string[]} {
  const failedPackages: string[] = [];
  let maxSize = 0;
  for (const pkgInfo of packagesInformation) {
    const pkgSize: number = pkgInfo.size;
    if (!pkgSize) {
      failedPackages.push(`${pkgInfo.pkgName}@${pkgInfo.pkgVersion} (${(pkgInfo as any as PackageError).name})`);
    } else {
      maxSize = Math.max(pkgSize, maxSize);
    }
  }
  return {biggestPackageSize: maxSize, failedPackages};
}

function computeBarProperties(pkgInfos: PackageInformation[], maxSize: number): BarProperties[] {
    return pkgInfos
      .reduce((barsProps: BarProperties[], currentBarProp: PackageInformation) => {
        const name = currentBarProp.pkgVersion;
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

const mapStateToPackageInfoGraphProps  = (state: RootState) => {
  return {
    packagesInformation: state.packageInfos
  };
};

export const PackageInfoGraph = connect(mapStateToPackageInfoGraphProps)(PackageInfoGraphNotConnected);
