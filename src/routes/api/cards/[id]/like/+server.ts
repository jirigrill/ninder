import { json, type RequestHandler } from "@sveltejs/kit";

import * as db from '../../../data';

export const POST: RequestHandler = async ({params}) => {
    const id: string | undefined = params.id;

    try{
        db.updateSwipeStatus(id, "like");
        return new Response(null, { status: 204 });
    } catch(exception) {
        if(exception === `A card with the id ${id} wasn't found!`) {
            return new Response(null, { status: 404});
        }

        return new Response(null, { status: 400});
    }
};