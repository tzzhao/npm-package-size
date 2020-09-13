import {PackageInformation} from 'npm-pkg-utils';
import * as React from 'react';
import {connect} from 'react-redux';
import {RootState} from '../../store/state';
import {BarProperties} from '../BarGraph/Bar';
import {BarGraph} from '../BarGraph/BarGraph';

export interface PackageInfoGraphProperties {
  packagesInformation: PackageInformation[]
}

let PackageInfoGraph: React.FC<Partial<PackageInfoGraphProperties>> = props => {
    const pkgInfo: PackageInformation[] = props.packagesInformation!;
    const maxSize: number = Math.max.apply(null, pkgInfo.map(info => info.size));
    const barsProps: BarProperties[] = pkgInfo
        .reduce((barsProps: BarProperties[], currentBarProp: PackageInformation) => {
          const name: string = `${currentBarProp.name}@${currentBarProp.version}`;

          const size: number = currentBarProp.size;
          barsProps.push(
              {
                height: `${size / maxSize * 100}%`,
                width: '50px',
                description: `Minified size: ${size}`,
                name
              }
          );

          const gzipSize: number = currentBarProp.gzip;
          barsProps.push(
              {
                height: `${gzipSize / maxSize * 100}%`,
                width: '50px',
                description: `${gzipSize}`,
                name
              }
          );
          return barsProps;
        }, []);
    return <BarGraph barsProps={barsProps}/>;
};

const mapStateToProps  = (state: RootState) => {
  return {
    packagesInformation: state.packageInfos
  };
};

PackageInfoGraph = connect(mapStateToProps)(PackageInfoGraph);

export default PackageInfoGraph;
