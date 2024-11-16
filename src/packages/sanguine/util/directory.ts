export const getValidDirectory = (directory: string) => {
    if (directory.includes('..')) throw new Error(`invalid directory ${directory}`);

    let validDirectory = directory;
    if (!validDirectory.startsWith('./')) {
        validDirectory = './' + validDirectory;
    }

    return validDirectory;
}