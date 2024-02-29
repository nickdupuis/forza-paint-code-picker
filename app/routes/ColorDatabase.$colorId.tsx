import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import ColorInfo from "~/components/ColorInfo";
import ColorPreview from "~/components/ColorPreview";
import prisma from "~/prisma";
import { CarColor } from "~/types/CarColor";

export const meta: MetaFunction = () => {
    return [
        { title: "Forza Color Selector" },
    ];
};

export default function ColorId() {

    const selectedColor: CarColor = useLoaderData();

    return (
        <div>
            <ColorInfo selectedColor={selectedColor} />
            <ColorPreview selectedColor={selectedColor} />
        </div>
    );
}

export async function loader({ params }: LoaderFunctionArgs) {
    return json(await prisma.colors.findFirst({
        where: {
            id: parseInt(params.colorId!)
        }
    }));
}
