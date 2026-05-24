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
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{selectedColor?.COLOUR_NAME}</h2>
            <p className="text-sm text-gray-500 mb-6">{selectedColor?.MAKE}</p>
            <div className="flex flex-col lg:flex-row gap-8">
                <ColorInfo selectedColor={selectedColor} />
                <ColorPreview selectedColor={selectedColor} />
            </div>
        </div>
    );
}

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
    const res = await fetch(`${import.meta.env.BASE_URL}colors.json`);
    const colors: CarColor[] = await res.json();
    return colors.find((c) => c.id === params.colorId) ?? null;
}

clientLoader.hydrate = true;
