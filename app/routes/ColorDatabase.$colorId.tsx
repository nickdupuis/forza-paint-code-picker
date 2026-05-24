import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import ColorInfo from "~/components/ColorInfo";
import ColorPreview from "~/components/ColorPreview";
import { loadColors } from "~/helpers/loadColors";
import { CarColor } from "~/types/CarColor";

export const meta: MetaFunction = () => {
    return [
        { title: "Forza Color Selector" },
    ];
};

export default function ColorId() {

    const selectedColor: CarColor = useLoaderData();

    return (
        <div className="flex gap-12">
            <ColorInfo selectedColor={selectedColor} />
            <ColorPreview selectedColor={selectedColor} />
        </div>
    );
}

export async function loader({ params }: LoaderFunctionArgs) {
    const colors = loadColors();
    const color = colors.find((c) => c.id === params.colorId);
    return json(color ?? null);
}
