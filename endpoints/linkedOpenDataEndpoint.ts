import { Request, Response, Express } from "express";
import {environment as env} from '../main';
import fetch from "node-fetch";
import { serveFrontend } from "base-graphql";


const acceptHeadersForFormat: Record<string, string> = {
    "application/rdf+xml": "application/rdf+xml",
    "text/turtle": "text/turtle",
    "application/json+ld": "application/json+ld",
    "application/n-triples": "application/n-triples"
};

const returnEntityInFormat = async (
    entityId: string,
    format: string,
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const headers = {
            accept: acceptHeadersForFormat[format],
            authorization: req.headers.authorization as string,
        };
        const response = await fetch(
            `${env?.api.collectionApiUrl}/entities/${entityId}`,
            { headers }
        );

        const responseText = await response.text();
        res.status(response.status).setHeader('Content-Type', acceptHeadersForFormat[format]);
        res.end(responseText);
    } catch (exception: any) {
        const status = exception.extensions.response.status || 500;
        const statusText = exception.extensions.response.statusText || String(exception);
        res.status(status).end(statusText);
        res.end(JSON.stringify(exception));
    }
};

const isEntityPresent = async (
    id: string,
    req: Request
): Promise<boolean> => {
    const headers = {
        authorization: req.headers.authorization as string,
    };
    const response = await fetch(
        `${env?.api.collectionApiUrl}entities/${id}`,
        {
            headers,
        }
    );
    return response.status !== 404;
};


const getEntityIdFromPath = (path: string): string => {
    const regex = /\/([^\/]+)$/;
    return path.match(regex)![1];
};

const shouldServeFrontend = (format: string | undefined, req: Request, res: Response): void => {
    if (!format || acceptHeadersForFormat[format] === undefined ) {
        console.log("Serving frontend");
        serveFrontend(req, res);
    }
};

export const applyLinkedOpenDataEndpoint = (app: Express) => {
    app.get("/*", async (req: Request, res: Response): Promise<void> => {
        try {
            const format = req.headers.accept;
            shouldServeFrontend(format, req, res);
            console.log("NOT serving frontend");

            const entityId = getEntityIdFromPath(req.url);
            if (await isEntityPresent(entityId, req)) await returnEntityInFormat(entityId, format!, req, res)
            else res.status(404).end("Entity not found!");
        } catch (exception: any) {
            const status = exception.extensions.response.status || 500;
            const statusText = exception.extensions.response.statusText || String(exception);
            res.status(status).end(statusText);
            res.end(JSON.stringify(exception));
        }

    });

}