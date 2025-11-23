// src/services/docsService.ts

// For now, stub: later you wire this into Google Drive API.
export const docsService = {
    createClientFolderTree: async (clientName: string) => {
        // TODO: create folder in Drive using service account
        // For now, pretend we made a folder:
        const fakeUrl = `https://drive.google.com/fake-folder/${encodeURIComponent(
            clientName
        )}`;
        return { url: fakeUrl };
    },
};
