import type { MetaFunction } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import ColorInfo from "~/components/ColorInfo";
import ColorPreview from "~/components/ColorPreview";
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

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
    const res = await fetch(`${import.meta.env.BASE_URL}colors.json`);
    const colors: CarColor[] = await res.json();
    return colors.find((c) => c.id === params.colorId) ?? null;
}

clientLoader.hydrate = true;
