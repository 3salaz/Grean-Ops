// src/integrations/trello/trelloClient.ts
import fetch from "node-fetch";
import { secrets } from "../../common/secrets";

const BASE = "https://api.trello.com/1";

function trelloUrl(path: string, params: Record<string, string | undefined> = {}) {
    const url = new URL(`${BASE}${path}`);
    url.searchParams.set("key", secrets.trelloKey);
    url.searchParams.set("token", secrets.trelloToken);
    Object.entries(params).forEach(([k, v]) => {
        if (v != null) url.searchParams.set(k, v);
    });
    return url.toString();
}

export const trelloClient = {
    createCard: async (opts: {
        listId: string;
        name: string;
        desc?: string;
        urlSource?: string;
    }) => {
        const res = await fetch(
            trelloUrl("/cards", {
                idList: opts.listId,
                name: opts.name,
                desc: opts.desc,
                urlSource: opts.urlSource,
            }),
            { method: "POST" }
        );
        if (!res.ok) {
            throw new Error(`Trello createCard failed: ${res.statusText}`);
        }
        return res.json();
    },
};
