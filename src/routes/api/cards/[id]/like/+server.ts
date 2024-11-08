import { json, type RequestHandler } from "@sveltejs/kit";

import * as db from '../../../data';

export const POST: RequestHandler = async ({params}) => {
    const id: string | undefined = params.id;

    if(id === undefined) {
        return new Response(null, { status: 404});
    }

    try{
        db.updateSwipeStatus(id, "liked");
        return new Response(null, { status: 204 });
    } catch(exception) {
        if(exception === `A card with the id ${id} wasn't found!`) {
            return new Response(null, { status: 404});
        }

        return new Response(null, { status: 400});
    }
};