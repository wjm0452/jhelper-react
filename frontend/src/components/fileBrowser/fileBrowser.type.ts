type FileType = {
  type: string;
  name: string;
  path: string;
  owner: string;
  lastModifiedTime: string;
};

type FileBrowserFilterType = {
  type?: string;
  name?: string;
  from?: string;
  to?: string;
  exclusionName?: string;
  includeSubDirs?: boolean;
};
