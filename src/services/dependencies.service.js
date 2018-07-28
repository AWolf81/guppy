// @flow
import packageMan from './package-manager.service';
import { formatCommandForPlatform } from './platform.services';
import { logger } from './logger.service';
const childProcess = window.require('child_process');

export const installDependency = (
  projectPath: string,
  dependencyName: string,
  version: string
) => {
  return new Promise((resolve, reject) => {
    const child = childProcess.spawn(
      `${packageMan.addDependencyCommand()} ${dependencyName}@${version} -SE`,
      { cwd: projectPath },
      (err, res) => {
        err ? reject(err) : resolve(res);
      }
    );
    logger(child);
  });
};

export const uninstallDependency = (
  projectPath: string,
  dependencyName: string
) => {
  return new Promise((resolve, reject) => {
    console.log('uninstall', projectPath);
    const child = childProcess.spawn(
      `${packageMan.removeDependencyCommand()} ${dependencyName}`,
      { cwd: projectPath },
      (err, res) => {
        err ? reject(err) : resolve(res);
      }
    );

    logger(child);
  });
};

export const reinstallDependencies = (projectPath: string) => {
  return new Promise((resolve, reject) => {
    const child = childProcess.spawn(
      packageMan.addDependencyCommand(),
      { cwd: projectPath },
      (err, res) => {
        err ? reject(err) : resolve(res);
      }
    );
    logger(child);
  });
};
