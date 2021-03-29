import iconMap from '../generated/icon-map.json';
import { filenameFromPath } from './format';

type IconDefinitionsKey = keyof typeof iconMap['iconDefinitions'];
type FileNamesKey = keyof typeof iconMap['fileNames'];
type FileExtensionsKey = keyof typeof iconMap['fileExtensions'];

const ICONS_URL =
  process.env.NODE_ENV === 'production'
    ? 'assets/icons'
    : '../../../dist/app/assets/icons';

export function getIconUrlByName(iconName: IconDefinitionsKey): string {
  return `${ICONS_URL}/${iconName}.svg`;
}

export function getIconUrlForPath(path: string): string {
  const fileName = filenameFromPath(path);
  const iconName = getIconNameForFileName(fileName) as IconDefinitionsKey;
  return getIconUrlByName(iconName);
}

function getIconNameForFileName(fileName: string): string {
  return (
    iconMap.fileNames[fileName as FileNamesKey] ??
    iconMap.fileNames[fileName.toLowerCase() as FileNamesKey] ??
    iconMap.fileExtensions[getFileExtension(fileName)] ??
    (fileName.endsWith('.ts') ? 'typescript' : null) ??
    (fileName.endsWith('.js') ? 'javascript' : null) ??
    'file'
  );
}

function getFileExtension(fileName: string): FileExtensionsKey {
  return fileName.substr(fileName.indexOf('.') + 1) as FileExtensionsKey;
}
